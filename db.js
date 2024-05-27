const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tno:{
      type:Number,
      required:[true,"Transaction No. is Required"],
    },
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
    cash_status:{
      type:String,
      required:[true,"cashin/cashout is required"],
    },
    dp:{
      type:String,
      required:[true,"dp is required"],
    }
  },
  { timestamps: true }
);

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
