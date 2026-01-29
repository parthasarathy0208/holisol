const mongoose = require('mongoose');
const SubSchema = new mongoose.Schema({
  pallet: Number,
  sleeve: Number,
  lid: Number,
  inserts: Number,
  separator: Number,
  crates: Number,
  dummy: Number
}, { _id: false });

const OemInwardSchema = new mongoose.Schema({
  dispatchDate: String,
  receiveDate: String,
  invoice: String,
  vehicle: String,
  location: String,
  customer: String,
  oem: String,
  partName: String,
  boxes: SubSchema,
  sets: Number,
  shortages: SubSchema,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OEMInwardHistory', OemInwardSchema);
