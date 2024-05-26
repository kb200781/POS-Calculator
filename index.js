const mongoose = require("mongoose");
const SerialPort = require('serialport');
const Table = require('./db.js');
const cors = require('cors');
const express = require("express");
const app = express();


const corsOption ={
    origin:'http://localhost:3000',
    methods:'GET,POST',
    credential:true,
}

app.use(cors(corsOption))
const moment = require('moment');


// app.get("/test",(req,res)=>{
//     res.send("test");
// })

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


// Define a GET route to retrieve the last entry from the database
app.get("/lastEntry", (req, res) => {
    Table.findOne({}, null, { sort: { _id: -1 } }) // Find the last entry, sorted by _id in descending order
        .then(lastEntry => {
            if (lastEntry) {
                res.json(lastEntry); // Send the last entry as JSON response
            } else {
                res.status(404).send("No entries found in the database."); // If no entry found, send 404 status
            }
        })
        .catch(err => {
            console.error("Error fetching last entry:", err);
            res.status(500).send("Internal Server Error"); // If error occurs, send 500 status
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

port.pipe(parser);

parser.on('data', function (data) {
    console.log(data);
    if (i % 4 === 0) {
        let temp = data;
        let result = "";
        for (let i = temp.length - 1; i >= 0 && temp[i] !== '='; i--) {
            result += temp[i];
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
        const currentDate1 = new Date();
        const currentDateFormatted = moment().format('DD-MM-YYYY');

        let lastinv = 10000;
        let lastcih = 40000;



        Table.findOne({}, 'inventory cashinhand').sort({ _id: -1 }).exec()
            .then(lastEntry => {
                if (lastEntry) {
                    lastinv = lastEntry.inventory;
                    lastcih = lastEntry.cashinhand;

                } else {
                    console.log("No entries found in the database.");

                    lastinv = 10000;
                    lastcih = 40000;
                }


            })
            .catch(err => {
                console.error("Error fetching last inventory and cash in hand:", err);
            });


        if (final.second == 'i') {
            if (final.third == 'd') {
                lastinv -= final.amount;
            }
            else if (final.third == 'f') {
                lastinv -= final.amount;
                lastcih += final.amount;
            }
        }
        else if (final.second == 'o') {
            if (final.third == 'd') {
                lastinv += final.amount;
            }
            else if (final.third == 'f') {
                lastinv += final.amount;
                lastcih -= final.amount;
            }
        }




        const newEntry = new Table({
            date: currentDateFormatted,
            time: new Date(currentDate).toTimeString().split(' ')[0], // Extracting time part only
            amount: final.amount,
            cid: final.cid,

            inventory: lastinv,
            cashinhand: lastcih,
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
    i++;
});

app.listen(5000, (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("server running");
    }
})


