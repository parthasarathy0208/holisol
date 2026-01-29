const mongoose = require('mongoose');

const QtySchema = new mongoose.Schema({
  pallet: Number,
  sleeve: Number,
  lid: Number,
  inserts: Number,
  separator: Number,
  crates: Number,
  dummy: Number
}, { _id: false });

const StockTransferSchema = new mongoose.Schema({
  fromLocation: String,
  toLocation: String,
  transferDate: Date,

  fromCustomer: String,
  fromOEM: String,
  fromPartName: String,

  toCustomer: String,
  toOEM: String,
  toPartName: String,

  quantities: QtySchema,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockTransfer', StockTransferSchema);
