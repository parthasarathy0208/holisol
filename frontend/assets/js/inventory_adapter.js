
// inventory_adapter.js - adapter to fetch and normalize inventory data and populate inputs
(function () {
  function normalize(records) {
    return records.map(r => ({
      customer: r.customer || r.CUSTOMER || r.customerName || '',
      oem: r.oem || r.OEM || '',
      partName: r.partName || r.partname || r['PART NAME'] || '',
      boxQuantity: {
        pallet: (r.boxQuantity && r.boxQuantity.pallet) ?? r['BOX QUANTITY PALLET'] ?? null,
        sleeve: (r.boxQuantity && r.boxQuantity.sleeve) ?? r['BOX QUANTITY SLEEVE'] ?? null,
        lid: (r.boxQuantity && r.boxQuantity.lid) ?? r['BOX QUANTITY LID'] ?? null,
        inserts: (r.boxQuantity && r.boxQuantity.inserts) ?? r['BOX QUANTITY INSERTS'] ?? null,
        separator: (r.boxQuantity && r.boxQuantity.separator) ?? r['BOX QUANTITY SEPERATOR'] ?? null,
        crates: (r.boxQuantity && r.boxQuantity.crates) ?? r['BOX QUANTITY CRATES'] ?? null,
        dummy: (r.boxQuantity && r.boxQuantity.dummy) ?? r['BOX QUANTITY DUMMY'] ?? null
      },
      warehouseStock: {
        pallet: (r.warehouseStock && r.warehouseStock.pallet) ?? r['WAREHOUSE STOCK PALLET'] ?? null,
        sleeve: (r.warehouseStock && r.warehouseStock.sleeve) ?? r['WAREHOUSE STOCK SLEEVE'] ?? null,
        lid: (r.warehouseStock && r.warehouseStock.lid) ?? r['WAREHOUSE STOCK LID'] ?? null,
        inserts: (r.warehouseStock && r.warehouseStock.inserts) ?? r['WAREHOUSE STOCK INSERTS'] ?? null,
        separator: (r.warehouseStock && r.warehouseStock.separator) ?? r['WAREHOUSE STOCK SEPERATOR'] ?? null,
        crates: (r.warehouseStock && r.warehouseStock.crates) ?? r['WAREHOUSE STOCK CRATES'] ?? null,
        dummy: (r.warehouseStock && r.warehouseStock.dummy) ?? r['WAREHOUSE STOCK DUMMY'] ?? null
      },
      inward: {
        pallet: (r.inward && r.inward.pallet) ?? r['INWARD PALLET'] ?? null,
        sleeve: (r.inward && r.inward.sleeve) ?? r['INWARD SLEEVE'] ?? null,
        lid: (r.inward && r.inward.lid) ?? r['INWARD LID'] ?? null,
        inserts: (r.inward && r.inward.inserts) ?? r['INWARD INSERTS'] ?? null,
        separator: (r.inward && r.inward.separator) ?? r['INWARD SEPERATOR'] ?? null,
        crates: (r.inward && r.inward.crates) ?? r['INWARD CRATES'] ?? null,
        dummy: (r.inward && r.inward.dummy) ?? r['INWARD DUMMY'] ?? null
      },
      outward: {
        pallet: (r.outward && r.outward.pallet) ?? r['OUTWARD PALLET'] ?? null,
        sleeve: (r.outward && r.outward.sleeve) ?? r['OUTWARD SLEEVE'] ?? null,
        lid: (r.outward && r.outward.lid) ?? r['OUTWARD LID'] ?? null,
        inserts: (r.outward && r.outward.inserts) ?? r['OUTWARD INSERTS'] ?? null,
        separator: (r.outward && r.outward.separator) ?? r['OUTWARD SEPERATOR'] ?? null,
        crates: (r.outward && r.outward.crates) ?? r['OUTWARD CRATES'] ?? null,
        dummy: (r.outward && r.outward.dummy) ?? r['OUTWARD DUMMY'] ?? null
      },
      damage: {
        pallet: (r.damage && r.damage.pallet) ?? null,
        sleeve: (r.damage && r.damage.sleeve) ?? null,
        lid: (r.damage && r.damage.lid) ?? null,
        inserts: (r.damage && r.damage.inserts) ?? null,
        separator: (r.damage && r.damage.separator) ?? null,
        crates: (r.damage && r.damage.crates) ?? null,
        dummy: (r.damage && r.damage.dummy) ?? null
      }

    }));
  }

  function fillInputsForRow(row, item) {
    // find input elements inside the row
    const inputs = row.querySelectorAll('input, textarea');
    if (!inputs || inputs.length === 0) return false;
    // We'll fill inputs in the expected order: boxQuantity 7, warehouseStock 7, inward 7, outward 7
    const seq = [
      item.boxQuantity.pallet, item.boxQuantity.sleeve, item.boxQuantity.lid, item.boxQuantity.inserts, item.boxQuantity.separator, item.boxQuantity.crates, item.boxQuantity.dummy,
      item.warehouseStock.pallet, item.warehouseStock.sleeve, item.warehouseStock.lid, item.warehouseStock.inserts, item.warehouseStock.separator, item.warehouseStock.crates, item.warehouseStock.dummy,
      item.inward.pallet, item.inward.sleeve, item.inward.lid, item.inward.inserts, item.inward.separator, item.inward.crates, item.inward.dummy,
      item.outward.pallet, item.outward.sleeve, item.outward.lid, item.outward.inserts, item.outward.separator, item.outward.crates, item.outward.dummy, item.damage.pallet, item.damage.sleeve, item.damage.lid, item.damage.inserts, item.damage.separator, item.damage.crates, item.damage.dummy
    ];
    // fill as many inputs as available
    for (let i = 0; i < Math.min(inputs.length, seq.length); i++) {
      const v = seq[i];
      inputs[i].value = (v === null || typeof v === 'undefined' || v === '-') ? '' : v;
      // trigger input events in case page listens
      inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[i].dispatchEvent(new Event('change', { bubbles: true }));
    }
    return true;
  }

  function tryAutoFill(normalized) {
    // find the table that has a header cell containing 'BOX QUANTITY' text
    const ths = Array.from(document.querySelectorAll('th, td')).filter(el => el.textContent && el.textContent.toUpperCase().includes('BOX QUANTITY'));
    let table = null;
    if (ths.length) {
      table = ths[0].closest('table');
    }
    // fallback: pick the first table in the page
    if (!table) table = document.querySelector('table');
    if (!table) return false;

    // find tbody rows (data rows)
    const rows = table.querySelectorAll('tbody tr');
    if (rows.length === 0) {
      // maybe rows are direct children
      const possibleRows = table.querySelectorAll('tr');
      if (possibleRows.length > 1) {
        // assume the second row is data row
        rows.push(possibleRows[1]);
      }
    }
    if (rows.length === 0) return false;

    // For each record, fill corresponding row if exists, else clone a row
    normalized.forEach((item, idx) => {
      let row = rows[idx];
      if (!row) {
        // clone first data row to create another row
        row = rows[0].cloneNode(true);
        table.querySelector('tbody')?.appendChild(row) || table.appendChild(row);
      }
      fillInputsForRow(row, item);
      // also try to set customer/oem/partName if they are simple cells (not inputs)
      const custCell = row.querySelector('.customer') || row.querySelector('td:nth-child(1)');
      if (custCell && !custCell.querySelector('input')) custCell.textContent = item.customer || '';
      const oemCell = row.querySelector('.oem') || row.querySelector('td:nth-child(2)');
      if (oemCell && !oemCell.querySelector('input')) oemCell.textContent = item.oem || '';
      const partCell = row.querySelector('.partname') || row.querySelector('td:nth-child(3)');
      if (partCell && !partCell.querySelector('input')) partCell.textContent = item.partName || '';
    });
    return true;
  }

  window.loadInventoryChart = function () {
    fetch('https://holisol.onrender.com/api/inventory')
      .then(res => res.ok ? res.json() : Promise.reject(new Error('status ' + res.status)))
      .then(records => {
        console.log('inventory records (raw):', records);
        const normalized = normalize(records);
        window._inventory_normalized = normalized;
        const ok = tryAutoFill(normalized);
        if (!ok) {
          console.warn('Inventory adapter: could not find table to auto-fill; normalized data available at window._inventory_normalized.');
        }
      })
      .catch(err => {
        console.error('Failed to load inventory:', err);
      });
  };


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.loadInventoryChart);
  } else {
    window.loadInventoryChart();
  }

})();



/* ---------- Dashboard dropdown sync (Customer / OEM / Part) - improved normalization ---------- */
(function () {
  function normalizeForCompare(s) {
    if (!s && s !== 0) return '';
    return String(s).replace(/\s+/g, ' ').trim().toUpperCase();
  }
  function uniqByNormalized(arr) {
    var seen = {};
    var out = [];
    arr.forEach(function (v) {
      if (!v && v !== 0) return;
      var k = normalizeForCompare(v);
      if (k && !seen[k]) { seen[k] = true; out.push(v); }
    });
    return out.sort(function (a, b) { return normalizeForCompare(a).localeCompare(normalizeForCompare(b)); });
  }
  function setOptions(sel, items, placeholder) {
    if (!sel) return;
    var cur = sel.value || '';
    sel.innerHTML = '<option value="">' + (placeholder || 'Select') + '</option>' + items.map(function (o) { return '<option>' + o + '</option>'; }).join('');
    if (cur) {
      var opts = Array.from(sel.options).map(function (o) { return o.value; });
      var match = opts.find(function (o) { return normalizeForCompare(o) === normalizeForCompare(cur); });
      if (match) sel.value = match;
    }
  }
  function setupForPrefix(prefix) {
    var cust = document.getElementById(prefix + '_customerSel') || document.getElementById(prefix + '_customer');
    var oem = document.getElementById(prefix + '_oemSel') || document.getElementById(prefix + '_oem') || document.getElementById(prefix + 'oemSel') || document.getElementById(prefix + '-oemSel') || document.getElementById('oem_oemSel');
    var part = document.getElementById(prefix + '_partSel') || document.getElementById(prefix + '_part') || document.getElementById(prefix + 'partSel') || document.getElementById('oem_partSel');
    var clearBtn = document.getElementById(prefix + '_clearFilter') || document.getElementById(prefix + '_clear') || document.getElementById(prefix + 'clearFilter') || document.getElementById(prefix + 'clear') || document.getElementById('oem_clearFilter');
    if (!cust && !oem && !part) return;
    function refresh(triggeredId) {
      var data = (window._inventory_normalized || []).slice();
      var valCust = cust && cust.value ? cust.value : '';
      var valOem = oem && oem.value ? oem.value : '';
      var valPart = part && part.value ? part.value : '';
      var subset = data.filter(function (r) {
        var okCust = valCust ? (normalizeForCompare(r.customer) === normalizeForCompare(valCust)) : true;
        var okOem = valOem ? (normalizeForCompare(r.oem) === normalizeForCompare(valOem)) : true;
        var okPart = valPart ? (normalizeForCompare(r.partName) === normalizeForCompare(valPart)) : true;
        return okCust && okOem && okPart;
      });
      var custList = uniqByNormalized(subset.map(function (r) { return r.customer; }));
      var oemList = uniqByNormalized(subset.map(function (r) { return r.oem; }));
      var partList = uniqByNormalized(subset.map(function (r) { return r.partName; }));
      var full = window._inventory_full || (window._inventory_normalized || []);
      if (!valCust && !valOem && !valPart) {
        setOptions(cust, uniqByNormalized(full.map(function (r) { return r.customer; })), 'Select customer');
        setOptions(oem, uniqByNormalized(full.map(function (r) { return r.oem; })), 'Select OEM');
        setOptions(part, uniqByNormalized(full.map(function (r) { return r.partName; })), 'Select part');
      } else {
        if (cust) setOptions(cust, custList.length ? custList : uniqByNormalized(full.map(function (r) { return r.customer; })), 'Select customer');
        if (oem) setOptions(oem, oemList.length ? oemList : uniqByNormalized(full.map(function (r) { return r.oem; })), 'Select OEM');
        if (part) setOptions(part, partList.length ? partList : uniqByNormalized(full.map(function (r) { return r.partName; })), 'Select part');
      }
    }
    [cust, oem, part].forEach(function (el) {
      if (!el) return;
      el.addEventListener('change', function () { refresh(el.id); });
    });
    if (clearBtn) {
      clearBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var els = Array.prototype.slice.call(document.querySelectorAll('[id]')).filter(function (x) { return x.id && x.id.indexOf(prefix + '_') === 0; });
        els.forEach(function (el) {
          if (el.tagName === 'SELECT') el.value = '';
          if (el.tagName === 'INPUT' && el.type && el.type.toLowerCase() === 'text') el.value = '';
        });
        var els2 = Array.prototype.slice.call(document.querySelectorAll('[id]')).filter(function (x) { return x.id && x.id.indexOf(prefix) === 0; });
        els2.forEach(function (el) {
          if (el.tagName === 'SELECT') el.value = '';
          if (el.tagName === 'INPUT' && el.type && el.type.toLowerCase() === 'text') el.value = '';
        });
        refresh('clear');
      });
    }
    refresh();
  }
  function onceReady() {
    if (!window._inventory_normalized || !Array.isArray(window._inventory_normalized)) {
      setTimeout(onceReady, 150);
      return;
    }
    window._inventory_full = window._inventory_normalized.slice();
    ['co', 'ci', 'oem', 'ss'].forEach(setupForPrefix);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onceReady);
  } else { onceReady(); }
})();
// 🔄 Expose inventory refresh for stock transfer
window.refreshInventoryChart = async function () {
  const res = await fetch("https://holisol.onrender.com/api/inventory");
  const data = await res.json();

  // 🔁 reuse existing render logic
  renderInventoryTable(data);
};
