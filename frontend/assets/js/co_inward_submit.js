// helper to ensure vehicle cell present and append styled shortage cells
function __normalize_history_row_ohTbodyIn(tr){
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
  }catch(e){console.error('__normalize_history_row_ohTbodyIn error',e);} 
}

// co_inward_submit.js - FINAL CORRECTED VERSION (handles all Add More block types)
(function(){
  function norm(s){ return String(s||'').replace(/\s+/g,' ').trim().toUpperCase(); }
  function toInt(v){ const n = Number(String(v||'').trim()); return isNaN(n)?0:n; }
  function fire(el){ if(!el) return; el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); }

  function findInventoryRow(customer,oem,part){
    const tbody = document.getElementById('invTbody');
    if(!tbody) return null;
    const rows = Array.from(tbody.querySelectorAll('tr'));
    for(const r of rows){
      const rc = norm((r.querySelector('.col-customer')||{}).textContent || '');
      const ro = norm((r.querySelector('.col-oem')||{}).textContent || '');
      const rp = norm((r.querySelector('.col-part')||{}).textContent || '');
      if(rc === norm(customer) && ro === norm(oem) && rp === norm(part)) return r;
    }
    return null;
  }

  function parseBlockValues(prefix, idx){
    const names = ['pallet','sleeve','lid','inserts','separator','crates','dummy'];
    const vals = {};
    for(let i=0;i<7;i++){
      const el = document.getElementById(`${prefix}${idx}_${i}`);
      vals[names[i]] = toInt(el ? el.value : 0);
    }
    return vals;
  }

  function collectTotals(){
    const totals = {}; // key -> {customer,oem,part, pallet:..., ...}

    
    // Compute sets and shortages for a totals entry based on inventory boxQuantity
    function computeSetsAndShortages(t){
      try{
        const keys = ['pallet','sleeve','lid','inserts','separator','crates','dummy'];
        const inv = (window._inventory_normalized || []).find(it => (String(it.customer||'').trim().toUpperCase()===String(t.customer||'').trim().toUpperCase()) && (String(it.oem||'').trim().toUpperCase()===String(t.oem||'').trim().toUpperCase()) && (String(it.partName||'').trim().toUpperCase()===String(t.part||'').trim().toUpperCase()));
        const box = (inv && inv.boxQuantity) ? inv.boxQuantity : null;
        // if no box definition, fallback: sets = 0 and shortages = t values
        if(!box){ t.sets = 0; t.shortages = {}; keys.forEach(k=> t.shortages[k] = t[k]||0 ); return; }
        // compute possible sets per key where box[k] > 0
        let possible = [];
        keys.forEach(k=>{ const b = Number(box[k]||0); if(b>0){ possible.push(Math.floor((Number(t[k]||0))/b)); } });
        const sets = (possible.length>0) ? Math.min(...possible) : 0;
        t.sets = sets;
        t.shortages = {};
        keys.forEach(k=>{
          const b = Number(box[k]||0);
          if(b>0){
            t.shortages[k] = (Number(t[k]||0) - sets*b);
            if(t.shortages[k] < 0) t.shortages[k] = 0;
          } else {
            // if per-set requirement is zero/undefined, treat shortage as 0
            t.shortages[k] = 0;
          }
        });
      }catch(e){
        console.error('computeSetsAndShortages error', e);
        // fallback
        const keys = ['pallet','sleeve','lid','inserts','separator','crates','dummy'];
        t.sets = 0; t.shortages = {}; keys.forEach(k=> t.shortages[k] = t[k]||0 );
      }
    }

function addToTotals(customer,oem,part,vals){
      const key = [norm(customer), norm(oem), norm(part)].join('|');
      if(!totals[key]){
        totals[key] = { customer: customer, oem: oem, part: part,
          pallet:0, sleeve:0, lid:0, inserts:0, separator:0, crates:0, dummy:0 };
      }
      for(const k of ['pallet','sleeve','lid','inserts','separator','crates','dummy']){
        totals[key][k] += (vals[k]||0);
      }
    }

    // Main Create Inward row
    const mainCust = document.getElementById('ci_customerSel') ? document.getElementById('ci_customerSel').value : '';
    const mainOem  = document.getElementById('ci_oemSel') ? document.getElementById('ci_oemSel').value : '';
    const mainPart = document.getElementById('ci_partSel') ? document.getElementById('ci_partSel').value : '';
    if(mainCust && mainOem && mainPart){
      const vals = {
        pallet: toInt((document.getElementById('ci_palletQty')||{}).value),
        sleeve: toInt((document.getElementById('ci_sleeveQty')||{}).value),
        lid: toInt((document.getElementById('ci_lidQty')||{}).value),
        inserts: toInt((document.getElementById('ci_insertQty')||{}).value),
        separator: toInt((document.getElementById('ci_separatorQty')||{}).value),
        crates: toInt((document.getElementById('ci_cratesQty')||{}).value),
        dummy: toInt((document.getElementById('ci_dummyQty')||{}).value)
      };
      addToTotals(mainCust, mainOem, mainPart, vals);
    }

    // Find all extra blocks by detecting pallet input ids ci_qty_{idx}_0
    const palletInputs = Array.from(document.querySelectorAll("input[id^='ci_qty_'][id$='_0']"));
    for(const pInput of palletInputs){
      const m = pInput.id.match(/^ci_qty_(\d+)_0$/);
      if(!m) continue;
      const idx = m[1];

      // Determine block type and select correct customer/oem/part selectors per confirmed patterns

      // 1) Different Customer by OEM block (has ci_diff_customer_{idx}, ci_diff_oem_{idx}, ci_diff_part_{idx})
      const diffCustSel = document.getElementById(`ci_diff_customer_${idx}`);
      if(diffCustSel){
        const customer = diffCustSel.value || '';
        const oemSel = document.getElementById(`ci_diff_oem_${idx}`);
        const partSel = document.getElementById(`ci_diff_part_${idx}`);
        const oem = oemSel ? oemSel.value : '';
        const part = partSel ? partSel.value : '';
        if(customer && oem && part){
          const vals = parseBlockValues('ci_qty_', idx);
          addToTotals(customer, oem, part, vals);
        }
        continue;
      }

      // 2) Different OEM block (has ci_diff_oem_{idx} and ci_diff_part_{idx}), customer = main
      const diffOemSel = document.getElementById(`ci_diff_oem_${idx}`);
      if(diffOemSel){
        const customer = mainCust || '';
        const oem = diffOemSel.value || '';
        const partSel = document.getElementById(`ci_diff_part_${idx}`);
        const part = partSel ? partSel.value : '';
        if(customer && oem && part){
          const vals = parseBlockValues('ci_qty_', idx);
          addToTotals(customer, oem, part, vals);
        }
        continue;
      }

      // 3) Same Customer by OEM block (has ci_same_part_{idx}), use main customer & main OEM
      const samePartSel = document.getElementById(`ci_same_part_${idx}`);
      if(samePartSel){
        const customer = mainCust || '';
        const oem = mainOem || '';
        const part = samePartSel.value || '';
        if(customer && oem && part){
          const vals = parseBlockValues('ci_qty_', idx);
          addToTotals(customer, oem, part, vals);
        }
        continue;
      }

      // If none matched, try to detect generic selectors inside block
      // fallback: try any selectors with index
      const anyPart = document.getElementById(`ci_part_${idx}`) || document.getElementById(`ci_diff_part_${idx}`) || document.getElementById(`ci_same_part_${idx}`);
      const anyOem = document.getElementById(`ci_diff_oem_${idx}`) || document.getElementById(`ci_same_oem_${idx}`);
      const customerFallback = document.getElementById(`ci_diff_customer_${idx}`) || mainCust;
      const customer = customerFallback ? (customerFallback.value || customerFallback) : mainCust;
      const oem = anyOem ? (anyOem.value || '') : mainOem;
      const part = anyPart ? (anyPart.value || '') : '';
      if(customer && oem && part){
        const vals = parseBlockValues('ci_qty_', idx);
        addToTotals(customer, oem, part, vals);
      }
    }

    return totals;
  }

  function applyTotalsToInventory(totals){
    const names = ['pallet','sleeve','lid','inserts','separator','crates','dummy'];
    for(const key in totals){
      const t = totals[key];
            computeSetsAndShortages(t);
      const row = findInventoryRow(t.customer, t.oem, t.part);
      if(!row){
        alert(`No inventory row found for: ${t.customer} / ${t.oem} / ${t.part}`);
        return false;
      }
      const inputs = Array.from(row.querySelectorAll('input.inv-input'));
      // expected: boxQuantity[0..6], warehouse[7..13], inward[14..20], outward[21..27]
      const ware = inputs.slice(7,14);
      const inward = inputs.slice(14,21);
      if(ware.length < 7 || inward.length < 7){
        alert(`Inventory row inputs not found for: ${t.customer} / ${t.oem} / ${t.part}`);
        return false;
      }
      for(let i=0;i<7;i++){
        const add = t[names[i]] || 0;
        const prevWare = toInt(ware[i].value || 0);
        const newWare = prevWare + add;
        ware[i].value = String(newWare);
        fire(ware[i]);

        const prevIn = toInt(inward[i].value || 0);
        inward[i].value = String(prevIn + add);
        fire(inward[i]);
      }
    }
    return true;
  }

  function onSubmit(e){
    if(e && e.preventDefault) e.preventDefault();
    const totals = collectTotals();
    if(Object.keys(totals).length === 0){
      alert('No inward quantities entered.');
      return;
    }
    const ok = applyTotalsToInventory(totals);
    if(ok) alert('Inward submitted and inventory updated.');
    // --- append to Inward History ---
    try{
      const dispatchVal = (document.getElementById('ci_dispatchDate')||{}).value || '';
      const invoiceVal = (document.getElementById('ci_invoiceNo')||{}).value || '';
      const vehicleVal = (document.getElementById('ci_vehicleNo')||{}).value || '';
      const locationVal = (document.getElementById('ci_locationSel')||{}).value || '';
      const ohT = document.getElementById('ohTbodyIn');
      const now = new Date(); const dd=String(now.getDate()).padStart(2,'0'); const mm=String(now.getMonth()+1).padStart(2,'0'); const yy=now.getFullYear();
      const recv = dd+'-'+mm+'-'+yy;
      if(ohT){
        for(const key in totals){
          const t = totals[key];
            computeSetsAndShortages(t);
          const arr=['pallet','sleeve','lid','inserts','separator','crates','dummy'].map(k=>t[k]||0);
          const tr=document.createElement('tr'); let h='';
          h+=`<td class="col-dispatch">${dispatchVal}</td>`;
          h+=`<td class="col-receive">${recv}</td>`;
          h+=`<td class="col-invno">${invoiceVal}</td>`;
          h+=`<td class="col-vehicle">${vehicleVal}</td>`;
          h+=`<td class="col-location">${locationVal}</td>`;
          h+=`<td class="col-customer">${t.customer}</td>`;
          h+=`<td class="col-oem">${t.oem}</td>`;
          h+=`<td class="col-partname">${t.part}</td>`;
          for(const v of arr){ h+=`<td class="inward-group">${v}</td>`; }
            h+=`<td class="col-sets">${t.sets||0}</td>`;
            const shortKeys = ['pallet','sleeve','lid','inserts','separator','crates','dummy'];
            for(const k of shortKeys){ h += `<td class="shortage-group">${(t.shortages && (t.shortages[k]||0))}</td>`; }
          tr.innerHTML=h; ohT.insertBefore(tr, ohT.firstChild);
        }
        if(window.updateInwardFilters) window.updateInwardFilters();
      }

        // --- persist to backend: build entries array and POST to /api/inventory/inward ---
        (async function(){
          try{
            const entries = [];
            for(const key in totals){
              const t = totals[key];
              const boxes = {
                pallet: Number(t.pallet||0),
                sleeve: Number(t.sleeve||0),
                lid: Number(t.lid||0),
                inserts: Number(t.inserts||0),
                separator: Number(t.separator||0),
                crates: Number(t.crates||0),
                dummy: Number(t.dummy||0)
              };
              computeSetsAndShortages(t);
              entries.push({
                customer: t.customer,
                oem: t.oem,
                partName: t.part,
                invoice: invoiceVal || '',
                vehicle: vehicleVal || '',
                location: locationVal || '',
                dispatchDate: dispatchVal || '',
                receiveDate: recv || '',
                boxes,
                sets: t.sets || 0,
                shortages: t.shortages || {}
              });
            }
            // send to server; if server not available, this will fail silently but app will continue to work locally
            const resp = await fetch('/api/inventory/inward', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ entries })
            });
            if(!resp.ok) console.warn('Failed to save inward to server', await resp.text());
          }catch(e){
            console.warn('Persist inward error', e);
          }
        })();

    }catch(e){ console.error('append inward history error',e); }
    // --- end append ---

      resetCreateInwardForm(); try{ window.__last_submission_vehicle=''; }catch(e){}}

  
  function resetCreateInwardForm(){
    try{ var el=document.getElementById('ci_dispatchDate'); if(el) el.value=''; var v=document.getElementById('ci_vehicleNo'); if(v) v.value=''; }catch(e){}
    try{
      const view = document.getElementById('createInwardView') || document.querySelector('#createInwardView');
      if(view){
        const cb = view.querySelector('.clear-btn, button[id^="ci_clear"], button.oh-clear, button[title*="Clear"]');
        if(cb) try{ cb.click(); }catch(e){}
      }
    }catch(e){}

    const selIds = ['ci_customerSel','ci_oemSel','ci_partSel'];
    selIds.forEach(id=>{ const el=document.getElementById(id); if(el){ try{ el.selectedIndex = 0; el.dispatchEvent(new Event('change',{bubbles:true})); }catch(e){} } });
    const qtyIds = ['ci_palletQty','ci_sleeveQty','ci_lidQty','ci_insertQty','ci_separatorQty','ci_cratesQty','ci_dummyQty'];
    qtyIds.forEach(id=>{ const el=document.getElementById(id); if(el){ el.value=''; el.dispatchEvent(new Event('input',{bubbles:true})); } });
    Array.from(document.querySelectorAll("input[id^='ci_qty_']")).forEach(i=>{ i.value=''; i.dispatchEvent(new Event('input',{bubbles:true})); });
    const containers = ['ci_extraSameContainer','ci_extraDiffContainer','ci_extraDiffOemContainer'];
    containers.forEach(id=>{ const c=document.getElementById(id); if(c){ c.innerHTML=''; try{ c.dispatchEvent(new Event('input',{bubbles:true})); }catch(e){} } });
  }




  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('ci_submit') || (function(){
      const el = Array.from(document.querySelectorAll('#createInwardView button')).find(b=>/submit/i.test(b.textContent));
      return el || null;
    })();
    if(btn) btn.addEventListener('click', onSubmit);
  });

})();


// Load Inward History from server and render into table body #ohTbodyIn
async function loadInwardHistoryFromServer(){
  try{
    const resp = await fetch('/api/inventory/inward');
    if(!resp.ok) return;
    const data = await resp.json();
    if(!data.ok) return;
    const docs = data.docs || [];
    const ohT = document.getElementById('ohTbodyIn');
    if(!ohT) return;
    // Clear existing rows (keep header etc.)
    ohT.innerHTML = '';
    for(const d of docs){
      try{
        const tr = document.createElement('tr'); let h='';
        h+=`<td class="col-dispatch">${d.dispatchDate||''}</td>`;
        h+=`<td class="col-receive">${d.receiveDate||''}</td>`;
        h+=`<td class="col-invno">${d.invoice||''}</td>`;
        h+=`<td class="col-vehicle">${d.vehicle||''}</td>`;
        h+=`<td class="col-location">${d.location||''}</td>`;
        h+=`<td class="col-customer">${d.customer||''}</td>`;
        h+=`<td class="col-oem">${d.oem||''}</td>`;
        h+=`<td class="col-partname">${d.partName||''}</td>`;
        const ks = ['pallet','sleeve','lid','inserts','separator','crates','dummy'];
        for(const k of ks){ h+=`<td class="inward-group">${(d.boxes && (d.boxes[k]||0))||0}</td>`; }
        h+=`<td class="col-sets">${d.sets||0}</td>`;
        for(const k of ks){ h+=`<td class="shortage-group">${(d.shortages && (d.shortages[k]||0))||0}</td>`; }
        tr.innerHTML = h; ohT.appendChild(tr);
      }catch(e){console.warn('render inward row err', e)}
    }
  }catch(e){ console.warn('loadInwardHistoryFromServer', e); }
}

// call loader on DOMContentLoaded so history is shown on refresh
document.addEventListener('DOMContentLoaded', function(){ try{ loadInwardHistoryFromServer(); }catch(e){} });
