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

const InventorySchema = new mongoose.Schema({
  customer: String,
  oem: String,
  partName: String,
  oemOrder: Number,   
  itemOrder: Number,
  boxQuantity: SubSchema,
  warehouseStock: SubSchema,
  inward: SubSchema,
  outward: SubSchema,
  damage: SubSchema   // ✅ ADDED
});

module.exports = mongoose.model('Inventory', InventorySchema);
