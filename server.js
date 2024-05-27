const express = require("express");
const mongoose = require("mongoose");
const Table = require("./db.js");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected");
    })
    .catch(err => {
        console.error("Error connecting to database:", err);
    });

app.get("/data", (req, res) => {
    Table.find({})
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
