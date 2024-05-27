const mongoose = require("mongoose");
const SerialPort = require('serialport');
const Table = require('./db.js');
const cors = require('cors');
const express = require("express");
const app = express();
const moment = require('moment');

const corsOption = {
    origin: 'http://localhost:3000',
    methods: 'GET,POST',
    credential: true,
};

app.use(cors(corsOption));

app.get("/data", (req, res) => {
    Table.find({}).sort({ createdAt: 1 })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error("Error fetching data from database:", err);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/lastEntry", (req, res) => {
    Table.findOne({}, null, { sort: { _id: -1 } })
        .then(lastEntry => {
            if (lastEntry) {
                res.json(lastEntry);
            } else {
                res.status(404).send("No entries found in the database.");
            }
        })
        .catch(err => {
            console.error("Error fetching last entry:", err);
            res.status(500).send("Internal Server Error");
        });
});

mongoose.connect("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected");
    })
    .catch(err => {
        console.error("Error connecting to database:", err);
    });

const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
    delimiter: '\r\n'
});

const port = new SerialPort('COM3', {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

function reverseString(str) {
    return str.split("").reverse().join("");
}

let final = {};
let i = 0;
let t_no = 1;
port.pipe(parser);

parser.on('data', function (data) {
    console.log(data);
    if (i % 4 === 0) {
        let temp = data;
        let result = "";
        for (let j = temp.length - 1; j >= 0 && temp[j] !== '='; j--) {
            result += temp[j];
        }
        result = reverseString(result);
        let x = Number(result);
        final.amount = x;
    } else if (i % 4 === 1) {
        final.second = data;
    } else if (i % 4 === 2) {
        final.third = data;
    } else if (i % 4 === 3) {
        final.cid = Number(data);
        const currentDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const currentDateFormatted = moment().format('DD-MM-YYYY');

        let lastinv = 10000;
        let lastcih = 40000;

        Table.findOne({}, 'inventory cashinhand tno').sort({ _id: -1 }).exec()
            .then(le => {
                if (le) {
                    lastinv = le.inventory;
                    lastcih = le.cashinhand;
                    t_no = le.tno + 1;

                    if (final.second === 'i') {
                        final.cash_status = "Cash-In";
                        if (final.third === 'd') {
                            final.dp = 'Due';
                            lastinv -= final.amount;
                        } else if (final.third === 'f') {
                            final.dp = 'Paid';
                            lastinv -= final.amount;
                            lastcih += final.amount;
                        }
                    } else if (final.second === 'o') {
                        final.cash_status = "Cash-Out";
                        if (final.third === 'd') {
                            final.dp = 'Due';
                            lastinv += final.amount;
                        } else if (final.third === 'f') {
                            final.dp = 'Paid';
                            lastinv += final.amount;
                            lastcih -= final.amount;
                        }
                    }

                    const newEntry = new Table({
                        date: currentDateFormatted,
                        time: new Date(currentDate).toTimeString().split(' ')[0],
                        amount: final.amount,
                        cid: final.cid,
                        cash_status: final.cash_status,
                        dp: final.dp,
                        inventory: lastinv,
                        cashinhand: lastcih,
                        tno: t_no,
                    });

                    newEntry.save()
                        .then(() => {
                            console.log("New entry saved:", final);
                        })
                        .catch(err => {
                            console.error("Error saving entry:", err);
                        });

                    final = {};
                } else {
                    console.log("No entries found in the database.");
                    lastinv = 10000;
                    lastcih = 40000;
                    t_no = 1;

                    if (final.second === 'i') {
                        final.cash_status = "Cash-In";
                        if (final.third === 'd') {
                            final.dp = 'Due';
                            lastinv -= final.amount;
                        } else if (final.third === 'f') {
                            final.dp = 'Paid';
                            lastinv -= final.amount;
                            lastcih += final.amount;
                        }
                    } else if (final.second === 'o') {
                        final.cash_status = "Cash-Out";
                        if (final.third === 'd') {
                            final.dp = 'Due';
                            lastinv += final.amount;
                        } else if (final.third === 'f') {
                            final.dp = 'Paid';
                            lastinv += final.amount;
                            lastcih -= final.amount;
                        }
                    }

                    const newEntry = new Table({
                        date: currentDateFormatted,
                        time: new Date(currentDate).toTimeString().split(' ')[0],
                        amount: final.amount,
                        cid: final.cid,
                        cash_status: final.cash_status,
                        dp: final.dp,
                        inventory: lastinv,
                        cashinhand: lastcih,
                        tno: t_no,
                    });

                    newEntry.save()
                        .then(() => {
                            console.log("New entry saved:", final);
                        })
                        .catch(err => {
                            console.error("Error saving entry:", err);
                        });

                    final = {};
                }
            })
            .catch(err => {
                console.error("Error fetching last inventory and cash in hand:", err);
            });
    }
    i++;
});

app.listen(5000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("server running");
    }
});
