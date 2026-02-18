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
const PartSizeSchema = new mongoose.Schema({
  pallet: String,
  sleeve: String,
  lid: String,
  inserts: String,
  separator: String,
  crates: String,
  dummy: String
}, { _id: false });

const PartWeightSchema = new mongoose.Schema({
  pallet: String,
  sleeve: String,
  lid: String,
  inserts: String,
  separator: String,
  crates: String,
  dummy: String
}, { _id: false });




const InventorySchema = new mongoose.Schema({
  customer: String,
  oem: String,
  partName: String,
  loopQty: Number,
  oemOrder: Number,   
  itemOrder: Number,
  partSize: PartSizeSchema,
  partWeight: PartWeightSchema, 
  boxQuantity: SubSchema,
  warehouseStock: SubSchema,
  inward: SubSchema,
  outward: SubSchema,
  damage: SubSchema  
});

module.exports = mongoose.model('Inventory', InventorySchema);
