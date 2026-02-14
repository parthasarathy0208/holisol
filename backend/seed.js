// seed.js - tolerant seeder that sanitizes values before inserting
const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('./models/User');
const Inventory = require('./models/Inventory');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/inventorydb';

function sanitizeValue(v) {
  // handle null/undefined
  if (v === null || v === undefined) return null;

  // If the value is already a number, keep it
  if (typeof v === 'number' && !Number.isNaN(v)) return v;

  // If it's boolean, keep it
  if (typeof v === 'boolean') return v;

  // If it's a string, trim and check
  if (typeof v === 'string') {
    const s = v.trim();
    if (s === '' || s === '-' || s.toLowerCase() === 'nan' || s.toLowerCase() === 'null' || s.toLowerCase() === 'n/a') {
      return null;
    }
    // Try to parse as number (integer or float)
    const num = Number(s.replace(/,/g, '')); // strip thousands separators if any
    if (!Number.isNaN(num)) return num;
    // Not a number, return original string
    return s;
  }

  // If it's an object or array, sanitize recursively
  if (Array.isArray(v)) return v.map(sanitizeValue);
  if (typeof v === 'object') {
    const out = {};
    for (const key of Object.keys(v)) {
      out[key] = sanitizeValue(v[key]);
    }
    return out;
  }

  // fallback
  return v;
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding');

    // Clear existing collections
    await User.deleteMany({});
    await Inventory.deleteMany({});

    // Create user ELLA / password 123
    const passwordHash = await bcrypt.hash('123', 10);
    await User.create({ username: 'ELLA', passwordHash });

    // Read and sanitize seed JSON
    let raw = fs.readFileSync('seed_data.json', 'utf-8');

    // Replace token NaN (literal) with null to avoid JSON.parse failure
    raw = raw.replace(/\bNaN\b/g, 'null');

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      console.log('No records found in seed_data.json');
      process.exit(0);
    }

    // Sanitize every object to conform to schema numbers/nulls
    const sanitized = parsed.map(item => {
      const obj = {};
      // keep top-level fields
      obj.customer = sanitizeValue(item.customer);
      obj.oem = sanitizeValue(item.oem);
      obj.partName = sanitizeValue(item.partName);
      obj.oemOrder = sanitizeValue(item.oemOrder);
      obj.itemOrder = sanitizeValue(item.itemOrder);

      function sanitizeGroup(group) {
        // ensure all expected subkeys exist
        const subs = ['pallet','sleeve','lid','inserts','separator','crates','dummy'];
        const out = {};
        if (!group || typeof group !== 'object') {
          subs.forEach(s => out[s] = null);
          return out;
        }
        subs.forEach(s => out[s] = sanitizeValue(group[s]));
        return out;
      }

      obj.boxQuantity = sanitizeGroup(item.boxQuantity);
      obj.warehouseStock = sanitizeGroup(item.warehouseStock);
      obj.inward = sanitizeGroup(item.inward);
      obj.outward = sanitizeGroup(item.outward);
      obj.damage = sanitizeGroup(item.damage);   

      return obj;
    });

    // Bulk insert
    await Inventory.insertMany(sanitized);
    console.log('Seeded', sanitized.length, 'inventory records. Created user ELLA / password 123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();
