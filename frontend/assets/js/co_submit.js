// helper to ensure vehicle cell present and append styled shortage cells
function __normalize_history_row_ohTbodyOut(tr){
  try{
    var cells = tr.querySelectorAll('td');
    if(cells.length>0){
      var hasVehicle = tr.querySelector('.col-vehicle');
      if(!hasVehicle){
        var td = document.createElement('td'); td.className='col-vehicle'; td.textContent = (window.__last_submission_vehicle||'');
        if(cells.length>=3) tr.insertBefore(td, cells[3]); else tr.appendChild(td);
      }
    }
    Array.from(tr.querySelectorAll('td.shortage')).forEach(function(sd){ sd.style.background='#f7d7d7'; sd.style.textAlign='center'; });
  }catch(e){console.error('__normalize_history_row_ohTbodyOut error',e);} 
}


// co_submit.js - handle Create Outward submit: deduct warehouse stock and update outward columns
(function(){
  function coNormalizeKey(str){
    if(!str && str !== 0) return '';
    return String(str).replace(/\s+/g,' ').trim().toUpperCase();
  }
  function dispatchInput(el){
    if(!el) return;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Read inventory row by customer,oem,part; find warehouse stock inputs and outward inputs (assumes structure in inventory table)
  function findInventoryRow(customer,oem,part){
    const tbody = document.getElementById('invTbody');
    if(!tbody) return null;
    const rows = Array.from(tbody.querySelectorAll('tr'));
    for(const row of rows){
      const rc = coNormalizeKey((row.querySelector('.col-customer')||{}).textContent);
      const ro = coNormalizeKey((row.querySelector('.col-oem')||{}).textContent);
      const rp = coNormalizeKey((row.querySelector('.col-part')||{}).textContent);
      if(rc===coNormalizeKey(customer) && ro===coNormalizeKey(oem) && rp===coNormalizeKey(part)){
        return row;
      }
    }
    return null;
  }

  function getWarehouseInputsFromRow(row){
    // warehouse inputs are after boxQuantity inputs; in your table they have ids like 'ws_x_y' or are in the yellow columns.
    // We'll select inputs in the row and identify groups:
    const inputs = Array.from(row.querySelectorAll('input.inv-input'));
    // Expected order in row per code: boxQuantity(7), warehouseStock(7), inward(7), outward(7)
    // So warehouse inputs are inputs.slice(7,14), outward are inputs.slice(21,28)
    const ware = inputs.slice(7,14);
    const outward = inputs.slice(21,28);
    // fallback: if counts differ, try to locate by id prefix ws_ and out_ 
    if(ware.length < 7){
      const ws = inputs.filter(i => (i.id||'').startsWith('ws_')).slice(0,7);
      if(ws.length===7) ware.splice(0, ware.length, ...ws);
    }
    if(outward.length < 7){
      const ou = inputs.filter(i => (i.id||'').startsWith('out_')).slice(0,7);
      if(ou.length===7) outward.splice(0, outward.length, ...ou);
    }
    return { ware, outward };
  }

  function parseIntSafe(v){ const n = Number(String(v).trim()); return isNaN(n)?0:n; }

  function collectCreateOutwardData(){
    const totals = {}; // key = customer|oem|part -> {pallet,sleeve,...}
    function addToTotals(c,o,p,values){
      const key = [coNormalizeKey(c), coNormalizeKey(o), coNormalizeKey(p)].join('|');
      if(!totals[key]) totals[key] = { customer:c, oem:o, part:p, pallet:0,sleeve:0,lid:0,inserts:0,separator:0,crates:0,dummy:0 };
      for(const k of ['pallet','sleeve','lid','inserts','separator','crates','dummy']){
        totals[key][k] += (values[k]||0);
      }
    }
    // main row
    const mainCust = (document.getElementById('co_customerSel')||{}).value||'';
    const mainOem = (document.getElementById('co_oemSel')||{}).value||'';
    const mainPart = (document.getElementById('co_partSel')||{}).value||'';
    if(mainCust && mainOem && mainPart){
      const fields = {
        pallet: parseIntSafe((document.getElementById('co_palletQty')||{}).value||0),
        sleeve: parseIntSafe((document.getElementById('co_sleeveQty')||{}).value||0),
        lid: parseIntSafe((document.getElementById('co_lidQty')||{}).value||0),
        inserts: parseIntSafe((document.getElementById('co_insertQty')||{}).value||0),
        separator: parseIntSafe((document.getElementById('co_separatorQty')||{}).value||0),
        crates: parseIntSafe((document.getElementById('co_cratesQty')||{}).value||0),
        dummy: parseIntSafe((document.getElementById('co_dummyQty')||{}).value||0)
      };
      addToTotals(mainCust, mainOem, mainPart, fields);
    }
    // extra same blocks
    const sameBlocks = Array.from(document.querySelectorAll('#co_extraSameContainer .extra-block'));
    for(const block of sameBlocks){
      const partSel = block.querySelector('select[id^="co_same_part_"]');
      const part = partSel ? partSel.value : '';
      const cust = (document.getElementById('co_customerSel')||{}).value||'';
      const oem = (document.getElementById('co_oemSel')||{}).value||'';
      if(!part) continue;
      const idx = block.dataset.idx || (function(){ // try to infer idx from inputs
        const in0 = block.querySelector('input[id^="co_qty_"][id$="_0"]');
        return in0 ? (in0.id.match(/^co_qty_(\d+)_0$/)||[])[1] : null;
      })();
      if(!idx) continue;
      const fields = {
        pallet: parseIntSafe((document.getElementById(`co_qty_${idx}_0`)||{}).value||0),
        sleeve: parseIntSafe((document.getElementById(`co_qty_${idx}_1`)||{}).value||0),
        lid: parseIntSafe((document.getElementById(`co_qty_${idx}_2`)||{}).value||0),
        inserts: parseIntSafe((document.getElementById(`co_qty_${idx}_3`)||{}).value||0),
        separator: parseIntSafe((document.getElementById(`co_qty_${idx}_4`)||{}).value||0),
        crates: parseIntSafe((document.getElementById(`co_qty_${idx}_5`)||{}).value||0),
        dummy: parseIntSafe((document.getElementById(`co_qty_${idx}_6`)||{}).value||0)
      };
      addToTotals(cust, oem, part, fields);
    }
    // extra diff blocks
    const diffBlocks = Array.from(document.querySelectorAll('#co_extraDiffContainer .extra-block'));
    for(const block of diffBlocks){
      const partSel = block.querySelector('select[id^="co_diff_part_"]');
      const oemSel = block.querySelector('select[id^="co_diff_oem_"]');
      const part = partSel ? partSel.value : '';
      const cust = (document.getElementById('co_customerSel')||{}).value||'';
      const oem = oemSel ? oemSel.value : '';
      if(!part || !oem) continue;
      const idx = block.dataset.idx || (function(){
        const in0 = block.querySelector('input[id^="co_qty_"][id$="_0"]');
        return in0 ? (in0.id.match(/^co_qty_(\d+)_0$/)||[])[1] : null;
      })();
      if(!idx) continue;
      const fields = {
        pallet: parseIntSafe((document.getElementById(`co_qty_${idx}_0`)||{}).value||0),
        sleeve: parseIntSafe((document.getElementById(`co_qty_${idx}_1`)||{}).value||0),
        lid: parseIntSafe((document.getElementById(`co_qty_${idx}_2`)||{}).value||0),
        inserts: parseIntSafe((document.getElementById(`co_qty_${idx}_3`)||{}).value||0),
        separator: parseIntSafe((document.getElementById(`co_qty_${idx}_4`)||{}).value||0),
        crates: parseIntSafe((document.getElementById(`co_qty_${idx}_5`)||{}).value||0),
        dummy: parseIntSafe((document.getElementById(`co_qty_${idx}_6`)||{}).value||0)
      };
      addToTotals(cust, oem, part, fields);
    }

    return totals;
  }

  function onSubmit(){
    try{
      const totals = collectCreateOutwardData();
      // Validate availability
      for(const key in totals){
        const t = totals[key];
        const row = findInventoryRow(t.customer, t.oem, t.part);
        if(!row){
          alert('There is no inventory from our end.');
          return;
        }
        const io = getWarehouseInputsFromRow(row);
        if(!io || !io.ware || io.ware.length < 7){
          alert('There is no inventory from our end.');
          return;
        }
        for(let idx=0; idx<7; idx++){
          const fieldNames = ['pallet','sleeve','lid','inserts','separator','crates','dummy'];
          const need = t[fieldNames[idx]] || 0;
          const available = parseIntSafe(io.ware[idx].value || 0);
          if(need > available){
            alert('There is no inventory from our end.');
            return;
          }
        }
      }
      // All validated: apply deduction and write outward
      for(const key in totals){
        const t = totals[key];
        const row = findInventoryRow(t.customer, t.oem, t.part);
        const io = getWarehouseInputsFromRow(row);
        const outwardInputs = io.outward || [];
        const wareInputs = io.ware || [];
        const names = ['pallet','sleeve','lid','inserts','separator','crates','dummy'];
        for(let i=0;i<7;i++){
          const need = t[names[i]] || 0;
          const avail = parseIntSafe(wareInputs[i].value || 0);
          const newAvail = avail - need;
          wareInputs[i].value = String(newAvail);
          dispatchInput(wareInputs[i]);
          // update outward: add to existing outward value
          if(outwardInputs[i]){
            const prevOut = parseIntSafe(outwardInputs[i].value || 0);
            outwardInputs[i].value = String(prevOut + need);
            dispatchInput(outwardInputs[i]);
          }
        }
      }
      
      // --- add entries to Outward History table (one row per totals entry) ---
      try{
        const dispatchVal = (document.getElementById('co_dispatchDate')||{}).value || '';
        const invoiceVal = (document.getElementById('co_invoiceNo')||{}).value || '';
        const vehicleVal = (document.getElementById('co_vehicleNo')||{}).value || '';
        const locationVal = (document.getElementById('co_locationSel')||{}).value || '';
        const ohTbody = document.getElementById('ohTbodyOut');
        const now = new Date();
        const dd = String(now.getDate()).padStart(2,'0');
        const mm = String(now.getMonth()+1).padStart(2,'0');
        const yy = now.getFullYear();
        const receiveVal = dd + '-' + mm + '-' + yy;
        if(ohTbody){
          for(const key in totals){
            const t = totals[key];
            const tr = document.createElement('tr');
            // build outward cells array [pallet,sleeve,lid,inserts,separator,crates,dummy]
            const outArr = ['pallet','sleeve','lid','inserts','separator','crates','dummy'].map(k => t[k] || 0);
            let html = '';
            html += `<td class="col-dispatch">${dispatchVal}</td>`;
            html += `<td class="col-receive">${receiveVal}</td>`;
            html += `<td class="col-invno">${invoiceVal}</td>`;
            html += `<td class="col-vehicle">${vehicleVal}</td>`;
            html += `<td class="col-location">${locationVal}</td>`;
            html += `<td class="col-customer">${t.customer}</td>`;
            html += `<td class="col-oem">${t.oem}</td>`;
            html += `<td class="col-partname">${t.part}</td>`;
            for(const v of outArr){
              html += `<td class="inward-group">${v}</td>`;
            }
            tr.innerHTML = html;
            ohTbody.insertBefore(tr, ohTbody.firstChild);
            try{ __normalize_history_row_ohTbodyOut(tr); }catch(e){}
          }
        }
      }catch(e){ console.error('append outward history error', e); }
      // --- end history append ---
alert('Outward submitted and inventory updated.');
      try{
        // send outward entries to backend for persistence
        const payload = { entries: (function(){
          const arr = [];
          try{
            const dispatchVal = (document.getElementById('co_dispatchDate')||{}).value || null;
            const locationVal = (document.getElementById('co_locationSel')||{}).value || '';
            const invoiceVal = (document.getElementById('co_invoiceNo')||{}).value || '';
            const vehicleVal = (document.getElementById('co_vehicleNo')||{}).value || '';
            for(const key in totals){
              const t = totals[key];
              // ensure boxes object with numeric values
              const boxes = {
                pallet: Number(t.pallet || 0),
                sleeve: Number(t.sleeve || 0),
                lid: Number(t.lid || 0),
                inserts: Number(t.inserts || 0),
                separator: Number(t.separator || 0),
                crates: Number(t.crates || 0),
                dummy: Number(t.dummy || 0)
              };
              arr.push({
                customer: t.customer || '',
                oem: t.oem || '',
                partName: t.part || '',
                boxes: boxes,
                invoice: invoiceVal,
                vehicle: vehicleVal,
                location: locationVal,
                dispatchDate: dispatchVal
              });
            }
          }catch(e){ console.error('build payload error',e); }
          return arr;
        })() };
        fetch('/api/inventory/outward', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
          .then(r=>r.json()).then(j=>{ if(!j.ok){ console.error('persist outward failed', j); alert('Warning: failed to persist outward to server.'); } }).catch(err=>{ console.error('persist outward error', err); alert('Warning: failed to persist outward to server.'); });
      }catch(e){ console.error('send outward error', e); }
      
            try{ resetCreateOutwardForm(); var d=document.getElementById('co_dispatchDate'); if(d) d.value=''; var v=document.getElementById('co_vehicleNo'); if(v) v.value=''; }catch(e){}

      resetCreateOutwardForm(); try{ window.__last_submission_vehicle=''; }catch(e){}
    }catch(e){
      console.error('co_submit error', e);
      alert('An error occurred while submitting. See console for details.');
    }
  }

  


// Fetch outward history from backend and render into Outward History table

async function fetchOutwardHistory(){
  try{
    const resp = await fetch('/api/inventory/outward');
    const j = await resp.json();
    if(!j.ok || !Array.isArray(j.docs)) return;
    const ohTbody = document.getElementById('ohTbodyOut');
    if(!ohTbody) return;
    // clear existing
    ohTbody.innerHTML = '';
    for(const doc of j.docs){
      try{
        const tr = document.createElement('tr');
        tr.className = 'history-row';
        const invoiceVal = doc.invoice || '';
        const vehicleVal = doc.vehicle || '';
        const locationVal = doc.location || '';
        const customerVal = doc.customer || '';
        const oemVal = doc.oem || '';
        const partVal = doc.partName || '';
        const dispatchVal = doc.dispatchDate ? (new Date(doc.dispatchDate)).toLocaleDateString() : '';
        const receiveVal = doc.receiveDate ? (new Date(doc.receiveDate)).toLocaleDateString() : (doc.createdAt ? (new Date(doc.createdAt)).toLocaleDateString() : '');
        const outArr = [];
        const keys = ['pallet','sleeve','lid','inserts','separator','crates','dummy'];
        for(const k of keys){
          outArr.push((doc.boxes && (doc.boxes[k] || 0)) || 0);
        }
        let html = '';
        // Correct column order to match table headers:
        // DISPATCH DATE, RECEIVE DATE, INVOICE NO, VEHICLE NO, LOCATION, CUSTOMER, OEM, PARTNAME, OUTWARD...
        html += `<td class="col-dispatch">${dispatchVal}</td>`;
        html += `<td class="col-receive">${receiveVal}</td>`;
        html += `<td class="col-invno">${invoiceVal}</td>`;
        html += `<td class="col-vehicle">${vehicleVal}</td>`;
        html += `<td class="col-location">${locationVal}</td>`;
        html += `<td class="col-customer">${customerVal}</td>`;
        html += `<td class="col-oem">${oemVal}</td>`;
        html += `<td class="col-partname">${partVal}</td>`;
        for(const v of outArr){
          html += `<td class="inward-group">${v}</td>`;
        }
        tr.innerHTML = html;
        ohTbody.insertBefore(tr, ohTbody.firstChild);
        try{ __normalize_history_row_ohTbodyOut(tr); }catch(e){}
      }catch(e){
        console.error('render outward history row error', e);
      }
    }
  }catch(err){
    console.error('fetchOutwardHistory error', err);
  }
}


// call fetch on load after DOM ready
document.addEventListener('DOMContentLoaded', function(){
  try{ fetchOutwardHistory(); }catch(e){ console.error(e); }
});
function resetCreateOutwardForm(){
    try{ var el=document.getElementById('co_dispatchDate'); if(el) el.value=''; var v=document.getElementById('co_vehicleNo'); if(v) v.value=''; }catch(e){} var btn = document.getElementById('co_clearFilter'); if(btn) btn.click(); var containers=['co_extraSameContainer','co_extraDiffContainer','co_extraDiffOemContainer']; containers.forEach(id=>{const c=document.getElementById(id); if(c) c.innerHTML='';}); }

  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('co_submit');
    if(!btn) return;
    btn.addEventListener('click', function(e){
      e.preventDefault();
      onSubmit();
    });
  });
})();


// Load Outward History from server and render into table body #ohTbodyOut
async function loadOutwardHistoryFromServer(){
  try{
    const resp = await fetch('/api/inventory/outward');
    if(!resp.ok) return;
    const data = await resp.json();
    if(!data.ok) return;
    const docs = data.docs || [];
    const ohT = document.getElementById('ohTbodyOut');
    if(!ohT) return;
    ohT.innerHTML = '';
    for(const d of docs){
      try{
        const tr = document.createElement('tr'); let h='';
        h+=`<td class="col-dispatch">${d.dispatchDate||''}</td>`;
        h+=`<td class="col-receive">${d.receiveDate||''}</td>`; // outward may not have receiveDate
        h+=`<td class="col-invno">${d.invoice||''}</td>`;
        h+=`<td class="col-vehicle">${d.vehicle||''}</td>`;
        h+=`<td class="col-location">${d.location||''}</td>`;
        h+=`<td class="col-customer">${d.customer||''}</td>`;
        h+=`<td class="col-oem">${d.oem||''}</td>`;
        h+=`<td class="col-partname">${d.partName||''}</td>`;
        const ks = ['pallet','sleeve','lid','inserts','separator','crates','dummy'];
        for(const k of ks){ h+=`<td class="inward-group">${(d.boxes && (d.boxes[k]||0))||0}</td>`; }
        
        
        tr.innerHTML = h; ohT.appendChild(tr);
      }catch(e){console.warn('render outward row err', e)}
    }
  }catch(e){ console.warn('loadOutwardHistoryFromServer', e); }
}

document.addEventListener('DOMContentLoaded', function(){ try{ loadOutwardHistoryFromServer(); }catch(e){} });
