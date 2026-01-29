// frontend/assets/js/fill_inputs.js
(function () {
  // Fetch and normalize API data, then fill first-row inputs on the page
  function getData(cb) {
    fetch('/api/inventory').then(r => {
      if (!r.ok) throw new Error('API returned ' + r.status);
      return r.json();
    }).then(data => {
      const normalized = (data || []).map(r => ({
        customer: r.customer || r.Customer || r.customerName || '',
        oem: r.oem || r.OEM || '',
        partName: r.partName || r.partname || r.part || '',
        boxQuantity: r.boxQuantity || r.box_quantity || { pallet: null, sleeve: null, lid: null, inserts: null, separator: null, crates: null, dummy: null },
        warehouseStock: r.warehouseStock || r.warehouse_stock || { pallet: null, sleeve: null, lid: null, inserts: null, separator: null, crates: null, dummy: null },
        inward: r.inward || { pallet: null, sleeve: null, lid: null, inserts: null, separator: null, crates: null, dummy: null },
        outward: r.outward || { pallet: null, sleeve: null, lid: null, inserts: null, separator: null, crates: null, dummy: null },
        damage: r.damage || { pallet: null, sleeve: null, lid: null, inserts: null, separator: null, crates: null, dummy: null }
      }));
      window._inventory_normalized = normalized;
      cb(normalized);
    }).catch(err => {
      console.error('fill_inputs.js fetch failed', err);
      cb([]);
    });
  }

  function setVal(el, v) {
    if (!el) return;
    try {
      // if you prefer 0 instead of blank for nulls, replace '' with 0 here
      if ('value' in el) el.value = (v == null ? '' : v);
      else el.textContent = (v == null ? '' : v);
    } catch (e) { console.warn('setVal error', e); }
  }

  function fillFirstRecord(record) {
    if (!record) return;
    const mapping = [
      { sel: '.cust-name, .customer, input[name=customer]', val: record.customer },
      { sel: '.oem-name, .oem, input[name=oem]', val: record.oem },
      { sel: '.part-name, .partName, input[name=partName]', val: record.partName },

      // Box Quantity
      { sel: '.bxqty-pallet, input[name="boxQuantity.pallet"]', val: record.boxQuantity.pallet },
      { sel: '.bxqty-sleeve, input[name="boxQuantity.sleeve"]', val: record.boxQuantity.sleeve },
      { sel: '.bxqty-lid, input[name="boxQuantity.lid"]', val: record.boxQuantity.lid },
      { sel: '.bxqty-inserts, input[name="boxQuantity.inserts"]', val: record.boxQuantity.inserts },
      { sel: '.bxqty-separator, input[name="boxQuantity.separator"]', val: record.boxQuantity.separator },
      { sel: '.bxqty-crates, input[name="boxQuantity.crates"]', val: record.boxQuantity.crates },
      { sel: '.bxqty-dummy, input[name="boxQuantity.dummy"]', val: record.boxQuantity.dummy },

      // Warehouse Stock
      { sel: '.wh-pallet, input[name="warehouseStock.pallet"]', val: record.warehouseStock.pallet },
      { sel: '.wh-sleeve, input[name="warehouseStock.sleeve"]', val: record.warehouseStock.sleeve },
      { sel: '.wh-lid, input[name="warehouseStock.lid"]', val: record.warehouseStock.lid },
      { sel: '.wh-inserts, input[name="warehouseStock.inserts"]', val: record.warehouseStock.inserts },
      { sel: '.wh-separator, input[name="warehouseStock.separator"]', val: record.warehouseStock.separator },
      { sel: '.wh-crates, input[name="warehouseStock.crates"]', val: record.warehouseStock.crates },
      { sel: '.wh-dummy, input[name="warehouseStock.dummy"]', val: record.warehouseStock.dummy },

      // Inward
      { sel: '.in-pallet, input[name="inward.pallet"]', val: record.inward.pallet },
      { sel: '.in-sleeve, input[name="inward.sleeve"]', val: record.inward.sleeve },
      { sel: '.in-lid, input[name="inward.lid"]', val: record.inward.lid },
      { sel: '.in-inserts, input[name="inward.inserts"]', val: record.inward.inserts },
      { sel: '.in-separator, input[name="inward.separator"]', val: record.inward.separator },
      { sel: '.in-crates, input[name="inward.crates"]', val: record.inward.crates },
      { sel: '.in-dummy, input[name="inward.dummy"]', val: record.inward.dummy },

      // Outward
      { sel: '.out-pallet, input[name="outward.pallet"]', val: record.outward.pallet },
      { sel: '.out-sleeve, input[name="outward.sleeve"]', val: record.outward.sleeve },
      { sel: '.out-lid, input[name="outward.lid"]', val: record.outward.lid },
      { sel: '.out-inserts, input[name="outward.inserts"]', val: record.outward.inserts },
      { sel: '.out-separator, input[name="outward.separator"]', val: record.outward.separator },
      { sel: '.out-crates, input[name="outward.crates"]', val: record.outward.crates },
      { sel: '.out-dummy, input[name="outward.dummy"]', val: record.outward.dummy },
      // Damage
      { sel: '.dam-pallet, input[name="damage.pallet"]', val: record.damage?.pallet },
      { sel: '.dam-sleeve, input[name="damage.sleeve"]', val: record.damage?.sleeve },
      { sel: '.dam-lid, input[name="damage.lid"]', val: record.damage?.lid },
      { sel: '.dam-inserts, input[name="damage.inserts"]', val: record.damage?.inserts },
      { sel: '.dam-separator, input[name="damage.separator"]', val: record.damage?.separator },
      { sel: '.dam-crates, input[name="damage.crates"]', val: record.damage?.crates },
      { sel: '.dam-dummy, input[name="damage.dummy"]', val: record.damage?.dummy }

    ];

    mapping.forEach(m => {
      const el = document.querySelector(m.sel);
      if (el) setVal(el, m.val);
    });
  }

  function init() {
    getData(records => {
      if (!records || records.length === 0) {
        console.warn('fill_inputs.js: no records found');
        return;
      }
      fillFirstRecord(records[0]);
      console.log('fill_inputs.js: populated inputs from first inventory record', records[0]);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
