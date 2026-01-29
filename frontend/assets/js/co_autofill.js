// co_autofill.js - lightweight Create Outward autofill helper
(function(){
  function coNormalizeKey(str){
    if(!str && str !== 0) return '';
    return String(str).replace(/\s+/g,' ').trim().toUpperCase();
  }
  function coFindBoxQty(customer, oem, partName){
    const c = coNormalizeKey(customer), o = coNormalizeKey(oem), p = coNormalizeKey(partName);
    if(!c || !o || !p) return null;
    try{
      const tbody = document.getElementById('invTbody');
      if(tbody){
        const rows = Array.from(tbody.querySelectorAll('tr'));
        for(const row of rows){
          const rc = coNormalizeKey((row.querySelector('.col-customer')||{}).textContent);
          const ro = coNormalizeKey((row.querySelector('.col-oem')||{}).textContent);
          const rp = coNormalizeKey((row.querySelector('.col-part')||{}).textContent);
          if(rc===c && ro===o && rp===p){
            let inputs = Array.from(row.querySelectorAll('input.inv-input'));
            let bx = inputs.filter(el=> (el.id||'').startsWith('bx_')).slice(0,7);
            if(bx.length<7) bx = inputs.slice(0,7);
            const vals = bx.map(el=>{ const v = el.value; const n = Number(String(v).trim()); return isNaN(n)?0:n; });
            const [pal,slee,lid,ins,sep,crt,dum] = vals.concat([0,0,0,0,0,0,0]).slice(0,7);
            return { pallet: pal, sleeve: slee, lid: lid, inserts: ins, separator: sep, crates: crt, dummy: dum };
          }
        }
      }
    }catch(e){ console.warn('coFindBoxQty DOM failed', e); }
    const data = (window._inventory_full || window._inventory_normalized || []);
    if(!Array.isArray(data) || !data.length) return null;
    const rec = data.find(r=> 
      coNormalizeKey(r.customer)===c &&
      coNormalizeKey(r.oem)===o &&
      coNormalizeKey(r.partName)===p
    );
    if(!rec) return null;
    return rec.boxQuantity || null;
  }
  function coSafeNum(v){
    if(v===null||v===undefined||v==='') return 0;
    const n = Number(v);
    return isNaN(n)?0:n;
  }
  function applySets(palletInput, fields, customer, oem, partName){
    if(!palletInput) return;
    const sets = Number(String(palletInput.value||'0').trim());
    if(!isFinite(sets) || sets<=0){
      Object.values(fields||{}).forEach(f=>{ if(f) f.value='0'; });
      return;
    }
    const box = coFindBoxQty(customer,oem,partName);
    if(!box) return;
    const scaled = {
      pallet: coSafeNum(box.pallet)*sets,
      sleeve: coSafeNum(box.sleeve)*sets,
      lid: coSafeNum(box.lid)*sets,
      inserts: coSafeNum(box.inserts)*sets,
      separator: coSafeNum(box.separator)*sets,
      crates: coSafeNum(box.crates)*sets,
      dummy: coSafeNum(box.dummy)*sets
    };
    for(const k in fields){
      if(fields[k]) fields[k].value = scaled[k];
    }
  }
  function setupMain(){
    const pallet = document.getElementById('co_palletQty');
    if(!pallet) return;
    const fields = {
      pallet: pallet,
      sleeve: document.getElementById('co_sleeveQty'),
      lid: document.getElementById('co_lidQty'),
      inserts: document.getElementById('co_insertQty'),
      separator: document.getElementById('co_separatorQty'),
      crates: document.getElementById('co_cratesQty'),
      dummy: document.getElementById('co_dummyQty')
    };
    function refresh(){
      const customer = (document.getElementById('co_customerSel')||{}).value||'';
      const oem = (document.getElementById('co_oemSel')||{}).value||'';
      const part = (document.getElementById('co_partSel')||{}).value||'';
      applySets(pallet, fields, customer, oem, part);
    }
    ['input','change','blur'].forEach(evt=>pallet.addEventListener(evt, refresh));
    ['co_customerSel','co_oemSel','co_partSel'].forEach(id=>{
      const el = document.getElementById(id);
      if(el) el.addEventListener('change', ()=>{ if(pallet.value) refresh(); });
    });
  }
  function handleExtra(el){
    const m = (el.id||'').match(/^co_qty_(\d+)_0$/);
    if(!m) return;
    const idx = m[1];
    const fields = {
      pallet: document.getElementById(`co_qty_${idx}_0`),
      sleeve: document.getElementById(`co_qty_${idx}_1`),
      lid: document.getElementById(`co_qty_${idx}_2`),
      inserts: document.getElementById(`co_qty_${idx}_3`),
      separator: document.getElementById(`co_qty_${idx}_4`),
      crates: document.getElementById(`co_qty_${idx}_5`),
      dummy: document.getElementById(`co_qty_${idx}_6`)
    };
    let customer = (document.getElementById('co_customerSel')||{}).value||'';
    let oem = (document.getElementById('co_oemSel')||{}).value||'';
    let part = '';
    const same = document.getElementById(`co_same_part_${idx}`);
    const diffOem = document.getElementById(`co_diff_oem_${idx}`);
    const diffPart = document.getElementById(`co_diff_part_${idx}`);
    if(same){
      part = same.value||'';
    } else if(diffPart || diffOem){
      oem = diffOem ? diffOem.value : oem;
      part = diffPart ? diffPart.value : '';
    }
    applySets(el, fields, customer, oem, part);
  }
  function setupExtras(){
    document.addEventListener('input', function(e){
      const t = e.target;
      if(/^co_qty_\d+_0$/.test(t.id)) handleExtra(t);
    }, true);
    document.addEventListener('change', function(e){
      const t = e.target;
      const container = t.closest('.extra-block');
      if(container){
        const p = container.querySelector('input[id$="_0"]');
        if(p && p.value) handleExtra(p);
      }
    }, true);
  }
  document.addEventListener('DOMContentLoaded', function(){ setupMain(); setupExtras(); });
})();