// helper to ensure vehicle cell present and append styled shortage cells
function __normalize_history_row_ohTbodyOem(tr){
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
  }catch(e){console.error('__normalize_history_row_ohTbodyOem error',e);} 
}

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

// co_oem_inward_submit.js - handles OEM Inward Collection submit (main + same/diff blocks)
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

  function parseValues(prefix, idx){
    const names = ['pallet','sleeve','lid','inserts','separator','crates','dummy'];
    const vals = {};
    for(let i=0;i<7;i++){
      const el = document.getElementById(`${prefix}${idx}_${i}`);
      vals[names[i]] = toInt(el ? el.value : 0);
    }
    return vals;
  }

  function collectTotals(){
    const totals = {};
    function add(c,o,p,vals){
      const key = [norm(c),norm(o),norm(p)].join('|');
      if(!totals[key]) totals[key] = { customer:c,oem:o,part:p,pallet:0,sleeve:0,lid:0,inserts:0,separator:0,crates:0,dummy:0 };
      for(const k of ['pallet','sleeve','lid','inserts','separator','crates','dummy']) totals[key][k] += (vals[k]||0);
    }

    // main row ids: oem_customerSel, oem_oemSel, oem_partSel
    const mainCust = document.getElementById('oem_customerSel') ? document.getElementById('oem_customerSel').value : '';
    const mainOem  = document.getElementById('oem_oemSel') ? document.getElementById('oem_oemSel').value : '';
    const mainPart = document.getElementById('oem_partSel') ? document.getElementById('oem_partSel').value : '';
    if(mainCust && mainOem && mainPart){
      const vals = {
        pallet: toInt((document.getElementById('oem_palletQty')||{}).value),
        sleeve: toInt((document.getElementById('oem_sleeveQty')||{}).value),
        lid: toInt((document.getElementById('oem_lidQty')||{}).value),
        inserts: toInt((document.getElementById('oem_insertQty')||{}).value),
        separator: toInt((document.getElementById('oem_separatorQty')||{}).value),
        crates: toInt((document.getElementById('oem_cratesQty')||{}).value),
        dummy: toInt((document.getElementById('oem_dummyQty')||{}).value)
      };
      add(mainCust, mainOem, mainPart, vals);
    }

    // SAME CUSTOMER/OEM extra blocks: ids 'oem_qty_{idx}_{i}', and part selector 'oem_same_part_{idx}'
    const samePallets = Array.from(document.querySelectorAll("input[id^='oem_qty_'][id$='_0']"));
    for(const el of samePallets){
      const m = el.id.match(/^oem_qty_(\d+)_0$/);
      if(!m) continue;
      const idx = m[1];
      const partSel = document.getElementById(`oem_same_part_${idx}`);
      const part = partSel ? partSel.value : '';
      const customer = mainCust || '';
      const oem = mainOem || '';
      if(!part || !customer || !oem) continue;
      const vals = parseValues('oem_qty_', idx);
      add(customer, oem, part, vals);
    }

    // DIFFERENT CUSTOMER extra blocks: ids 'qty_{idx}_{i}', customer 'oem_diff_cust_{idx}', part 'oem_diff_part_{idx}'
    const diffPallets = Array.from(document.querySelectorAll("input[id^='qty_'][id$='_0']"));
    for(const el of diffPallets){
      const m = el.id.match(/^qty_(\d+)_0$/);
      if(!m) continue;
      const idx = m[1];
      const custSel = document.getElementById(`oem_diff_cust_${idx}`);
      const partSel = document.getElementById(`oem_diff_part_${idx}`);
      const customer = custSel ? custSel.value : '';
      const oem = mainOem || '';
      const part = partSel ? partSel.value : '';
      if(!customer || !oem || !part) continue;
      const vals = parseValues('qty_', idx);
      add(customer, oem, part, vals);
    }

    return totals;
  }

  function applyTotals(totals){
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
      const ware = inputs.slice(7,14);
      const inward = inputs.slice(14,21);
      if(ware.length<7||inward.length<7){
        alert(`Inventory row inputs missing for: ${t.customer} / ${t.oem} / ${t.part}`);
        return false;
      }
      for(let i=0;i<7;i++){
        const add = t[names[i]] || 0;
        ware[i].value = String(toInt(ware[i].value||0) + add); fire(ware[i]);
        inward[i].value = String(toInt(inward[i].value||0) + add); fire(inward[i]);
      }
    }
    return true;
  }

  function onSubmit(e){
    if(e && e.preventDefault) e.preventDefault();
    const totals = collectTotals();
    if(Object.keys(totals).length===0){
      alert('No inward quantities entered.'); return;
    }
    const ok = applyTotals(totals);
    if(ok){
      
    // --- persist OEM entries to backend DB ---
    try{
      const entries = [];
      for(const k in totals){
        const t = totals[k];
        const boxes = { pallet: Number(t.pallet||0), sleeve: Number(t.sleeve||0), lid: Number(t.lid||0), inserts: Number(t.inserts||0), separator: Number(t.separator||0), crates: Number(t.crates||0), dummy: Number(t.dummy||0) };
        entries.push({
          customer: t.customer || '',
          oem: t.oem || '',
          partName: t.part || '',
          invoice: (document.getElementById('oem_invoiceNo')||{}).value || '',
          vehicle: (document.getElementById('oem_vehicleNo')||{}).value || '',
          location: (document.getElementById('oem_locationSel')||{}).value || '',
          dispatchDate: (document.getElementById('oem_dispatchDate')||{}).value || '',
          receiveDate: (document.getElementById('oem_receiveDate')||{}).value || '',
          boxes: boxes
        });
      }
      // POST to backend
      fetch('/api/inventory/oem-inward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries })
      }).then(r=>r.json()).then(resp=>{
        if(resp && resp.ok){
          console.log('OEM entries persisted to server:', resp.results || resp);
        } else {
          console.warn('OEM persist failed', resp);
        }
      }).catch(e=>{ console.error('OEM persist error', e); });
    }catch(e){ console.error('Prepare OEM entries error', e); }
    // --- end persist ---
    alert('OEM Inward submitted and inventory updated.');
            try{ resetOEMInwardForm(); var d=document.getElementById('oem_dispatchDate'); if(d) d.value=''; var v=document.getElementById('oem_vehicleNo'); if(v) v.value=''; }catch(e){}

      // --- append to OEM History ---
      try{
        const dispatchVal = (document.getElementById('oem_dispatchDate')||{}).value || '';
        const invoiceVal = (document.getElementById('oem_invoiceNo')||{}).value || '';
        const vehicleVal = (document.getElementById('oem_vehicleNo')||{}).value || '';
        const locationVal = (document.getElementById('oem_locationSel')||{}).value || '';
        const ohT=document.getElementById('ohTbodyOem');
        const n=new Date(); const dd=String(n.getDate()).padStart(2,'0'); const mm=String(n.getMonth()+1).padStart(2,'0'); const yy=n.getFullYear();
        const recv=dd+'-'+mm+'-'+yy;
        if(ohT){
          for(const key in totals){
            const t=totals[key];
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
        }
      }catch(e){ console.error('append oem history error',e); }
      // --- end append ---

      resetOemInwardForm(); try{ var d=document.getElementById('oem_dispatchDate'); if(d) d.value=''; var v=document.getElementById('oem_vehicleNo'); if(v) v.value=''; }catch(e){}
    }
  }

  
function resetOemInwardForm(){ var btn = document.getElementById('oem_clearFilter'); if(btn) btn.click(); var containers=['oem_extraSameContainer','oem_extraDiffContainer','oem_extraDiffCustContainer']; containers.forEach(id=>{const c=document.getElementById(id); if(c) c.innerHTML='';}); }

document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('oem_submit') || (function(){
      const el = Array.from(document.querySelectorAll('#createOemView button')).find(b=>/submit/i.test(b.textContent));
      return el||null;
    })();
    if(btn) btn.addEventListener('click', onSubmit);
  });
})()
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

;