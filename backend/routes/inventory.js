const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const InwardHistory = require('../models/InwardHistory');
const OEMInwardHistory = require('../models/OEMInwardHistory');
const OutwardHistory = require('../models/OutwardHistory');
const StockTransfer = require('../models/StockTransfer');


// GET /api/inventory/  -> list inventory docs
router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find({});
    res.json(items);
  } catch (err) {
    console.error('GET / inventory error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// Endpoint to accept outward submissions from frontend
router.post('/outward', async (req, res) => {
  try {
    const { entries } = req.body;
    if (!Array.isArray(entries)) return res.status(400).json({ error: 'entries must be an array' });
    const keys = ['pallet', 'sleeve', 'lid', 'inserts', 'separator', 'crates', 'dummy'];
    const results = [];
    for (const e of entries) {
      const customer = e.customer || '';
      const oem = e.oem || '';
      const partName = e.partName || '';
      const invoice = e.invoice || '';
      const vehicle = e.vehicle || '';
      const location = e.location || '';
      const dispatchDate = e.dispatchDate || '';
      const boxes = e.boxes || {};
      const boxesNorm = {};
      keys.forEach(k => boxesNorm[k] = Number(boxes[k] || 0));

      let doc = await Inventory.findOne({ customer, oem, partName });
      if (!doc) {
        doc = new Inventory({
          customer, oem, partName,
          boxQuantity: boxesNorm,
          warehouseStock: { pallet: 0, sleeve: 0, lid: 0, inserts: 0, separator: 0, crates: 0, dummy: 0 },
          inward: { pallet: 0, sleeve: 0, lid: 0, inserts: 0, separator: 0, crates: 0, dummy: 0 },
          outward: boxesNorm
        });
      } else {
        doc.outward = doc.outward || {};
        doc.warehouseStock = doc.warehouseStock || {};
        keys.forEach(k => {
          const prev = Number((doc.warehouseStock && doc.warehouseStock[k]) || 0);
          doc.warehouseStock[k] = prev - boxesNorm[k];
          if (doc.warehouseStock[k] < 0) doc.warehouseStock[k] = 0;
          doc.outward[k] = (doc.outward && doc.outward[k] ? doc.outward[k] : 0) + boxesNorm[k];
        });
      }

      // compute sets and shortages based on boxQuantity
      const boxDef = doc.boxQuantity || null;
      let sets = 0;
      const shortages = {};
      if (boxDef) {
        const possible = [];
        keys.forEach(k => { const b = Number(boxDef[k] || 0); if (b > 0) possible.push(Math.floor((Number(boxesNorm[k] || 0)) / b)); });
        sets = (possible.length > 0) ? Math.min(...possible) : 0;
        keys.forEach(k => {
          const b = Number(boxDef[k] || 0);
          if (b > 0) {
            let shortv = Number(boxesNorm[k] || 0) - sets * b;
            if (shortv < 0) shortv = 0;
            shortages[k] = shortv;
          } else shortages[k] = 0;
        });
      } else {
        keys.forEach(k => shortages[k] = Number(boxesNorm[k] || 0));
      }

      await doc.save();

      // save outward history
      try {
        // Format receive date as DD-MM-YYYY (submission date)
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const formattedReceiveDate = `${dd}-${mm}-${yyyy}`;

        const oh = new OutwardHistory({
          dispatchDate: dispatchDate || '',
          receiveDate: formattedReceiveDate,
          invoice: invoice || '',
          vehicle: vehicle || '',
          location: location || '',
          customer: customer || '',
          oem: oem || '',
          partName: partName || '',
          boxes: boxesNorm
        });
        await oh.save();
      } catch (e) { console.warn('OutwardHistory save failed', e); }

      results.push({ ok: true, customer, oem, partName });
    }

    res.json({ ok: true, results });
  } catch (err) {
    console.error('POST /outward error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// Endpoint to accept inward submissions from frontend
router.post('/inward', async (req, res) => {
  try {
    const { entries } = req.body;
    if (!Array.isArray(entries)) return res.status(400).json({ error: 'entries must be an array' });
    const results = [];
    const keys = ['pallet', 'sleeve', 'lid', 'inserts', 'separator', 'crates', 'dummy'];
    for (const e of entries) {
      const customer = e.customer || '';
      const oem = e.oem || '';
      const partName = e.partName || '';
      const invoice = e.invoice || '';
      const vehicle = e.vehicle || '';
      const location = e.location || '';
      const dispatchDate = e.dispatchDate || '';
      const receiveDate = e.receiveDate || (new Date()).toISOString().slice(0, 10);
      const boxes = e.boxes || {};
      const boxesNorm = {};
      keys.forEach(k => boxesNorm[k] = Number(boxes[k] || 0));

      // find or create inventory doc
      let doc = await Inventory.findOne({ customer, oem, partName });
      if (!doc) {
        // create new inventory with warehouseStock equal to boxesNorm and inward set
        doc = new Inventory({
          customer, oem, partName,
          boxQuantity: boxesNorm,
          warehouseStock: boxesNorm,
          inward: boxesNorm,
          outward: { pallet: 0, sleeve: 0, lid: 0, inserts: 0, separator: 0, crates: 0, dummy: 0 }
        });
      } else {
        // update warehouseStock by adding inward boxes and set inward to boxesNorm
        doc.warehouseStock = doc.warehouseStock || {};
        doc.inward = doc.inward || {};
        keys.forEach(k => {
          const prev = Number((doc.warehouseStock && doc.warehouseStock[k]) || 0);
          doc.warehouseStock[k] = prev + boxesNorm[k];
          doc.inward[k] = (Number(doc.inward[k]) || 0) + boxesNorm[k];
        });
      }

      // compute sets and shortages based on doc.boxQuantity
      const boxDef = (doc.boxQuantity) ? doc.boxQuantity : null;
      let sets = 0;
      const shortages = {};
      if (boxDef) {
        const possible = [];
        keys.forEach(k => { const b = Number(boxDef[k] || 0); if (b > 0) possible.push(Math.floor((Number(boxesNorm[k] || 0)) / b)); });
        sets = (possible.length > 0) ? Math.min(...possible) : 0;
        keys.forEach(k => {
          const b = Number(boxDef[k] || 0);
          if (b > 0) {
            let shortv = Number(boxesNorm[k] || 0) - sets * b;
            if (shortv < 0) shortv = 0;
            shortages[k] = shortv;
          } else shortages[k] = 0;
        });
      } else {
        keys.forEach(k => shortages[k] = Number(boxesNorm[k] || 0));
      }

      await doc.save();

      // save into InwardHistory
      try {
        const hist = new InwardHistory({
          dispatchDate: dispatchDate || '',
          receiveDate: receiveDate || '',
          invoice: invoice || '',
          vehicle: vehicle || '',
          location: location || '',
          customer: customer || '',
          oem: oem || '',
          partName: partName || '',
          boxes: boxesNorm,
          sets: sets,
          shortages: shortages
        });
        await hist.save();
      } catch (eh) {
        console.warn('InwardHistory save failed', eh);
      }

      results.push({ ok: true, customer, oem, partName });
    }

    res.json({ ok: true, results });
  } catch (err) {
    console.error('POST /inward error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});



// POST /oem-inward - store OEM Inward entries in separate collection and update inventory
router.post('/oem-inward', async (req, res) => {
  try {
    const { entries } = req.body;
    if (!Array.isArray(entries)) return res.status(400).json({ error: 'entries must be an array' });
    const results = [];
    const keys = ['pallet', 'sleeve', 'lid', 'inserts', 'separator', 'crates', 'dummy'];
    for (const e of entries) {
      const customer = e.customer || '';
      const oem = e.oem || '';
      const partName = e.partName || '';
      const invoice = e.invoice || '';
      const vehicle = e.vehicle || '';
      const location = e.location || '';
      const dispatchDate = e.dispatchDate || '';
      const receiveDate = e.receiveDate || (new Date()).toISOString().slice(0, 10);
      const boxes = e.boxes || {};
      const boxesNorm = {};
      keys.forEach(k => boxesNorm[k] = Number(boxes[k] || 0));

      // find or create inventory doc
      let doc = await Inventory.findOne({ customer, oem, partName });
      if (!doc) {
        // create new inventory with warehouseStock equal to boxesNorm and inward set
        doc = new Inventory({
          customer, oem, partName,
          boxQuantity: boxesNorm,
          warehouseStock: boxesNorm,
          inward: boxesNorm,
          outward: { pallet: 0, sleeve: 0, lid: 0, inserts: 0, separator: 0, crates: 0, dummy: 0 }
        });
      } else {
        // update warehouseStock by adding inward boxes and set inward to boxesNorm
        doc.warehouseStock = doc.warehouseStock || {};
        doc.inward = doc.inward || {};
        keys.forEach(k => {
          const prev = Number((doc.warehouseStock && doc.warehouseStock[k]) || 0);
          doc.warehouseStock[k] = prev + boxesNorm[k];
          doc.inward[k] = (Number(doc.inward[k]) || 0) + boxesNorm[k];
        });
      }

      // compute sets and shortages based on doc.boxQuantity
      const boxDef = (doc.boxQuantity) ? doc.boxQuantity : null;
      let sets = 0;
      const shortages = {};
      if (boxDef) {
        const possible = [];
        keys.forEach(k => { const b = Number(boxDef[k] || 0); if (b > 0) possible.push(Math.floor((Number(boxesNorm[k] || 0)) / b)); });
        sets = (possible.length > 0) ? Math.min(...possible) : 0;
        keys.forEach(k => {
          const b = Number(boxDef[k] || 0);
          if (b > 0) {
            let shortv = Number(boxesNorm[k] || 0) - sets * b;
            if (shortv < 0) shortv = 0;
            shortages[k] = shortv;
          } else shortages[k] = 0;
        });
      } else {
        keys.forEach(k => shortages[k] = Number(boxesNorm[k] || 0));
      }

      await doc.save();

      // save into InwardHistory
      try {
        const hist = new OEMInwardHistory({
          dispatchDate: dispatchDate || '',
          receiveDate: receiveDate || '',
          invoice: invoice || '',
          vehicle: vehicle || '',
          location: location || '',
          customer: customer || '',
          oem: oem || '',
          partName: partName || '',
          boxes: boxesNorm,
          sets: sets,
          shortages: shortages
        });
        await hist.save();
      } catch (eh) {
        console.warn('InwardHistory save failed', eh);
      }

      results.push({ ok: true, customer, oem, partName });
    }

    res.json({ ok: true, results });
  } catch (err) {
    console.error('POST /inward error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
  // save OEM history entries instead of InwardHistory
  try {
    // results array already built above; replace saving to InwardHistory with OEMInwardHistory
  } catch (e) { }
});

// Endpoint to fetch inward history
router.get('/inward', async (req, res) => {
  try {
    const q = {};
    if (req.query.customer) q.customer = req.query.customer;
    if (req.query.oem) q.oem = req.query.oem;
    if (req.query.partName) q.partName = req.query.partName;
    const docs = await InwardHistory.find(q).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ ok: true, docs });
  } catch (err) {
    console.error('GET /inward error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// Endpoint to fetch outward history
router.get('/outward', async (req, res) => {
  try {
    const q = {};
    if (req.query.customer) q.customer = req.query.customer;
    if (req.query.oem) q.oem = req.query.oem;
    if (req.query.partName) q.partName = req.query.partName;
    const docs = await OutwardHistory.find(q).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ ok: true, docs });
  } catch (err) {
    console.error('GET /outward error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});


// Endpoint to fetch OEM inward history
router.get('/oem-inward', async (req, res) => {
  try {
    const q = {};
    if (req.query.customer) q.customer = req.query.customer;
    if (req.query.oem) q.oem = req.query.oem;
    if (req.query.partName) q.partName = req.query.partName;
    const docs = await OEMInwardHistory.find(q).sort({ createdAt: -1 }).limit(500).lean();
    res.json({ ok: true, docs });
  } catch (err) {
    console.error('GET /oem-inward error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});



// POST /refresh - set inward and outward fields to zero for all inventory items
router.post('/refresh', async (req, res) => {
  try {
    // Build zero object matching SubSchema
    const zero = { pallet: 0, sleeve: 0, lid: 0, inserts: 0, separator: 0, crates: 0, dummy: 0 };
    // Update all Inventory documents: set inward and outward to zero
    await Inventory.updateMany({}, { $set: { inward: zero, outward: zero } });
    res.json({ ok: true, message: 'Inventory inward and outward fields reset to zero.' });
  } catch (err) {
    console.error('POST /inventory/refresh error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});


// GET Inward Summary for Shortage Summary Page (FINAL FIX)
router.get('/inward-summary', async (req, res) => {
  try {
    const { from, to, customer, oem, partName } = req.query;

    const normalize = v => (v || "").trim().toUpperCase();

    const toDMY = (d) => {
      const [y, m, day] = d.split('-');
      return `${day}-${m}-${y}`;
    };

    const fromDMY = toDMY(from);
    const toDMYDate = toDMY(to);

    const records = await InwardHistory.find({});

    const filtered = records.filter(r => {
      if (!r.receiveDate) return false;

      const recordDate = r.receiveDate.trim();

      if (recordDate < fromDMY || recordDate > toDMYDate) return false;
      if (customer && normalize(r.customer) !== normalize(customer)) return false;
      if (oem && normalize(r.oem) !== normalize(oem)) return false;
      if (partName && normalize(r.partName) !== normalize(partName)) return false;

      return true;
    });

    const total = {
      pallet: 0, sleeve: 0, lid: 0,
      inserts: 0, separator: 0,
      crates: 0, dummy: 0
    };

    filtered.forEach(r => {
      const b = r.boxes || {};
      total.pallet += Number(b.pallet || 0);
      total.sleeve += Number(b.sleeve || 0);
      total.lid += Number(b.lid || 0);
      total.inserts += Number(b.inserts || 0);
      total.separator += Number(b.separator || 0);
      total.crates += Number(b.crates || 0);
      total.dummy += Number(b.dummy || 0);
    });


    // compute sets & shortages using Inventory.boxQuantity
    let sets = 0;
    let shortages = { pallet: 0, sleeve: 0, lid: 0, inserts: 0, separator: 0, crates: 0, dummy: 0 };

    const inv = await Inventory.findOne({
      customer: normalize(customer),
      oem: normalize(oem),
      partName: normalize(partName)
    });

    if (inv && inv.boxQuantity) {
      const keys = ['pallet', 'sleeve', 'lid', 'inserts', 'separator', 'crates', 'dummy'];
      const possible = [];
      keys.forEach(k => {
        const b = Number(inv.boxQuantity[k] || 0);
        if (b > 0) possible.push(Math.floor(Number(total[k] || 0) / b));
      });
      sets = possible.length ? Math.min(...possible) : 0;
      keys.forEach(k => {
        shortages[k] = Number(total[k] || 0) - sets * Number(inv.boxQuantity[k] || 0);
      });
    }

    res.json({ ok: true, total, sets, shortages });


  } catch (err) {
    console.error('Inward summary error:', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});
// GET OEM Inward Summary for Shortage Summary Page
router.get('/oem-inward-summary', async (req, res) => {
  try {
    const { from, to, customer, oem, partName } = req.query;

    const normalize = v => (v || "").trim().toUpperCase();

    // OEM Inward receiveDate format = YYYY-MM-DD
    const records = await OEMInwardHistory.find({});

    const filtered = records.filter(r => {
      if (!r.receiveDate) return false;

      const recordDate = r.receiveDate.trim(); // YYYY-MM-DD

      if (recordDate < from || recordDate > to) return false;
      if (customer && normalize(r.customer) !== normalize(customer)) return false;
      if (oem && normalize(r.oem) !== normalize(oem)) return false;
      if (partName && normalize(r.partName) !== normalize(partName)) return false;

      return true;
    });

    const total = {
      pallet: 0,
      sleeve: 0,
      lid: 0,
      inserts: 0,
      separator: 0,
      crates: 0,
      dummy: 0
    };

    filtered.forEach(r => {
      const b = r.boxes || {};
      total.pallet += Number(b.pallet || 0);
      total.sleeve += Number(b.sleeve || 0);
      total.lid += Number(b.lid || 0);
      total.inserts += Number(b.inserts || 0);
      total.separator += Number(b.separator || 0);
      total.crates += Number(b.crates || 0);
      total.dummy += Number(b.dummy || 0);
    });


    // compute sets & shortages using Inventory.boxQuantity
    let sets = 0;
    let shortages = { pallet: 0, sleeve: 0, lid: 0, inserts: 0, separator: 0, crates: 0, dummy: 0 };

    const inv = await Inventory.findOne({
      customer: normalize(customer),
      oem: normalize(oem),
      partName: normalize(partName)
    });

    if (inv && inv.boxQuantity) {
      const keys = ['pallet', 'sleeve', 'lid', 'inserts', 'separator', 'crates', 'dummy'];
      const possible = [];
      keys.forEach(k => {
        const b = Number(inv.boxQuantity[k] || 0);
        if (b > 0) possible.push(Math.floor(Number(total[k] || 0) / b));
      });
      sets = possible.length ? Math.min(...possible) : 0;
      keys.forEach(k => {
        shortages[k] = Number(total[k] || 0) - sets * Number(inv.boxQuantity[k] || 0);
      });
    }

    res.json({ ok: true, total, sets, shortages });


  } catch (err) {
    console.error('OEM Inward summary error:', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});


// STOCK TRANSFER
router.post('/transfer', async (req, res) => {
  try {
    const { fromType, toType, transferDate, from, to, quantities } = req.body;

    const keys = [
      'pallet', 'sleeve', 'lid', 'inserts', 'separator', 'crates', 'dummy'
    ];

    // Normalize quantities
    const q = {};
    keys.forEach(k => q[k] = Number(quantities?.[k] || 0));

    // Build decrement object
    const dec = {};
    const inc = {};

    keys.forEach(k => {
      if (q[k] > 0) {
        dec[`${fromType}.${k}`] = -q[k];
        inc[`${toType}.${k}`] = q[k];
      }
    });

    // 🔴 ATOMIC CHECK + DECREMENT
    const fromUpdated = await Inventory.findOneAndUpdate(
      {
        ...from,
        $expr: {
          $and: keys.map(k => ({
            $gte: [
              { $ifNull: [`$${fromType}.${k}`, 0] },
              q[k]
            ]
          }))
        }
      },
      { $inc: dec },
      { new: true }
    );

    if (!fromUpdated) {
      return res.status(400).json({
        error:
          fromType === 'damage'
            ? 'There is no sufficient inventory in damage.'
            : 'No sufficient inventory in warehouse stock.'
      });
    }

    // ✅ SAFE TO INCREMENT TO SIDE
    await Inventory.updateOne(
      to,
      { $inc: inc }
    );

    // Save transfer history
    // Save transfer history
    await StockTransfer.create({
      fromLocation:
        fromType === 'warehouseStock' ? 'WAREHOUSE STOCK' : 'DAMAGE',

      toLocation:
        toType === 'warehouseStock' ? 'WAREHOUSE STOCK' : 'DAMAGE',

      transferDate,
      fromCustomer: from.customer,
      fromOEM: from.oem,
      fromPartName: from.partName,
      toCustomer: to.customer,
      toOEM: to.oem,
      toPartName: to.partName,
      quantities: q
    });


    res.json({ ok: true });

  } catch (err) {
    console.error('Stock transfer error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/inventory/transfer - fetch stock transfer history
router.get('/transfer', async (req, res) => {
  try {
    const rows = await StockTransfer.find({}).sort({ createdAt: -1 });
    res.json(rows);
  } catch (err) {
    console.error('GET /transfer error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
