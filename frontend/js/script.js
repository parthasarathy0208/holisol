/* ---------- App wiring (login, nav, restore prototypes) ---------- */
const loginForm = document.getElementById('loginForm');
const loginPage = document.getElementById('loginPage');
const appRoot = document.getElementById('app');
const headerUser = document.getElementById('headerUser');
const logoutBtn = document.getElementById('logoutBtn');
const API_BASE = 'https://holisol.onrender.com';
const hamburger = document.getElementById('hamburgerMenu');
const sidebar = document.querySelector('aside.sidebar');
const API_BASE_URL = "https://holisol.onrender.com";


if (hamburger && sidebar) {
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  sidebar.querySelectorAll('.menu button').forEach(btn => {
    btn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  });
}


loginForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  if(!user || !pass){ alert('Enter username and password'); return; }

  fetch('https://holisol.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass })
  })
  .then(r => {
    if (!r.ok) throw new Error();
    return r.json();
  })
  .then(() => {
    headerUser.textContent = user.toUpperCase();
    loginPage.classList.add('hidden');
    appRoot.classList.remove('hidden');
    showView('dashboard');
  })
  .catch(() => {
    alert('Login Failed');
  });
});

logoutBtn.addEventListener('click', ()=>{
  appRoot.classList.add('hidden');
  loginPage.classList.remove('hidden');
  document.getElementById('password').value = '';
});

function hideAllViews(){
  document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
  document.querySelectorAll('.menu button').forEach(b=> b.classList.remove('active'));
}

function showView(name){
  hideAllViews();

  // For INVENTORY view, keep the main area fixed and move the vertical scrollbar
  // inside the Inventory data container only.
  const mainEl = document.querySelector('.main');
  if(mainEl){
    if(name === 'inventory'){
      mainEl.classList.add('inv-fixed');
    } else {
      mainEl.classList.remove('inv-fixed');
    }
  }

  if(name === 'dashboard'){
    document.getElementById('dashboardView').classList.remove('hidden');
    document.getElementById('menuDashboard').classList.add('active');
  } else if(name === 'createOutward'){
    document.getElementById('createOutwardView').classList.remove('hidden');
  } else if(name === 'createInward'){
    document.getElementById('createInwardView').classList.remove('hidden');
  } else if(name === 'createOem'){
    document.getElementById('createOemView').classList.remove('hidden');
  } else if(name === 'inventory'){
    document.getElementById('inventoryView').classList.remove('hidden');
  } else if(name === 'outwardHistory'){
    document.getElementById('outwardHistoryView').classList.remove('hidden');
    document.getElementById('menuOutward').classList.add('active');
  } else if(name === 'inwardHistory'){
    document.getElementById('inwardHistoryView').classList.remove('hidden');
    document.getElementById('menuInward').classList.add('active');
  } else if(name === 'oemHistory'){
    document.getElementById('oemHistoryView').classList.remove('hidden');
    document.getElementById('menuOEM').classList.add('active');
  }else if (name === 'setavailability') {
    document.getElementById('setavailabilityView').classList.remove('hidden');
  }
}

/* Dashboard tile nav */
document.getElementById('createOutwardTile').addEventListener('click', ()=> showView('createOutward'));
document.getElementById('createInwardTile').addEventListener('click', ()=> showView('createInward'));
document.getElementById('createOemTile').addEventListener('click', ()=> showView('createOem'));
document.getElementById('tileInventory').addEventListener('click', () => {
  showView('inventory');
  loadInventoryChart();
});
document.getElementById('setavailabilityTile').addEventListener('click', () => {
  showView('setavailability');
});

/* Sidebar nav */
document.getElementById('menuDashboard').addEventListener('click', () => {
  showView('dashboard');
  setActiveMenu('menuDashboard');
});

document.getElementById('menuOutward').addEventListener('click', () => {
  showView('outwardHistory');
  loadOutwardHistory();
  
});

document.getElementById('menuInward').addEventListener('click', () => {
  showView('inwardHistory');
  loadInwardHistory();
});

document.getElementById('menuOEM').addEventListener('click', () => {
  showView('oemHistory');
  // setActiveMenu('menuOEM'); // temporarily disabled
  loadOemHistory();
});
document.getElementById('menuTransferHistory')
  .addEventListener('click', () => {
    showView('stockTransferHistory');
    setActiveMenu('menuTransferHistory');
  });

/* ---------- Numeric-only enforcement for small boxes and inventory inputs ---------- */
document.addEventListener('input', function(e){
  const t = e.target;
  if(!t) return;
  if(t.classList && t.classList.contains('small-box')){
    const cleaned = (t.value || '').replace(/\D/g,'');
    if(t.value !== cleaned) t.value = cleaned;
  }
  if(t.classList && t.classList.contains('inv-input')){
    const cleaned = (t.value || '').replace(/\D/g,'');
    if(t.value !== cleaned) t.value = cleaned;
  }
});

/* ---------- Add-more behavior (restored) ---------- */
function createSelect(id, options=[]){
  const sel = document.createElement('select'); sel.id = id; sel.className='with-arrow';
  sel.innerHTML = '<option value="">Select</option>' + options.map(o=>`<option>${o}</option>`).join('');
  sel.style.width='100%';
  return sel;
}

/* Outward add same/diff (unchanged) */


document.getElementById('co_addSame').addEventListener('click', ()=>{
  const idx = Date.now();
  const block = document.createElement('div'); block.className='extra-block'; block.dataset.idx=idx;
  const topRight = document.createElement('div'); topRight.className='extra-top-right';
  const clearBtn = document.createElement('button'); clearBtn.className='clear-btn'; clearBtn.textContent='CLEAR';
  const removeBtn = document.createElement('button'); removeBtn.className='remove-btn'; removeBtn.textContent='REMOVE';
  topRight.appendChild(clearBtn); topRight.appendChild(removeBtn); block.appendChild(topRight);

  const partLab = document.createElement('div'); partLab.className='label'; partLab.style.marginBottom='8px'; partLab.textContent='PART NAME *';
  block.appendChild(partLab);
  const pw = document.createElement('div'); 

  const inventory = window._inventory_normalized || [];
  const selCustomer = document.getElementById('co_customerSel') ? document.getElementById('co_customerSel').value : '';
  const selOEM = document.getElementById('co_oemSel') ? document.getElementById('co_oemSel').value : '';

  // Collect already selected parts from main form and existing extra blocks (same and diff)
  const selectedParts = new Set();
  const mainPart = document.getElementById('co_partSel') ? document.getElementById('co_partSel').value : '';
  if(mainPart) selectedParts.add(mainPart);
  // parts in existing same blocks
  document.querySelectorAll('#co_extraSameContainer select[id^="co_same_part_"]').forEach(s => { if(s.value) selectedParts.add(s.value); });
  // parts in existing diff blocks
  document.querySelectorAll('#co_extraDiffContainer select[id^="co_diff_part_"]').forEach(s => { if(s.value) selectedParts.add(s.value); });

  const parts = Array.from(new Set(
    inventory
      .filter(r => r.customer === selCustomer && r.oem === selOEM)
      .map(r => r.partName)
      .filter(p => p && !selectedParts.has(p))
  ));

  pw.appendChild(createSelect(`co_same_part_${idx}`, parts));
  block.appendChild(pw);

  const labels = ['Pallet','Sleeve','Lid','Inserts','Separator','Crates','Dummy'];
  const qtyRow = document.createElement('div'); qtyRow.className='small-inputs'; qtyRow.style.marginTop='14px';
  labels.forEach((lbl,i)=>{
    const cell = document.createElement('div');
    cell.style.textAlign='center'; cell.style.width='84px'; cell.style.color='#fff';
    const input = document.createElement('input'); input.className='small-box';
    input.id = `co_qty_${idx}_${i}`;
    input.setAttribute('inputmode','numeric'); input.setAttribute('pattern','\\d*'); input.setAttribute('autocomplete','off');
    input.placeholder = lbl;
    cell.appendChild(input); qtyRow.appendChild(cell);
  });

  block.appendChild(qtyRow);

  clearBtn.addEventListener('click', () => {
    block.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
    block.querySelectorAll('input.small-box').forEach(i => i.value = '');
  });
  removeBtn.addEventListener('click', () => block.remove());

  document.getElementById('co_extraSameContainer').appendChild(block);
  block.scrollIntoView({ behavior: 'smooth', block: 'center' });
});



/* Copied handler for Create Inward (ci_addSame) - duplicated from co_addSame */
document.getElementById('ci_addSame').addEventListener('click', ()=>{
  const idx = Date.now();
  const block = document.createElement('div'); block.className='extra-block'; block.dataset.idx=idx;
  const topRight = document.createElement('div'); topRight.className='extra-top-right';
  const clearBtn = document.createElement('button'); clearBtn.className='clear-btn'; clearBtn.textContent='CLEAR';
  const removeBtn = document.createElement('button'); removeBtn.className='remove-btn'; removeBtn.textContent='REMOVE';
  topRight.appendChild(clearBtn); topRight.appendChild(removeBtn); block.appendChild(topRight);

  const partLab = document.createElement('div'); partLab.className='label'; partLab.style.marginBottom='8px'; partLab.textContent='PART NAME *';
  block.appendChild(partLab);
  const pw = document.createElement('div'); pw.style.width='420px';

  const inventory = window._inventory_normalized || [];
  const selCustomer = document.getElementById('ci_customerSel') ? document.getElementById('ci_customerSel').value : '';
  const selOEM = document.getElementById('ci_oemSel') ? document.getElementById('ci_oemSel').value : '';

  // Collect already selected parts from main form and existing extra blocks (same and diff)
  const selectedParts = new Set();
  const mainPart = document.getElementById('ci_partSel') ? document.getElementById('ci_partSel').value : '';
  if(mainPart) selectedParts.add(mainPart);
  // parts in existing same blocks
  document.querySelectorAll('#ci_extraSameContainer select[id^="ci_same_part_"]').forEach(s => { if(s.value) selectedParts.add(s.value); });
  // parts in existing diff blocks
  document.querySelectorAll('#ci_extraDiffContainer select[id^="ci_diff_part_"]').forEach(s => { if(s.value) selectedParts.add(s.value); });

  const parts = Array.from(new Set(
    inventory
      .filter(r => r.customer === selCustomer && r.oem === selOEM)
      .map(r => r.partName)
      .filter(p => p && !selectedParts.has(p))
  ));

  pw.appendChild(createSelect(`ci_same_part_${idx}`, parts));
  block.appendChild(pw);

  const labels = ['Pallet','Sleeve','Lid','Inserts','Separator','Crates','Dummy'];
  const qtyRow = document.createElement('div'); qtyRow.className='small-inputs'; qtyRow.style.marginTop='14px';
  labels.forEach((lbl,i)=>{
    const cell = document.createElement('div');
    cell.style.textAlign='center'; cell.style.width='84px'; cell.style.color='#fff';
    const input = document.createElement('input'); input.className='small-box';
    input.id = `ci_qty_${idx}_${i}`;
    input.setAttribute('inputmode','numeric'); input.setAttribute('pattern','\\d*'); input.setAttribute('autocomplete','off');
    input.placeholder = lbl;
    cell.appendChild(input); qtyRow.appendChild(cell);
  });

  block.appendChild(qtyRow);

  clearBtn.addEventListener('click', () => {
    block.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
    block.querySelectorAll('input.small-box').forEach(i => i.value = '');
  });
  removeBtn.addEventListener('click', () => block.remove());

  document.getElementById('ci_extraSameContainer').appendChild(block);
  block.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

/* Copied handler for OEM Inward Collection (oem_addSame) - duplicated from co_addSame */
document.getElementById('oem_addSame').addEventListener('click', ()=>{
  const idx = Date.now();
  const block = document.createElement('div'); block.className='extra-block'; block.dataset.idx=idx;
  const topRight = document.createElement('div'); topRight.className='extra-top-right';
  const clearBtn = document.createElement('button'); clearBtn.className='clear-btn'; clearBtn.textContent='CLEAR';
  const removeBtn = document.createElement('button'); removeBtn.className='remove-btn'; removeBtn.textContent='REMOVE';
  topRight.appendChild(clearBtn); topRight.appendChild(removeBtn); block.appendChild(topRight);

  const partLab = document.createElement('div'); partLab.className='label'; partLab.style.marginBottom='8px'; partLab.textContent='PART NAME *';
  block.appendChild(partLab);
  const pw = document.createElement('div');

  const inventory = window._inventory_normalized || [];
  const selCustomer = document.getElementById('oem_customerSel') ? document.getElementById('oem_customerSel').value : '';
  const selOEM = document.getElementById('oem_oemSel') ? document.getElementById('oem_oemSel').value : '';

  // Collect already selected parts from main form and existing extra blocks (same and diff)
  const selectedParts = new Set();
  const mainPart = document.getElementById('oem_partSel') ? document.getElementById('oem_partSel').value : '';
  if(mainPart) selectedParts.add(mainPart);
  // parts in existing same blocks
  document.querySelectorAll('#oem_extraSameContainer select[id^="oem_same_part_"]').forEach(s => { if(s.value) selectedParts.add(s.value); });
  // parts in existing diff blocks
  document.querySelectorAll('#oem_extraDiffContainer select[id^="oem_diff_part_"]').forEach(s => { if(s.value) selectedParts.add(s.value); });

  const parts = Array.from(new Set(
    inventory
      .filter(r => r.customer === selCustomer && r.oem === selOEM)
      .map(r => r.partName)
      .filter(p => p && !selectedParts.has(p))
  ));

  pw.appendChild(createSelect(`oem_same_part_${idx}`, parts));
  block.appendChild(pw);

  const labels = ['Pallet','Sleeve','Lid','Inserts','Separator','Crates','Dummy'];
  const qtyRow = document.createElement('div'); qtyRow.className='small-inputs'; qtyRow.style.marginTop='14px';
  labels.forEach((lbl,i)=>{
    const cell = document.createElement('div');
    cell.style.textAlign='center'; cell.style.width='84px'; cell.style.color='#fff';
    const input = document.createElement('input'); input.className='small-box';
    input.id = `oem_qty_${idx}_${i}`;
    input.setAttribute('inputmode','numeric'); input.setAttribute('pattern','\\d*'); input.setAttribute('autocomplete','off');
    input.placeholder = lbl;
    cell.appendChild(input); qtyRow.appendChild(cell);
  });

  block.appendChild(qtyRow);

  clearBtn.addEventListener('click', () => {
    block.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
    block.querySelectorAll('input.small-box').forEach(i => i.value = '');
  });
  removeBtn.addEventListener('click', () => block.remove());

  document.getElementById('oem_extraSameContainer').appendChild(block);
  block.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
/* --- ci_addDiff handler: Add more for DIFFERENT CUSTOMER / OEM on Create Inward --- */
document.getElementById('ci_addDiff').addEventListener('click', () => {
  const inventory = window._inventory_normalized || [];
  const allCustomers = Array.from(new Set(inventory.map(r => r.customer).filter(c => !!c)));

  // Already selected customer in main Create Inward form
  const usedCustomers = new Set();
  const mainCustomerSel = document.getElementById('ci_customerSel');
  if (mainCustomerSel && mainCustomerSel.value) {
    usedCustomers.add(mainCustomerSel.value);
  }

  // Customers already chosen in previously added diff blocks
  document.querySelectorAll('#ci_extraDiffContainer select[id^="ci_diff_customer_"]').forEach(sel => {
    if (sel.value) {
      usedCustomers.add(sel.value);
    }
  });

  // Remaining customers that can still be chosen
  const availableCustomers = allCustomers.filter(c => !usedCustomers.has(c));

  // If no customers left, still allow the block to be created but the dropdown will have no customer options
  const idx = Date.now();
  const block = document.createElement('div');
  block.className = 'extra-block';
  block.dataset.idx = idx;

  const topRight = document.createElement('div');
  topRight.className = 'extra-top-right';
  const clearBtn = document.createElement('button');
  clearBtn.className = 'clear-btn';
  clearBtn.textContent = 'CLEAR';
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'REMOVE';
  topRight.appendChild(clearBtn);
  topRight.appendChild(removeBtn);
  block.appendChild(topRight);

  // CUSTOMER dropdown (shows only remaining customers)
  const custLab = document.createElement('div');
  custLab.className = 'label';
  custLab.style.marginBottom = '8px';
  custLab.textContent = 'CUSTOMER *';
  block.appendChild(custLab);

  const custWrap = document.createElement('div');
  
  const custSel = createSelect(`ci_diff_customer_${idx}`, availableCustomers);
  custWrap.appendChild(custSel);
  block.appendChild(custWrap);

  // OEM dropdown – will be populated once a customer is chosen
  const oemLab = document.createElement('div');
  oemLab.className = 'label';
  oemLab.style.margin = '12px 0 8px 0';
  oemLab.textContent = 'OEM *';
  block.appendChild(oemLab);

  const oemWrap = document.createElement('div');
  
  const oemSel = createSelect(`ci_diff_oem_${idx}`, []);
  oemWrap.appendChild(oemSel);
  block.appendChild(oemWrap);

  // PART NAME dropdown – populated based on selected customer & OEM
  const partLab = document.createElement('div');
  partLab.className = 'label';
  partLab.style.margin = '12px 0 8px 0';
  partLab.textContent = 'PART NAME *';
  block.appendChild(partLab);

  const partWrap = document.createElement('div');
 
  const partSel = createSelect(`ci_diff_part_${idx}`, []);
  partWrap.appendChild(partSel);
  block.appendChild(partWrap);

  // Seven small quantity inputs
  const labels = ['Pallet','Sleeve','Lid','Inserts','Separator','Crates','Dummy'];
  const qtyRow = document.createElement('div');
  qtyRow.className = 'small-inputs';
  qtyRow.style.marginTop = '14px';

  labels.forEach((lbl, i) => {
    const cell = document.createElement('div');
    cell.style.textAlign = 'center';
    cell.style.width = '84px';
    cell.style.color = '#fff';

    const input = document.createElement('input');
    input.className = 'small-box';
    input.id = `ci_qty_${idx}_${i}`;
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('pattern', '\\d*');
    input.setAttribute('autocomplete', 'off');
    input.placeholder = lbl;

    cell.appendChild(input);
    qtyRow.appendChild(cell);
  });

  block.appendChild(qtyRow);

  // Wiring for CLEAR and REMOVE
  clearBtn.addEventListener('click', () => {
    custSel.selectedIndex = 0;
    oemSel.innerHTML = '<option value="">Select</option>';
    partSel.innerHTML = '<option value="">Select</option>';
    block.querySelectorAll('input.small-box').forEach(i => { i.value = ''; });
  });

  removeBtn.addEventListener('click', () => {
    block.remove();
  });

  // Helper to rebuild OEM and PART dropdowns whenever customer/OEM changes
  const rebuildForCustomer = (customerVal) => {
    if (!customerVal) {
      oemSel.innerHTML = '<option value="">Select</option>';
      partSel.innerHTML = '<option value="">Select</option>';
      return;
    }

    const oems = Array.from(new Set(
      inventory
        .filter(r => r.customer === customerVal)
        .map(r => r.oem)
        .filter(o => !!o)
    ));

    oemSel.innerHTML = '<option value="">Select</option>' + oems.map(o => `<option>${o}</option>`).join('');

    const parts = Array.from(new Set(
      inventory
        .filter(r => r.customer === customerVal)
        .map(r => r.partName)
        .filter(p => !!p)
    ));

    partSel.innerHTML = '<option value="">Select</option>' + parts.map(p => `<option>${p}</option>`).join('');
  };

  const rebuildPartsForCustomerAndOem = (customerVal, oemVal) => {
    if (!customerVal) {
      partSel.innerHTML = '<option value="">Select</option>';
      return;
    }

    let rows = inventory.filter(r => r.customer === customerVal);
    if (oemVal) {
      rows = rows.filter(r => r.oem === oemVal);
    }

    const parts = Array.from(new Set(
      rows
        .map(r => r.partName)
        .filter(p => !!p)
    ));

    partSel.innerHTML = '<option value="">Select</option>' + parts.map(p => `<option>${p}</option>`).join('');
  };

  // When customer changes, populate OEM and PART NAME dropdowns for that customer
  custSel.addEventListener('change', () => {
    const cVal = custSel.value;
    rebuildForCustomer(cVal);
  });

  // When OEM changes, further refine PART NAME based on selected customer + OEM
  oemSel.addEventListener('change', () => {
    const cVal = custSel.value;
    const oVal = oemSel.value;
    rebuildPartsForCustomerAndOem(cVal, oVal);
  });

  document.getElementById('ci_extraDiffContainer').appendChild(block);
  block.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
/* --- End added handler --- */



document.getElementById('co_addDiff').addEventListener('click', ()=>{
  const idx = Date.now();
  const block = document.createElement('div'); block.className='extra-block'; block.dataset.idx=idx;
  const topRight = document.createElement('div'); topRight.className='extra-top-right';
  const clearBtn = document.createElement('button'); clearBtn.className='clear-btn'; clearBtn.textContent='CLEAR';
  const removeBtn = document.createElement('button'); removeBtn.className='remove-btn'; removeBtn.textContent='REMOVE';
  topRight.appendChild(clearBtn); topRight.appendChild(removeBtn); block.appendChild(topRight);

  const oemLab = document.createElement('div'); oemLab.className='label'; oemLab.style.marginBottom='8px'; oemLab.textContent='OEM *';
  block.appendChild(oemLab);
  const ow = document.createElement('div');

  const inventory = window._inventory_normalized || [];
  const selCustomer = document.getElementById('co_customerSel') ? document.getElementById('co_customerSel').value : '';

  // Collect already selected OEMs and parts to exclude
  const selectedOEMs = new Set();
  const mainOEM = document.getElementById('co_oemSel') ? document.getElementById('co_oemSel').value : '';
  if(mainOEM) selectedOEMs.add(mainOEM);
  // OEMs already added in diff blocks
  document.querySelectorAll('#co_extraDiffContainer select[id^="co_diff_oem_"]').forEach(s => { if(s.value) selectedOEMs.add(s.value); });

  // Also we will avoid suggesting parts already selected across main and extra blocks
  const selectedParts = new Set();
  const mainPart = document.getElementById('co_partSel') ? document.getElementById('co_partSel').value : '';
  if(mainPart) selectedParts.add(mainPart);
  document.querySelectorAll('#co_extraSameContainer select[id^="co_same_part_"]').forEach(s => { if(s.value) selectedParts.add(s.value); });
  document.querySelectorAll('#co_extraDiffContainer select[id^="co_diff_part_"]').forEach(s => { if(s.value) selectedParts.add(s.value); });

  // OEM options for same customer excluding already selected OEMs
  const oems = Array.from(new Set(
    inventory
      .filter(r => r.customer === selCustomer)
      .map(r => r.oem)
      .filter(o => o && !selectedOEMs.has(o))
  ));
  ow.appendChild(createSelect(`co_diff_oem_${idx}`, oems));
  block.appendChild(ow);

  const partLab = document.createElement('div'); partLab.className='label'; partLab.style.marginBottom='8px'; partLab.textContent='PART NAME *';
  block.appendChild(partLab);
  const pw = document.createElement('div'); 

  // If there is at least one OEM option, pre-populate parts for the first OEM option excluding already selectedParts; otherwise leave empty
  let parts = [];
  if(oems.length > 0){
    parts = Array.from(new Set(inventory.filter(r => r.customer === selCustomer && r.oem === oems[0]).map(r => r.partName).filter(p => p && !selectedParts.has(p))));
  }
  pw.appendChild(createSelect(`co_diff_part_${idx}`, parts));
  block.appendChild(pw);

  // When user changes OEM select in this block, update part select accordingly (excluding already selected parts)
  setTimeout(()=>{ // ensure elements are in DOM
    const oemSel = block.querySelector(`#co_diff_oem_${idx}`);
    const partSel = block.querySelector(`#co_diff_part_${idx}`);
    if(oemSel){
      oemSel.addEventListener('change', ()=>{
        const val = oemSel.value;
        // recompute selectedParts dynamically to include any that were selected after block creation
        const selPartsNow = new Set();
        const mainP = document.getElementById('co_partSel') ? document.getElementById('co_partSel').value : '';
        if(mainP) selPartsNow.add(mainP);
        document.querySelectorAll('#co_extraSameContainer select[id^="co_same_part_"]').forEach(s => { if(s.value) selPartsNow.add(s.value); });
        document.querySelectorAll('#co_extraDiffContainer select[id^="co_diff_part_"]').forEach(s => { if(s.value) selPartsNow.add(s.value); });

        const newParts = Array.from(new Set(inventory.filter(r => r.customer === selCustomer && r.oem === val).map(r => r.partName).filter(p => p && !selPartsNow.has(p))));
        // rebuild options
        if(partSel){
          partSel.innerHTML = '<option value="">Select</option>' + newParts.map(p=>`<option>${p}</option>`).join('');
        }
      });
    }
  }, 10);
  

  const labels = ['Pallet','Sleeve','Lid','Inserts','Separator','Crates','Dummy'];
  const qtyRow = document.createElement('div'); qtyRow.className='small-inputs'; qtyRow.style.marginTop='14px';
  labels.forEach((lbl,i)=>{
    const cell = document.createElement('div');
    cell.style.textAlign='center'; cell.style.width='84px'; cell.style.color='#ffffffff';
    const input = document.createElement('input'); input.className='small-box';
    input.id = `co_qty_${idx}_${i}`;
    input.setAttribute('inputmode','numeric'); input.setAttribute('pattern','\\d*'); input.setAttribute('autocomplete','off');
    input.placeholder = lbl;
    cell.appendChild(input); qtyRow.appendChild(cell);
  });

  block.appendChild(qtyRow);

  clearBtn.addEventListener('click', () => {
    block.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
    block.querySelectorAll('input.small-box').forEach(i => i.value = '');
  });
  removeBtn.addEventListener('click', () => block.remove());

  document.getElementById('co_extraDiffContainer').appendChild(block);
  block.scrollIntoView({behavior:'smooth', block:'center'});
});



/* --- ci_addDiffOem handler: Add more for DIFFERENT OEM on Create Inward (same customer) --- */
document.getElementById('ci_addDiffOem').addEventListener('click', () => {
  const inventory = window._inventory_normalized || [];

  const selCustomerEl = document.getElementById('ci_customerSel');
  const selCustomer = selCustomerEl ? selCustomerEl.value : '';
  if (!selCustomer) {
    alert('Please select CUSTOMER first');
    return;
  }

  // Collect already selected OEMs for this customer: main OEM + any diff-OEM blocks
  const selectedOEMs = new Set();
  const mainOemEl = document.getElementById('ci_oemSel');
  if (mainOemEl && mainOemEl.value) {
    selectedOEMs.add(mainOemEl.value);
  }

  // OEMs already chosen in previously added CI diff-OEM blocks
  document.querySelectorAll('#ci_extraDiffOemContainer select[id^="ci_diff_oem_"]').forEach(sel => {
    if (sel.value) {
      selectedOEMs.add(sel.value);
    }
  });

  // Candidate OEMs for this customer, excluding already selected
  const oems = Array.from(new Set(
    inventory
      .filter(r => r.customer === selCustomer)
      .map(r => r.oem)
      .filter(o => o && !selectedOEMs.has(o))
  ));

  const idx = Date.now();
  const block = document.createElement('div');
  block.className = 'extra-block';
  block.dataset.idx = idx;

  const topRight = document.createElement('div');
  topRight.className = 'extra-top-right';
  const clearBtn = document.createElement('button');
  clearBtn.className = 'clear-btn';
  clearBtn.textContent = 'CLEAR';
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'REMOVE';
  topRight.appendChild(clearBtn);
  topRight.appendChild(removeBtn);
  block.appendChild(topRight);

  // OEM dropdown
  const oemLab = document.createElement('div');
  oemLab.className = 'label';
  oemLab.style.marginBottom = '8px';
  oemLab.textContent = 'OEM *';
  block.appendChild(oemLab);

  const oemWrap = document.createElement('div');
  
  const oemSel = createSelect(`ci_diff_oem_${idx}`, oems);
  oemWrap.appendChild(oemSel);
  block.appendChild(oemWrap);

  // PART NAME dropdown
  const partLab = document.createElement('div');
  partLab.className = 'label';
  partLab.style.marginTop = '10px';
  partLab.style.marginBottom = '8px';
  partLab.textContent = 'PART NAME *';
  block.appendChild(partLab);

  const partWrap = document.createElement('div');
  
  const partSel = createSelect(`ci_diff_part_${idx}`, []);
  partWrap.appendChild(partSel);
  block.appendChild(partWrap);

  // Prepare exclusion set for parts (avoid repeating parts across main + extras)
  const computeSelectedParts = () => {
    const selectedParts = new Set();
    const mainPartEl = document.getElementById('ci_partSel');
    if (mainPartEl && mainPartEl.value) {
      selectedParts.add(mainPartEl.value);
    }
    document.querySelectorAll('#ci_extraSameContainer select[id^="ci_same_part_"]').forEach(s => {
      if (s.value) selectedParts.add(s.value);
    });
    document.querySelectorAll('#ci_extraDiffContainer select[id^="ci_diff_part_"]').forEach(s => {
      if (s.value) selectedParts.add(s.value);
    });
    document.querySelectorAll('#ci_extraDiffOemContainer select[id^="ci_diff_part_"]').forEach(s => {
      if (s.value) selectedParts.add(s.value);
    });
    return selectedParts;
  };

  const rebuildPartsForOem = (customerVal, oemVal) => {
    if (!customerVal || !oemVal) {
      partSel.innerHTML = '<option value="">Select</option>';
      return;
    }
    const selectedParts = computeSelectedParts();
    const parts = Array.from(new Set(
      inventory
        .filter(r => r.customer === customerVal && r.oem === oemVal)
        .map(r => r.partName)
        .filter(p => p && !selectedParts.has(p))
    ));
    partSel.innerHTML = '<option value="">Select</option>' + parts.map(p => `<option>${p}</option>`).join('');
  };

  // If there is at least one OEM option, pre-populate parts for the first OEM option
  if (oems.length > 0) {
    rebuildPartsForOem(selCustomer, oems[0]);
  }

  oemSel.addEventListener('change', () => {
    rebuildPartsForOem(selCustomer, oemSel.value);
  });

  // Seven small quantity inputs
  const labels = ['Pallet','Sleeve','Lid','Inserts','Separator','Crates','Dummy'];
  const qtyRow = document.createElement('div');
  qtyRow.className = 'small-inputs';
  qtyRow.style.marginTop = '14px';
  labels.forEach((lbl, i) => {
    const cell = document.createElement('div');
    cell.style.textAlign = 'center';
    cell.style.width = '84px';
    cell.style.color = '#fff';
    const input = document.createElement('input');
    input.className = 'small-box';
    input.id = `ci_qty_${idx}_${i}`;
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('pattern', '\\d*');
    input.setAttribute('autocomplete', 'off');
    input.placeholder = lbl;
    cell.appendChild(input);
    qtyRow.appendChild(cell);
  });
  block.appendChild(qtyRow);

  clearBtn.addEventListener('click', () => {
    oemSel.selectedIndex = 0;
    partSel.innerHTML = '<option value="">Select</option>';
    block.querySelectorAll('input.small-box').forEach(i => { i.value = ''; });
  });

  removeBtn.addEventListener('click', () => {
    block.remove();
  });

  document.getElementById('ci_extraDiffOemContainer').appendChild(block);
  block.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

/* -- ADD DIFF -- */
/* OEM Inward Collection: Add more for DIFFERENT CUSTOMER (same OEM) */
document.getElementById('oem_addDiff').addEventListener('click', () => {
  const inventory = window._inventory_normalized || [];

  // OEM selected in the main OEM Inward Collection form
  const selOEMEl = document.getElementById('oem_oemSel');
  const selOEM = selOEMEl ? selOEMEl.value : '';

  // All customers that have this OEM in inventory
  const allCustomersForOEM = Array.from(new Set(
    inventory
      .filter(r => r.oem === selOEM)
      .map(r => r.customer)
      .filter(c => !!c)
  ));

  // Customers already used with this OEM: main customer + all diff blocks
  const usedCustomers = new Set();
  const mainCustomerSel = document.getElementById('oem_customerSel');
  if (mainCustomerSel && mainCustomerSel.value) {
    usedCustomers.add(mainCustomerSel.value);
  }

  document.querySelectorAll('#oem_extraDiffContainer select[id^="oem_diff_cust_"]').forEach(sel => {
    if (sel.value) {
      usedCustomers.add(sel.value);
    }
  });

  // Remaining customers for this OEM
  const availableCustomers = allCustomersForOEM.filter(c => !usedCustomers.has(c));

  const idx = Date.now();
  const block = document.createElement('div');
  block.className = 'extra-block';
  block.dataset.idx = idx;

  const topRight = document.createElement('div');
  topRight.className = 'extra-top-right';
  const clearBtn = document.createElement('button');
  clearBtn.className = 'clear-btn';
  clearBtn.textContent = 'CLEAR';
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'REMOVE';
  topRight.appendChild(clearBtn);
  topRight.appendChild(removeBtn);
  block.appendChild(topRight);

  // CUSTOMER dropdown (other customers for the same OEM, excluding already used)
  const custLab = document.createElement('div');
  custLab.className = 'label';
  custLab.style.marginBottom = '8px';
  custLab.textContent = 'CUSTOMER *';
  block.appendChild(custLab);

  const custWrap = document.createElement('div');
 
  const custSel = createSelect(`oem_diff_cust_${idx}`, availableCustomers);
  custWrap.appendChild(custSel);
  block.appendChild(custWrap);

  // PART NAME dropdown (for selected customer + selected OEM)
  const partLab = document.createElement('div');
  partLab.className = 'label';
  partLab.style.marginTop = '10px';
  partLab.style.marginBottom = '8px';
  partLab.textContent = 'PART NAME *';
  block.appendChild(partLab);

  const partWrap = document.createElement('div');
  
  const partSel = createSelect(`oem_diff_part_${idx}`, []);
  partWrap.appendChild(partSel);
  block.appendChild(partWrap);

  // Small quantity inputs (7 boxes)
  const labels = ['Pallet','Sleeve','Lid','Inserts','Separator','Crates','Dummy'];
  const qtyRow = document.createElement('div');
  qtyRow.className = 'small-inputs';
  qtyRow.style.marginTop = '14px';
  labels.forEach((lbl, i) => {
    const cell = document.createElement('div');
    cell.style.textAlign = 'center';
    cell.style.width = '84px';
    cell.style.color = '#fff';
    const input = document.createElement('input');
    input.className = 'small-box';
    input.id = `qty_${idx}_${i}`;
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('pattern', '\\d*');
    input.setAttribute('autocomplete', 'off');
    input.placeholder = lbl;
    cell.appendChild(input);
    qtyRow.appendChild(cell);
  });

  block.appendChild(qtyRow);

  // When customer changes, populate PART NAME dropdown with parts for that OEM + customer
  const rebuildPartsForCustomerAndOem = (customerVal, oemVal) => {
    if (!customerVal || !oemVal) {
      partSel.innerHTML = '<option value="">Select</option>';
      return;
    }

    const parts = Array.from(new Set(
      inventory
        .filter(r => r.customer === customerVal && r.oem === oemVal)
        .map(r => r.partName)
        .filter(p => !!p)
    ));

    partSel.innerHTML = '<option value="">Select</option>' + parts.map(p => `<option>${p}</option>`).join('');
  };

  custSel.addEventListener('change', () => {
    const customerVal = custSel.value;
    rebuildPartsForCustomerAndOem(customerVal, selOEM);
  });

  clearBtn.addEventListener('click', () => {
    custSel.selectedIndex = 0;
    partSel.innerHTML = '<option value="">Select</option>';
    block.querySelectorAll('input.small-box').forEach(i => i.value = '');
  });

  removeBtn.addEventListener('click', () => block.remove());

  document.getElementById('oem_extraDiffContainer').appendChild(block);
  block.scrollIntoView({ behavior: 'smooth', block: 'center' });
});


let inventoryDataset = [];

async function loadInventoryChart() {
  const tbody = document.getElementById('invTbody');

  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="38" style="text-align:center; padding:20px;">
          Loading inventory...
        </td>
      </tr>
    `;
  }

  try {
    const res = await fetch(
      'https://holisol.onrender.com/api/inventory',
      { cache: 'no-store' }
    );

    const resp = await res.json();
    inventoryDataset = resp.docs || [];

    renderInventoryRows(inventoryDataset);

    // ensure scroll reset after render
    setTimeout(() => {
      const invOuter = document.getElementById('invTableOuter');
      if (invOuter) invOuter.scrollLeft = 0;
    }, 50);

  } catch (err) {
    console.error('Inventory load error', err);
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="38" style="text-align:center; color:red;">
            Failed to load inventory
          </td>
        </tr>
      `;
    }
  }
}
function renderInventoryRows(rows) {
  const tbody = document.getElementById('invTbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  rows.forEach(r => {
    const tr = document.createElement('tr');

    const box = r.boxQuantity || [];
    const wh  = r.warehouse || [];
    const inn = r.inward || [];
    const out = r.outward || [];
    const dmg = r.damage || [];

    tr.innerHTML = `
      <td>${r.customer || ''}</td>
      <td>${r.oem || ''}</td>
      <td>${r.part || ''}</td>

      ${box.map(v => `<td><input class="inv-input" value="${v || 0}"></td>`).join('')}
      ${wh.map(v => `<td><input class="inv-input" value="${v || 0}"></td>`).join('')}
      ${inn.map(v => `<td><input class="inv-input" value="${v || 0}"></td>`).join('')}
      ${out.map(v => `<td><input class="inv-input" value="${v || 0}"></td>`).join('')}
      ${dmg.map(v => `<td><input class="inv-input" value="${v || 0}"></td>`).join('')}
    `;

    tbody.appendChild(tr);
  });
}

/* ---------- Each history has its own sample dataset (so backend can write separately) ---------- */
let outwardDataset = [];

async function loadOutwardHistory() {
  const tbody = document.getElementById('ohTbodyOut');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="15" style="text-align:center; padding:20px;">
          Loading...
        </td>
      </tr>
    `;
  }

  try {
    const res = await fetch(
      'https://holisol.onrender.com/api/inventory/outward',
      { cache: 'no-store' }
    );

    const resp = await res.json();

    outwardDataset = (resp.docs || []).map(d => {
      const b = d.boxes || {};

      return {
        dispatch: d.dispatchDate || '',
        receive: d.receiveDate || '',
        invoice: d.invoice || '',
        vehicle: d.vehicle || '',
        location: d.location || '',
        customer: d.customer || '',
        oem: d.oem || '',
        part: d.partName || '',
        inward: [
          b.pallet || 0,
          b.sleeve || 0,
          b.lid || 0,
          b.inserts || 0,
          b.separator || 0,
          b.crates || 0,
          b.dummy || 0
        ]
        // ❌ no shortage
        // ❌ no sets
      };
    });

    renderHistoryRows(outwardDataset, 'ohTbodyOut');
    populateFilters(outwardDataset, 'out');

  } catch (e) {
    console.error('loadOutwardHistory error', e);
  }
}
let inwardDataset = [];

async function loadInwardHistory() {
  const tbody = document.getElementById('ohTbodyIn');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="25" style="text-align:center; padding:20px;">
          Loading...
        </td>
      </tr>
    `;
  }

  try {
    const res = await fetch(
      'https://holisol.onrender.com/api/inventory/inward',
      { cache: 'no-store' }
    );

    const resp = await res.json();

    inwardDataset = (resp.docs || []).map(d => {
      const b = d.boxes || {};
      const s = d.shortages || {};

      return {
        dispatch: d.dispatchDate || '',
        receive: d.receiveDate || '',
        invoice: d.invoice || '',
        vehicle: d.vehicle || '',
        location: d.location || '',
        customer: d.customer || '',
        oem: d.oem || '',
        part: d.partName || '',
        inward: [
          b.pallet || 0,
          b.sleeve || 0,
          b.lid || 0,
          b.inserts || 0,
          b.separator || 0,
          b.crates || 0,
          b.dummy || 0
        ],
        shortage: [
          s.pallet || 0,
          s.sleeve || 0,
          s.lid || 0,
          s.inserts || 0,
          s.separator || 0,
          s.crates || 0,
          s.dummy || 0
        ],
        sets: d.sets || ''
      };
    });

    renderHistoryRows(inwardDataset, 'ohTbodyIn');
    populateFilters(inwardDataset, 'in');

  } catch (e) {
    console.error('loadInwardHistory error', e);
  }
}


let oemDataset = [];
async function loadOemHistory() {
  const tbody = document.getElementById('ohTbodyOem');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="25" style="text-align:center; padding:20px;">
          Loading...
        </td>
      </tr>
    `;
  }

  try {
    const res = await fetch(
      'https://holisol.onrender.com/api/inventory/oem-inward',
      { cache: 'no-store' }
    );

    const resp = await res.json();

    oemDataset = (resp.docs || []).map(d => {
      const b = d.boxes || {};
      const s = d.shortages || {};
      return {
        dispatch: d.dispatchDate || '',
        receive: d.receiveDate || '',
        invoice: d.invoice || '',
        vehicle: d.vehicle || '',
        location: d.location || '',
        customer: d.customer || '',
        oem: d.oem || '',
        part: d.partName || '',
        inward: [
          b.pallet||0,b.sleeve||0,b.lid||0,
          b.inserts||0,b.separator||0,b.crates||0,b.dummy||0
        ],
        shortage: [
          s.pallet||0,s.sleeve||0,s.lid||0,
          s.inserts||0,s.separator||0,s.crates||0,s.dummy||0
        ],
        sets: d.sets || ''
      };
    });

    renderHistoryRows(oemDataset, 'ohTbodyOem');
    populateFilters(oemDataset, 'oem');

  } catch (e) {
    console.error(e);
  }
}

/* render helpers — now render INWARD (7) and SHORTAGE (8, with sets first); add classes for sticky columns + partname/location widths */
function renderHistoryRows(dataset, tbodyId){
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = '';
  dataset.forEach(r=>{
    const tr = document.createElement('tr');
    // base columns (not sticky now)
    let html = `
      <td class="col-dispatch">${r.dispatch}</td>
      <td class="col-receive">${r.receive}</td>
      <td class="col-invno">${r.invoice}</td>
      <td class="col-vehicle">${r.vehicle}</td>
      <td class="col-location">${r.location}</td>
      <td class="col-customer">${r.customer}</td>
      <td class="col-oem">${r.oem}</td>
      <td class="col-partname">${r.part}</td>
    `;
    // inward cells (7)
    html += (r.inward || new Array(7).fill('')).map(v=>`<td class="inward-group">${v}</td>`).join('');
    // shortage: first column = sets (if present), then 7 values
    if(tbodyId !== 'ohTbodyOut'){
      const setsCell = `<td class="shortage-group">${r.sets || ''}</td>`;
      const outVals = (r.shortage || new Array(7).fill('')).map(v=>`<td class="shortage-group">${v}</td>`).join('');
      html += setsCell + outVals;
    }
    
    tr.innerHTML = html;
    tbody.appendChild(tr);
  });
}

/* initial render for each */
renderHistoryRows(outwardDataset,'ohTbodyOut');
renderHistoryRows(inwardDataset,'ohTbodyIn');
renderHistoryRows(oemDataset,'ohTbodyOem');


/* filter behavior for each */
/* helper to populate select options */
function populateFilters(dataset, suffix){
  const locSel = document.getElementById('oh_location_'+suffix);
  const custSel = document.getElementById('oh_customer_'+suffix);
  const oemSel = document.getElementById('oh_oem_'+suffix);
  if(!locSel || !custSel || !oemSel) return;
  const locations = [...new Set(dataset.map(d=>d.location).filter(Boolean))].sort();
  const customers = [...new Set(dataset.map(d=>d.customer).filter(Boolean))].sort();
  const oems = [...new Set(dataset.map(d=>d.oem).filter(Boolean))].sort();
  // clear existing options (keep first 'All' option)
  locSel.innerHTML = '<option value=\"\">All locations</option>' + locations.map(v=>`<option value=\"${v}\">${v}</option>`).join('');
  custSel.innerHTML = '<option value=\"\">All customers</option>' + customers.map(v=>`<option value=\"${v}\">${v}</option>`).join('');
  oemSel.innerHTML = '<option value=\"\">All OEMs</option>' + oems.map(v=>`<option value=\"${v}\">${v}</option>`).join('');
}

/* helper to get rows filtered by the three filters */
function getFilteredRows(dataset, suffix){
  const loc = document.getElementById('oh_location_'+suffix).value;
  const cust = document.getElementById('oh_customer_'+suffix).value;
  const oem = document.getElementById('oh_oem_'+suffix).value;
  return dataset.filter(d=>{
    return (loc ? d.location === loc : true) &&
           (cust ? d.customer === cust : true) &&
           (oem ? d.oem === oem : true);
  });
}

/* attach for outward */
if(document.getElementById('oh_location_out')){
  populateFilters(outwardDataset,'out');
  document.getElementById('oh_location_out').addEventListener('change', ()=>{ renderHistoryRows(getFilteredRows(outwardDataset,'out'),'ohTbodyOut'); });
  document.getElementById('oh_customer_out').addEventListener('change', ()=>{ renderHistoryRows(getFilteredRows(outwardDataset,'out'),'ohTbodyOut'); });
  document.getElementById('oh_oem_out').addEventListener('change', ()=>{ renderHistoryRows(getFilteredRows(outwardDataset,'out'),'ohTbodyOut'); });
  document.getElementById('oh_clear_out').addEventListener('click', ()=>{
    document.getElementById('oh_location_out').selectedIndex = 0;
    document.getElementById('oh_customer_out').selectedIndex = 0;
    document.getElementById('oh_oem_out').selectedIndex = 0;
    renderHistoryRows(outwardDataset,'ohTbodyOut');
  });
}

/* attach for inward */
if(document.getElementById('oh_location_in')){
  populateFilters(inwardDataset,'in');
  document.getElementById('oh_location_in').addEventListener('change', ()=>{ renderHistoryRows(getFilteredRows(inwardDataset,'in'),'ohTbodyIn'); });
  document.getElementById('oh_customer_in').addEventListener('change', ()=>{ renderHistoryRows(getFilteredRows(inwardDataset,'in'),'ohTbodyIn'); });
  document.getElementById('oh_oem_in').addEventListener('change', ()=>{ renderHistoryRows(getFilteredRows(inwardDataset,'in'),'ohTbodyIn'); });
  document.getElementById('oh_clear_in').addEventListener('click', ()=>{
    document.getElementById('oh_location_in').selectedIndex = 0;
    document.getElementById('oh_customer_in').selectedIndex = 0;
    document.getElementById('oh_oem_in').selectedIndex = 0;
    renderHistoryRows(inwardDataset,'ohTbodyIn');
  });
}

/* attach for oem */
if(document.getElementById('oh_location_oem')){
  populateFilters(oemDataset,'oem');
  document.getElementById('oh_location_oem').addEventListener('change', ()=>{ renderHistoryRows(getFilteredRows(oemDataset,'oem'),'ohTbodyOem'); });
  document.getElementById('oh_customer_oem').addEventListener('change', ()=>{ renderHistoryRows(getFilteredRows(oemDataset,'oem'),'ohTbodyOem'); });
  document.getElementById('oh_oem_oem').addEventListener('change', ()=>{ renderHistoryRows(getFilteredRows(oemDataset,'oem'),'ohTbodyOem'); });
  document.getElementById('oh_clear_oem').addEventListener('click', ()=>{
    document.getElementById('oh_location_oem').selectedIndex = 0;
    document.getElementById('oh_customer_oem').selectedIndex = 0;
    document.getElementById('oh_oem_oem').selectedIndex = 0;
    renderHistoryRows(oemDataset,'ohTbodyOem');
  });
}
/* ---------- Export helpers (adjusted to INWARD=7, SHORTAGE=8) ---------- */
function headerRowsForExport(){
  const first = ['DISPATCH DATE','RECEIVE DATE','INVOICE NO','VEHICLE NO','LOCATION','CUSTOMER','OEM','PARTNAME'];
  // INWARD group header (7)
  first.push('INWARD'); for(let i=0;i<6;i++) first.push('');
  // SHORTAGE group header (8)
  first.push('SHORTAGE'); for(let i=0;i<7;i++) first.push('');
  const inward = ['PALLET','SLEEVE','LID','INSERTS','SEPERATOR','CRATES','DUMMY'];
  const shortage = ['SETS','PALLET','SLEEVE','LID','INSERTS','SEPERATOR','CRATES','DUMMY'];
  const second = ['','','','','','','',''].concat(inward).concat(shortage);
  return { first, second, inward, shortage };
}

function buildCSVWithTwoHeaderRows(rows){
  const { first, second } = headerRowsForExport();
  const mkRow = (arr) => arr.map(cell => {
    const s = (cell === null || cell === undefined) ? '' : String(cell);
    const escaped = s.replace(/"/g,'""');
    return (escaped.indexOf(',') >= 0 || escaped.indexOf('"') >= 0) ? `"${escaped}"` : escaped;
  }).join(',');
  const lines = [];
  lines.push(mkRow(first));
  lines.push(mkRow(second));
  rows.forEach(r=>{
    const main = [r.dispatch, r.receive, r.invoice, r.vehicle, r.location, r.customer, r.oem, r.part];
    const inwardVals = (r.inward || new Array(7).fill('')).map(n => ''+n);
    const shortageVals = [(r.sets || '')].concat((r.shortage || new Array(7).fill('')).map(n => ''+n));
    lines.push(mkRow(main.concat(inwardVals).concat(shortageVals)));
  });
  return lines.join('\r\n');
}

function downloadFile(filename, content, mime){
  const blob = new Blob([content], {type: mime || 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 200);
}

function exportXlsxFromDataset(rows, filename, sheetName){
  const { first, second, inward, shortage } = headerRowsForExport();
  const aoa = []; aoa.push(first); aoa.push(second);
  rows.forEach(r=>{
    const main = [r.dispatch, r.receive, r.invoice, r.vehicle, r.location, r.customer, r.oem, r.part];
    const inwardVals = (r.inward || new Array(7).fill('')).map(n => n);
    const shortageVals = [(r.sets || '')].concat((r.shortage || new Array(7).fill('')).map(n => n));
    aoa.push(main.concat(inwardVals).concat(shortageVals));
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!merges'] = ws['!merges'] || [];
  // merge INWARD header (row0 cols 8..14)
  ws['!merges'].push({ s: { r:0, c:8 }, e: { r:0, c:14 } });
  // merge SHORTAGE header (row0 cols 15..22)
  ws['!merges'].push({ s: { r:0, c:15 }, e: { r:0, c:22 } });

  // columns: 8 base +7 inward +8 shortage = 23
  ws['!cols'] = [
    {wpx:90},{wpx:90},{wpx:95},{wpx:80},{wpx:85},{wpx:90},{wpx:100},{wpx:115},
    {wpx:48},{wpx:48},{wpx:48},{wpx:48},{wpx:48},{wpx:48},{wpx:48},
    {wpx:48},{wpx:48},{wpx:48},{wpx:48},{wpx:48},{wpx:48},{wpx:48},{wpx:48}
  ];

  for(let R=0; R<aoa.length; R++){
    for(let C=0; C<aoa[R].length; C++){
      const addr = XLSX.utils.encode_cell({r:R,c:C});
      if(!ws[addr]) continue;
      ws[addr].s = ws[addr].s || {};
      ws[addr].s.font = ws[addr].s.font || {};
      ws[addr].s.font.sz = 11;
      ws[addr].s.font.bold = R < 2 ? true : false;
      ws[addr].s.alignment = { horizontal: "center", vertical: "center", wrapText: true };
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName || 'History');
  XLSX.writeFile(wb, filename);
}

/* ---------- Attach export buttons for each history ---------- */
/* OUTWARD */
document.getElementById('btnExcelOut').addEventListener('click', ()=>{
  const rows = getFilteredRows(outwardDataset,'out');
  exportXlsxFromDataset(rows, 'outward_history.xlsx', 'OutwardHistory');
});
document.getElementById('btnCsvOut').addEventListener('click', ()=>{
  const rows = getFilteredRows(outwardDataset,'out');
  const csv = buildCSVWithTwoHeaderRows(rows);
  downloadFile('outward_history.csv', csv);
});
document.getElementById('btnPrintOut').addEventListener('click', ()=>{
  const popup = window.open('','_blank','width=900,height=700');
  const html = document.getElementById('ohDataOut').innerHTML;
  popup.document.write(`<html><head><title>Print Outward</title><style>table{border-collapse:collapse;width:100%}th,td{border:1px solid #333;padding:6px;font-size:11pt;text-align:center}
/* Ensure the seven small inputs stay in a single row */
.small-inputs{display:flex;flex-wrap:nowrap;gap:18px;align-items:center}
.small-inputs .small-field{min-width:78px;max-width:78px;width:78px;box-sizing:border-box}
/* Keep select widths consistent */
.select-row .with-arrow{width:420px;max-width:420px}

/* Ensure outer panels can expand when add-more blocks are appended */
.panel{height:auto !important}

/* Force the seven small inputs in each added block to stay in a single row */
.extra-block .small-inputs{display:flex;flex-wrap:nowrap;gap:18px;align-items:center;overflow:visible}
.extra-block .small-inputs > div{flex:0 0 84px;min-width:84px;max-width:84px;box-sizing:border-box}
.extra-block .small-inputs .small-box{width:78px;box-sizing:border-box}

/* Ensure added blocks do not push existing select widths */
.extra-block{box-sizing:border-box;overflow:visible}
.extra-block > div{max-width:420px;box-sizing:border-box}
.extra-block .with-arrow{width:420px;max-width:420px}

</style></head><body><h3>OUTWARD HISTORY</h3>${html}</body></html>`);
  popup.document.close(); setTimeout(()=>popup.print(),300);
});

/* INWARD */
document.getElementById('btnExcelIn').addEventListener('click', ()=>{
  const rows = getFilteredRows(inwardDataset,'in');
  exportXlsxFromDataset(rows, 'inward_history.xlsx', 'InwardHistory');
});
document.getElementById('btnCsvIn').addEventListener('click', ()=>{
  const rows = getFilteredRows(inwardDataset,'in');
  const csv = buildCSVWithTwoHeaderRows(rows);
  downloadFile('inward_history.csv', csv);
});
document.getElementById('btnPrintIn').addEventListener('click', ()=>{
  const popup = window.open('','_blank','width=900,height=700');
  const html = document.getElementById('ohDataIn').innerHTML;
  popup.document.write(`<html><head><title>Print Inward</title><style>table{border-collapse:collapse;width:100%}th,td{border:1px solid #333;padding:6px;font-size:11pt;text-align:center}
/* Ensure the seven small inputs stay in a single row */
.small-inputs{display:flex;flex-wrap:nowrap;gap:18px;align-items:center}
.small-inputs .small-field{min-width:78px;max-width:78px;width:78px;box-sizing:border-box}
/* Keep select widths consistent */
.select-row .with-arrow{width:420px;max-width:420px}

/* Ensure outer panels can expand when add-more blocks are appended */
.panel{height:auto !important}

/* Force the seven small inputs in each added block to stay in a single row */
.extra-block .small-inputs{display:flex;flex-wrap:nowrap;gap:18px;align-items:center;overflow:visible}
.extra-block .small-inputs > div{flex:0 0 84px;min-width:84px;max-width:84px;box-sizing:border-box}
.extra-block .small-inputs .small-box{width:78px;box-sizing:border-box}

/* Ensure added blocks do not push existing select widths */
.extra-block{box-sizing:border-box;overflow:visible}
.extra-block > div{max-width:420px;box-sizing:border-box}
.extra-block .with-arrow{width:420px;max-width:420px}

</style></head><body><h3>INWARD HISTORY</h3>${html}</body></html>`);
  popup.document.close(); setTimeout(()=>popup.print(),300);
});

/* OEM */
document.getElementById('btnExcelOem').addEventListener('click', ()=>{
  const rows = getFilteredRows(oemDataset,'oem');
  exportXlsxFromDataset(rows, 'oem_history.xlsx', 'OEMHistory');
});
document.getElementById('btnCsvOem').addEventListener('click', ()=>{
  const rows = getFilteredRows(oemDataset,'oem');
  const csv = buildCSVWithTwoHeaderRows(rows);
  downloadFile('oem_history.csv', csv);
});
document.getElementById('btnPrintOem').addEventListener('click', ()=>{
  const popup = window.open('','_blank','width=900,height=700');
  const html = document.getElementById('ohDataOem').innerHTML;
  popup.document.write(`<html><head><title>Print OEM</title><style>table{border-collapse:collapse;width:100%}th,td{border:1px solid #333;padding:6px;font-size:11pt;text-align:center}
/* Ensure the seven small inputs stay in a single row */
.small-inputs{display:flex;flex-wrap:nowrap;gap:18px;align-items:center}
.small-inputs .small-field{min-width:78px;max-width:78px;width:78px;box-sizing:border-box}
/* Keep select widths consistent */
.select-row .with-arrow{width:420px;max-width:420px}

/* Ensure outer panels can expand when add-more blocks are appended */
.panel{height:auto !important}

/* Force the seven small inputs in each added block to stay in a single row */
.extra-block .small-inputs{display:flex;flex-wrap:nowrap;gap:18px;align-items:center;overflow:visible}
.extra-block .small-inputs > div{flex:0 0 84px;min-width:84px;max-width:84px;box-sizing:border-box}
.extra-block .small-inputs .small-box{width:78px;box-sizing:border-box}

/* Ensure added blocks do not push existing select widths */
.extra-block{box-sizing:border-box;overflow:visible}
.extra-block > div{max-width:420px;box-sizing:border-box}
.extra-block .with-arrow{width:420px;max-width:420px}

</style></head><body><h3>OEM HISTORY</h3>${html}</body></html>`);
  popup.document.close(); setTimeout(()=>popup.print(),300);
});

/* hide bottom pagination elements if present */
const ohPag = document.getElementById('ohPagination'); if(ohPag) ohPag.style.display='none';

/* ---------- Inventory behaviours (updated indices since S.NO removed & BOX QTY is 7 cols) ---------- */
const invSaveBtn = document.getElementById('inv_save');
if(invSaveBtn) invSaveBtn.addEventListener('click', ()=>{
  const rows = [];
  const tbody = document.getElementById('invTbody');
  for(let r=0; r<tbody.rows.length; r++){
    const row = tbody.rows[r];
    // column mapping now:
    // 0 = customer, 1 = oem, 2 = part
    // 3-9 = box quantity (7)
    // 10-16 = warehouse stock (7)
    // 17-23 = inward (7)
    // 24-30 = outward (7)
    const customer = row.cells[0].textContent.trim();
    const oem = row.cells[1].textContent.trim();
    const part = row.cells[2].textContent.trim();

    const boxQty = [];
    for(let c=3;c<=9;c++){ const inp = row.cells[c].querySelector('input'); boxQty.push(inp ? (inp.value.trim()||'0') : '0'); }

    const ws = [];
    for(let c=10;c<=16;c++){ const inp = row.cells[c].querySelector('input'); ws.push(inp ? (inp.value.trim()||'0') : '0'); }

    const inn = [];
    for(let c=17;c<=23;c++){ const inp = row.cells[c].querySelector('input'); inn.push(inp ? (inp.value.trim()||'0') : '0'); }

    const out = [];
    for(let c=24;c<=30;c++){ const inp = row.cells[c].querySelector('input'); out.push(inp ? (inp.value.trim()||'0') : '0'); }

    rows.push({customer,oem,part,boxQuantity:boxQty,warehouse:ws,inward:inn,outward:out});
  }
});
/* Inventory export helpers: build header rows explicitly so Excel aligns with on-screen layout */
function inventoryHeaderRowsForExport(){
  const first = [
    'CUSTOMER','OEM','PARTNAME',
    'BOX QUANTITY','','','','','','',
    'WAREHOUSE STOCK','','','','','','',
    'INWARD','','','','','','',
    'OUTWARD','','','','','','',
    'DAMAGE','','','','','',''
  ];

  const second = [
    'CUSTOMER','OEM','PARTNAME',
    'PALLET','SLEEVE','LID','INSERTS','SEPARATOR','CRATES','DUMMY',
    'PALLET','SLEEVE','LID','INSERTS','SEPARATOR','CRATES','DUMMY',
    'PALLET','SLEEVE','LID','INSERTS','SEPARATOR','CRATES','DUMMY',
    'PALLET','SLEEVE','LID','INSERTS','SEPARATOR','CRATES','DUMMY',
    'PALLET','SLEEVE','LID','INSERTS','SEPARATOR','CRATES','DUMMY'
  ];
  return { first, second };
}

function buildInventoryAoA(){
  const tbody = document.getElementById('invTbody');
  if(!tbody) return [];
  const rows = Array.from(tbody.rows || []);
  const aoa = [];
  const headers = inventoryHeaderRowsForExport();
  aoa.push(headers.first);
  aoa.push(headers.second);

  rows.forEach(tr=>{
    const cells = tr.cells;
    const row = [];

    row.push((cells[0]?.textContent || '').trim()); // CUSTOMER
    row.push((cells[1]?.textContent || '').trim()); // OEM
    row.push((cells[2]?.textContent || '').trim()); // PART

    function pushInputs(start, end){
      for(let c=start; c<=end; c++){
        const td = cells[c];
        const inp = td ? td.querySelector('input, textarea, select') : null;
        row.push(inp ? (inp.value || '') : '');
      }
    }

    pushInputs(3,9);   // BOX QTY
    pushInputs(10,16); // WAREHOUSE
    pushInputs(17,23); // INWARD
    pushInputs(24,30); // OUTWARD
    pushInputs(31,37); // DAMAGE

    aoa.push(row);
  });
  return aoa;
}

function buildCsvFromAoA(aoa){
  const escapeCell = (cell)=>{
    const s = (cell === null || cell === undefined) ? '' : String(cell);
    const escaped = s.replace(/"/g,'""');
    return (escaped.indexOf(',') >= 0 || escaped.indexOf('"') >= 0) ? "\""+escaped+"\"" : escaped;
  };
  return aoa.map(row => row.map(escapeCell).join(',')).join('\n');
}

function exportInventoryToXlsx(){
  if(typeof XLSX === 'undefined'){
    alert('Excel export is not available (XLSX library not loaded).');
    return;
  }

  const aoa = buildInventoryAoA();
  if(!aoa.length){
    alert('No inventory data to export.');
    return;
  }

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // ===== MERGES (Same as webpage) =====
  ws['!merges'] = ws['!merges'] || [];
  ws['!merges'].push({ s:{r:0,c:0}, e:{r:1,c:0} });
  ws['!merges'].push({ s:{r:0,c:1}, e:{r:1,c:1} });
  ws['!merges'].push({ s:{r:0,c:2}, e:{r:1,c:2} });
  ws['!merges'].push({ s:{r:0,c:3},  e:{r:0,c:9}  });  // BOX QUANTITY
  ws['!merges'].push({ s:{r:0,c:10}, e:{r:0,c:16} });  // WAREHOUSE
  ws['!merges'].push({ s:{r:0,c:17}, e:{r:0,c:23} });  // INWARD
  ws['!merges'].push({ s:{r:0,c:24}, e:{r:0,c:30} });  // OUTWARD
  ws['!merges'].push({ s:{r:0,c:31}, e:{r:0,c:37} });  // DAMAGE

  // ===== COLORING (Matches webpage CSS) =====
  const range = XLSX.utils.decode_range(ws['!ref']);

  for(let R = 0; R <= range.e.r; ++R){
    for(let C = 0; C <= range.e.c; ++C){

      const cellAddr = XLSX.utils.encode_cell({r:R, c:C});
      if(!ws[cellAddr]) ws[cellAddr] = {};
      ws[cellAddr].s = ws[cellAddr].s || {};

      // BOX QUANTITY (4–10 → C=3–9)
      if(C >= 3 && C <= 9){
        ws[cellAddr].s.fill = { fgColor: { rgb: "D9ECFF" } };
      }

      // WAREHOUSE STOCK (11–17 → C=10–16)
      if(C >= 10 && C <= 16){
        ws[cellAddr].s.fill = { fgColor: { rgb: "FFF7C2" } };
      }

      // INWARD (18–24 → C=17–23)
      if(C >= 17 && C <= 23){
        ws[cellAddr].s.fill = { fgColor: { rgb: "F599D6" } };
      }

      // OUTWARD (25–31 → C=24–30)
      if(C >= 24 && C <= 30){
        ws[cellAddr].s.fill = { fgColor: { rgb: "A5B6F6" } };
      }

      // DAMAGE (32–38 → C=31–37)
      if(C >= 31 && C <= 37){
        ws[cellAddr].s.fill = { fgColor: { rgb: "F4CCCC" } };
      }
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventory');

  // IMPORTANT: enable cellStyles
  const wbout = XLSX.write(wb, { bookType:'xlsx', type:'array', cellStyles:true });

  const blob = new Blob([wbout], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inventory_chart.xlsx';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 200);
}

function exportInventoryToCsv(){
  const aoa = buildInventoryAoA();
  if(!aoa.length){
    alert('No inventory data to export.');
    return;
  }
  const csv = buildCsvFromAoA(aoa);
  downloadFile('inventory_chart.csv', csv, 'text/csv;charset=utf-8;');
}


// Print stays as before
function printInventoryTable(){
  const outer = document.getElementById('invTableOuter');
  if(!outer){
    alert('Inventory table not found.');
    return;
  }
  const html = outer.innerHTML;
  const popup = window.open('','_blank','width=900,height=700');
  popup.document.write(`<html><head><title>Print Inventory</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;margin:12px;}
    table{border-collapse:collapse;width:100%;}
    th,td{border:1px solid #333;padding:4px 6px;font-size:10pt;text-align:center;white-space:nowrap;}
    thead th{background:#dedede;}
  </style>
  </head><body><h3>INVENTORY CHART</h3>${html}</body></html>`);
  popup.document.close();
  setTimeout(()=>popup.print(),300);
}



  
/* wire-up Inventory Chart export / print buttons */
document.addEventListener('click', (e)=>{
  const target = e.target;
  if(!target) return;
  const id = target.id;
  if(id === 'btnExcelInv'){
    try{ exportInventoryToXlsx(); }catch(err){ console.error(err); alert('Excel export failed.'); }
  } else if(id === 'btnCsvInv'){
    try{ exportInventoryToCsv(); }catch(err){ console.error(err); alert('CSV export failed.'); }
  } else if(id === 'btnPrintInv'){
    try{ printInventoryTable(); }catch(err){ console.error(err); alert('Print view failed.'); }
  }
});

/* keep keyboard numeric enforcement for inventory inputs (extra guard) */
document.querySelectorAll('.inv-input').forEach(inp=>{
  inp.addEventListener('keypress', (e)=>{
    const ch = String.fromCharCode(e.which);
    if(!/[\d]/.test(ch)) e.preventDefault();
  });
});

/* Ensure horizontal scroll is visible: focus the outer on page show to reveal scrollbar if needed */
const invOuter = document.getElementById('invTableOuter');
document.getElementById('tileInventory').addEventListener('click', ()=>{ setTimeout(()=>invOuter.scrollLeft=0,100); });

document.getElementById('oem_addSame').addEventListener('click', ()=>{
  // create the same extra block using the shared factory for consistency
  const b = createGenericExtra(false,false,'oem_same');
  // adjust the small buttons to OEM wording
  const top = b.querySelector('.extra-top-right');
  if(top){
    const cbtn = top.querySelector('.clear-btn');
    const rbtn = top.querySelector('.remove-btn');
    if(cbtn) cbtn.textContent = 'CLEAR';
    if(rbtn) rbtn.textContent = 'REMOVE';
  }
  document.getElementById('oem_extraSameContainer').appendChild(b);
  b.scrollIntoView({behavior:'smooth', block:'center'});
});



// --- Add Inventory Refresh button next to Export buttons (orange button, white text)
// This creates a button with id 'btnRefreshInv' and inserts it near existing CSV/Print/Excel buttons if present.
(function(){
  function createRefreshButton(){
    if(document.getElementById('btnRefreshInv')) return;
    const btn = document.createElement('button');
    btn.id = 'btnRefreshInv';
    btn.type = 'button';
    btn.textContent = 'Refresh';
    btn.style.background = '#ff8a1a'; // orange
    btn.style.color = '#ffffff';
    btn.style.border = 'none';
    btn.style.padding = '6px 10px';
    btn.style.marginRight = '8px';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    // find an export buttons container by checking known buttons and inserting before them
    const ref = document.getElementById('btnCsvInv') || document.getElementById('btnPrintInv') || document.getElementById('btnExcelInv');
    if(ref && ref.parentNode){
      ref.parentNode.insertBefore(btn, ref);
    } else {
      // fallback: append to body near invTableOuter if available
      const outer = document.getElementById('invTableOuter');
      if(outer && outer.parentNode){
        const wrap = document.createElement('div');
        wrap.style.marginBottom = '8px';
        wrap.appendChild(btn);
        outer.parentNode.insertBefore(wrap, outer);
      } else {
        document.body.appendChild(btn);
      }
    }

    btn.addEventListener('click', async function(){

  if(!confirm('This will reset all Inward and Outward values to zero in the database. Continue?')) return;

  // Ask for password after confirmation
  const pwd = prompt('Enter password to continue:');

  if(pwd === null) return; // user pressed cancel

  if(pwd !== 'HOLISOL@321'){
    alert('Wrong password! Action cancelled.');
    return;
  }

  try{
    const res = await fetch('https://holisol.onrender.com/api/inventory/refresh', { 
      method: 'POST', 
      headers: { 'Content-Type':'application/json' } 
    });

    const j = await res.json();

    if(!res.ok && !j.ok){ 
      alert('Refresh failed: ' + (j && j.error ? j.error : res.statusText)); 
      return; 
    }

    // Update UI: set inputs in INWARD (cols 17-23) and OUTWARD (24-30) to zero
    const tbody = document.getElementById('invTbody');

    if(tbody){
      for(let r=0;r<tbody.rows.length;r++){
        const row = tbody.rows[r];
        for(let c=17;c<=30;c++){
          const cell = row.cells[c];
          if(!cell) continue;

          const inp = cell.querySelector('input');
          if(inp){
            inp.value = '0';
            inp.dispatchEvent(new Event('input',{bubbles:true}));
            inp.dispatchEvent(new Event('change',{bubbles:true}));
          }
        }
      }
    }

    alert('Inward and Outward columns have been reset to zero.');

  }catch(err){
    console.error(err);
    alert('Refresh failed: ' + String(err));
  }
});

  }

  // create when DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', createRefreshButton);
  } else {
    createRefreshButton();
  }
})();

const stockTile = document.getElementById("stockTransferTile");
const stockView = document.getElementById("stockTransferView");

if (stockTile && stockView) {
  stockTile.addEventListener("click", () => {

    // Hide all views
    document.querySelectorAll(".panel.view").forEach(v => {
      v.classList.add("hidden");
      v.setAttribute("aria-hidden", "true");
    });

    // Show Stock Transfer
    stockView.classList.remove("hidden");
    stockView.setAttribute("aria-hidden", "false");

  });
}


// Transfer History menu
document.getElementById('menuTransferHistory').addEventListener('click', () => {
  hideAllViews();
  document.getElementById('stockTransferHistoryView').classList.remove('hidden');
  setActiveMenu('menuTransferHistory');
});
// SHORTAGE SUMMARY TILE
const shortageSummaryTile = document.getElementById("shortageSummaryTile");
const shortageSummaryView = document.getElementById("shortageSummaryView");

if (shortageSummaryTile && shortageSummaryView) {
  shortageSummaryTile.addEventListener("click", () => {
    hideAllViews();
    shortageSummaryView.classList.remove("hidden");
    shortageSummaryView.setAttribute("aria-hidden", "false");
  });
}

// Shortage Summary - SHORTAGE TABLE
document.querySelector('.ss-orange-btn')?.addEventListener('click', async () => {
  const fromSource = document.getElementById('ss_from')?.value;
  let url = '';

if (fromSource.toUpperCase() === 'INWARD HISTORY') {
  url = 'https://holisol.onrender.com/api/inventory/inward-summary';
} else if (fromSource.toUpperCase() === 'OEM INWARD HISTORY') {
  url = 'https://holisol.onrender.com/api/inventory/oem-inward-summary';
} else {
  alert("Please select a valid FROM option");
  return;
}

  const fromDate = document.getElementById('ss_date_from').value;
  const toDate = document.getElementById('ss_date_to').value;
  const customer = document.getElementById('ss_customer').value;
  const oem = document.getElementById('ss_oem').value;
  const part = document.getElementById('ss_part').value;

  if (!fromDate || !toDate) {
    alert("Please select Receive Date From and To");
    return;
  }

  const spinner = document.getElementById('ssSpinner');
  if (spinner) spinner.style.display = "inline-block";

  try {
    const res = await fetch(
  `${url}?from=${fromDate}&to=${toDate}&customer=${customer}&oem=${oem}&partName=${part}`
);
    const data = await res.json();

    if (spinner) spinner.style.display = "none";

    if (!data.ok) {
      alert("No inward data found for selected filters");
      return;
    }

    const t = data.total;

    const row = `
  <tr>
    <td>${fromDate}</td>
    <td>${toDate}</td>
    <td>${customer}</td>
    <td>${oem}</td>
    <td>${part}</td>
    <td>${t.pallet}</td>
    <td>${t.sleeve}</td>
    <td>${t.lid}</td>
    <td>${t.inserts}</td>
    <td>${t.separator}</td>
    <td>${t.crates}</td>
    <td>${t.dummy}</td>
    <td>${data.sets || 0}</td>
    <td>${data.shortages?.pallet || 0}</td>
    <td>${data.shortages?.sleeve || 0}</td>
    <td>${data.shortages?.lid || 0}</td>
    <td>${data.shortages?.inserts || 0}</td>
    <td>${data.shortages?.separator || 0}</td>
    <td>${data.shortages?.crates || 0}</td>
    <td>${data.shortages?.dummy || 0}</td>
  </tr>
`;

    const table = document.getElementById("ssTable");
    if (!table) {
      console.error("Shortage Summary table not found");
      return;
    }

    // Remove old rows (keep headers)
    table.querySelectorAll("tr").forEach((tr, i) => {
      if (i > 1) tr.remove();
    });

    // Insert row safely
    table.insertAdjacentHTML("beforeend", row);

  } catch (err) {
    if (spinner) spinner.style.display = "none";
    console.error(err);
    alert("Server error while fetching summary");
  }
});


// Shortage Summary - Clear Filter
document.getElementById('ss_clear')?.addEventListener('click', () => {
  document.getElementById('ss_from').value = '';
  document.getElementById('ss_date_from').value = '';
  document.getElementById('ss_date_to').value = '';
  document.getElementById('ss_customer').value = '';
  document.getElementById('ss_oem').value = '';
  document.getElementById('ss_part').value = '';

  const table = document.getElementById('ssTable');
  if (table) {
    table.querySelectorAll("tr").forEach((tr, i) => {
      if (i > 1) tr.remove();
    });
  }
});
// ===============================
// SHORTAGE SUMMARY EXPORT 
// ===============================
document.addEventListener("DOMContentLoaded", function () {

  const excelBtn = document.getElementById("btnExcelSS");
  const csvBtn   = document.getElementById("btnCsvSS");
  const table    = document.querySelector("#shortageSummaryView table");

  if (!table) return;

  if (excelBtn) {
    excelBtn.addEventListener("click", function () {
      exportTableToExcel(table, "Shortage_Summary.xlsx");
    });
  }

  if (csvBtn) {
    csvBtn.addEventListener("click", function () {
      exportTableToCSV(table, "Shortage_Summary.csv");
    });
  }

});

document.getElementById('co_clearFilter')?.addEventListener('click', () => {

  document.getElementById('co_dispatchDate').value = '';
  document.getElementById('co_invoiceNo').value = '';
  document.getElementById('co_vehicleNo').value = '';

  document.getElementById('co_locationSel').selectedIndex = 0;
  document.getElementById('co_customerSel').selectedIndex = 0;
  document.getElementById('co_oemSel').selectedIndex = 0;
  document.getElementById('co_partSel').selectedIndex = 0;

  document.querySelectorAll('#createOutwardView .small-box')
    .forEach(i => i.value = '');

  document.getElementById('co_extraSameContainer').innerHTML = '';
  document.getElementById('co_extraDiffContainer').innerHTML = '';
});
document.getElementById('ci_clearFilter')?.addEventListener('click', () => {

  document.getElementById('ci_dispatchDate').value = '';
  document.getElementById('ci_invoiceNo').value = '';
  document.getElementById('ci_vehicleNo').value = '';

  document.getElementById('ci_locationSel').selectedIndex = 0;
  document.getElementById('ci_customerSel').selectedIndex = 0;
  document.getElementById('ci_oemSel').selectedIndex = 0;
  document.getElementById('ci_partSel').selectedIndex = 0;

  document.querySelectorAll('#createInwardView .small-box')
    .forEach(i => i.value = '');

  document.getElementById('ci_extraSameContainer').innerHTML = '';
  document.getElementById('ci_extraDiffContainer').innerHTML = '';
  document.getElementById('ci_extraDiffOemContainer').innerHTML = '';
});
document.getElementById('oem_clearFilter')?.addEventListener('click', () => {

  document.getElementById('oem_dispatchDate').value = '';
  document.getElementById('oem_invoiceNo').value = '';
  document.getElementById('oem_vehicleNo').value = '';

  document.getElementById('oem_locationSel').selectedIndex = 0;
  document.getElementById('oem_customerSel').selectedIndex = 0;
  document.getElementById('oem_oemSel').selectedIndex = 0;
  document.getElementById('oem_partSel').selectedIndex = 0;

  document.querySelectorAll('#createOemView .small-box')
    .forEach(i => i.value = '');

  document.getElementById('oem_extraSameContainer').innerHTML = '';
  document.getElementById('oem_extraDiffContainer').innerHTML = '';
});


document.addEventListener("DOMContentLoaded", function () {

  const partsTile = document.getElementById("partssizeTile");

  partsTile.addEventListener("click", function () {

    // hide all other views
    document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));

    // show Parts Size view
    const partsView = document.getElementById("partsSizeView");
    partsView.classList.remove("hidden");
    partsView.setAttribute("aria-hidden", "false");

    // load table
    loadExcelData();
  });

});

let tableData = [];

function loadExcelData() {
  fetch("assets/inventory_chart.xlsx")
    .then(response => response.arrayBuffer())
    .then(data => {
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      tableData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      buildTable(tableData);
    })
    .catch(() => alert("Excel file not found in assets folder"));
}

function buildTable(data) {
  const table = document.getElementById("excelTable");
  table.innerHTML = "";

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headerRow = data[0];

  /* ======================
     FILTER ROW (thead)
  ====================== */
  const filterRow = document.createElement("tr");

  headerRow.forEach(() => {
    const th = document.createElement("th");
    const input = document.createElement("input");

    input.placeholder = "Filter";
    input.addEventListener("keyup", filterTable);

    th.appendChild(input);
    filterRow.appendChild(th);
  });

  thead.appendChild(filterRow);

  /* ======================
     HEADER ROW (thead)
  ====================== */
  const headerTr = document.createElement("tr");

  headerRow.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerTr.appendChild(th);
  });

  thead.appendChild(headerTr);

  /* ======================
     DATA ROWS (tbody)
  ====================== */
  for (let i = 1; i < data.length; i++) {
    const tr = document.createElement("tr");

    data[i].forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell || "";
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
}

/* ======================
   FILTER FUNCTION
====================== */
function filterTable() {
  const table = document.getElementById("excelTable");

  const filterInputs = table.querySelectorAll("thead tr:first-child input");
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach(row => {
    let showRow = true;
    const cells = row.querySelectorAll("td");

    filterInputs.forEach((input, index) => {
      const filterValue = input.value.toLowerCase().trim();
      const cellText = (cells[index]?.textContent || "").toLowerCase();

      if (filterValue) {
        const keywords = filterValue.split(" ");
        for (let word of keywords) {
          if (!cellText.includes(word)) {
            showRow = false;
            break;
          }
        }
      }
    });

    row.style.display = showRow ? "" : "none";
  });
}
document.getElementById("clearFilterset").addEventListener("click", () => {
  // 🔹 Clear result section
  document.getElementById("result").innerHTML = "";

  // 🔹 Reset dropdown to SELECT
  const dropdown = document.getElementById("partNameDropdown");
  dropdown.selectedIndex = 0; // SELECT option

  // 🔹 Optional: scroll back to top of panel
  dropdown.blur();
});


async function loadParts() {
  const res = await fetch(`${API_BASE_URL}/api/inventory`);
  const data = await res.json();

  const dropdown = document.getElementById("partNameDropdown");
  dropdown.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "SELECT";
  defaultOption.selected = true;
  defaultOption.disabled = true;
  dropdown.appendChild(defaultOption);

  data
    .sort((a, b) => a.partName.localeCompare(b.partName))
    .forEach(item => {
    const option = document.createElement("option");
    option.value = item.partName;
    option.textContent = item.partName;
    dropdown.appendChild(option);
  });
}

async function analyze() {
  const partName = document.getElementById("partNameDropdown").value;
  const resultDiv = document.getElementById("result");
  const loadingDiv = document.getElementById("loading");

  if (!partName) {
    alert("Please select a Part Name");
    return;
  }

  resultDiv.innerHTML = "";
  loadingDiv.style.display = "block";

  const url = `${API_BASE_URL}/api/set-availability/analyze/${encodeURIComponent(partName)}`;
  console.log("📡 Fetching URL:", url);

  try {
    const res = await fetch(url);

    console.log("📥 Response status:", res.status);
    console.log("📥 Response ok:", res.ok);

    const text = await res.text();   // 👈 IMPORTANT
    console.log("📥 Raw response:", text);

    if (!res.ok) {
      throw new Error("API error");
    }

    const data = JSON.parse(text);   // 👈 parse manually

    let html = `
      <h3>PARTNAME: ${data.partName}</h3>
      <p><b>Max Dispatchable:</b><span class="highlight-sets">${data.maxDispatchableSets} Sets</span></p>
      <p><b>Limiting Factors:</b> ${data.limitingFactors.join(", ")}</p>
    `;

    // 🔴 SHORTAGE DETAILS
if (data.shortages && data.shortages.length > 0) {
  html += `<div class="shortage-box">
    <h4>Shortage Details</h4>`;
    
  data.shortages.forEach(s => {
    html += `
      <p>
        <b>${s.component}</b> →
        Available: ${s.available}, Required: ${s.required}, <span class="shortage-text">Shortage: ${s.shortage}</span>
      </p>
    `;
  });

  html += `</div>`;
}

// 🔁 TRANSFER SUGGESTIONS
if (data.transfers && data.transfers.length > 0) {
  html += `<div class="transfer-box">
    <h4>Suggested Transfers</h4>`;

  data.transfers.forEach(t => {
    html += `<p>${t.component} → from <b>${t.fromPart}</b> → Available (${t.quantity})</p>`;
  });

  html += `</div>`;
}


    resultDiv.innerHTML = html;

  } catch (err) {
    console.error("❌ Analyze failed:", err);
    resultDiv.innerHTML = `
      <p style="color:red;">
        Error fetching availability.<br>
        Check console for details.
      </p>
    `;
  } finally {
    loadingDiv.style.display = "none";
  }
}

loadParts();

