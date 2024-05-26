const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    cid: {
      type: Number,
      required: [true, "CID is required"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    inventory: {
      type: Number,
      required: [true, "Inventory is required"],
    },
    cashinhand: {
      type: Number,
      required: [true, "Cashinhand is required"],
    },
  },
  { timestamps: true }
);

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
