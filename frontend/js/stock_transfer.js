
// stock_transfer.js – FINAL stable bidirectional filter logic
(function () {
  let inventory = [];

  function fetchInventory() {
    return fetch('https://holisol.onrender.com/api/inventory')
      .then(r => r.json())
      .then(d => inventory = d || []);
  }

  function uniqSorted(arr) {
    return [...new Set(arr.filter(v => v !== '' && v != null))]
      .sort((a, b) => String(a).localeCompare(String(b)));
  }

  function buildOptions(select, values, placeholder, selected) {
    select.innerHTML = `<option value="">${placeholder}</option>`;
    values.forEach(v => {
      const o = document.createElement('option');
      o.value = v; o.textContent = v;
      if (v === selected) o.selected = true;
      select.appendChild(o);
    });
  }

  function setup(prefix) {
    const c = document.getElementById(`st_customer_${prefix}`);
    const o = document.getElementById(`st_oem_${prefix}`);
    const p = document.getElementById(`st_part_${prefix}`);

    function apply() {
      const cv = c.value, ov = o.value, pv = p.value;

      let f = inventory.slice();
      if (cv) f = f.filter(r => r.customer === cv);
      if (ov) f = f.filter(r => r.oem === ov);
      if (pv) f = f.filter(r => r.partName === pv);

      buildOptions(c, uniqSorted(f.map(r => r.customer)), "Select customer", cv);
      buildOptions(o, uniqSorted(f.map(r => r.oem)), "Select oem", ov);
      buildOptions(p, uniqSorted(f.map(r => r.partName)), "Select part", pv);
    }

    // initial full load
    buildOptions(c, uniqSorted(inventory.map(r => r.customer)), "Select customer");
    buildOptions(o, uniqSorted(inventory.map(r => r.oem)), "Select oem");
    buildOptions(p, uniqSorted(inventory.map(r => r.partName)), "Select part");

    c.addEventListener('change', apply);
    o.addEventListener('change', apply);
    p.addEventListener('change', apply);
  }

  function clearAll() {
    const s = document.getElementById('stockTransferView');
    s.querySelectorAll('input').forEach(i => i.value = '');
    s.querySelectorAll('select').forEach(sl => sl.value = '');
    setup('from');
    setup('to');
  }

  document.addEventListener('DOMContentLoaded', () => {
    fetchInventory().then(() => {
      setup('from');
      setup('to');
      document.getElementById('st_clear_btn')
        .addEventListener('click', clearAll);
    });
  });
})();


// STOCK TRANSFER – FINAL (ID-matched version)

document.addEventListener("DOMContentLoaded", () => {

  const submitBtn = document.querySelector(".st_submit_btn");

  if (!submitBtn) {
    console.error("Submit button not found");
    return;
  }

  submitBtn.addEventListener("click", async () => {

    const keys = [
      "pallet",
      "sleeve",
      "lid",
      "inserts",
      "separator",
      "crates",
      "dummy"
    ];

    // quantities (empty = 0)
    const quantities = {};
    keys.forEach(k => {
      quantities[k] = Number(
        document.getElementById(`from_${k}`)?.value || 0
      );
    });

    const fromDropdown = document.getElementById("st_from").value;
    const toDropdown = document.getElementById("st_to").value;

    const body = {
      fromType: fromDropdown === "WAREHOUSE STOCK"
        ? "warehouseStock"
        : "damage",

      toType: toDropdown === "WAREHOUSE STOCK"
        ? "warehouseStock"
        : "damage",

      fromLocation: fromDropdown.toUpperCase(),
      toLocation: toDropdown.toUpperCase(),

      transferDate: document.getElementById("st_transfer_date").value,

      from: {
        customer: document.getElementById("st_customer_from").value,
        oem: document.getElementById("st_oem_from").value,
        partName: document.getElementById("st_part_from").value
      },

      to: {
        customer: document.getElementById("st_customer_to").value,
        oem: document.getElementById("st_oem_to").value,
        partName: document.getElementById("st_part_to").value
      },

      quantities
    };

    console.log("STOCK TRANSFER PAYLOAD 👉", body);

    try {
      const res = await fetch("https://holisol.onrender.com/api/inventory/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Transfer failed");
        return;
      }

      alert("Stock transferred successfully ✅");
      // reset form
      resetStockTransferForm();

      // 🔄 refresh inventory chart ONLY (NO PAGE RELOAD)
      if (window.loadInventoryChart) {
        window.loadInventoryChart();
      }

    } catch (err) {
      console.error("Stock transfer error:", err);
      alert("Server error during transfer");
    }

  });

});

function resetStockTransferForm() {
  document.getElementById("st_from").value = "";
  document.getElementById("st_to").value = "";
  document.getElementById("st_transfer_date").value = "";

  document.getElementById("st_customer_from").value = "";
  document.getElementById("st_oem_from").value = "";
  document.getElementById("st_part_from").value = "";

  document.getElementById("st_customer_to").value = "";
  document.getElementById("st_oem_to").value = "";
  document.getElementById("st_part_to").value = "";

  const keys = [
    "pallet", "sleeve", "lid", "inserts", "separator", "crates", "dummy"
  ];

  keys.forEach(k => {
    const el = document.getElementById(`from_${k}`);
    if (el) el.value = "";
  });
}

// ===== Transfer History Loader =====
async function loadTransferHistory() {
  const tbody = document.getElementById("ohTbodytransfer");
  if (!tbody) return;
  tbody.innerHTML = "";
  const res = await fetch("https://holisol.onrender.com/api/inventory/transfer");
  const rows = await res.json();
  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(r.transferDate).toLocaleDateString()}</td>
      <td>${r.fromLocation||""}</td>
      <td>${r.fromCustomer||""}</td>
      <td>${r.fromOEM||""}</td>
      <td>${r.fromPartName||""}</td>
      <td>${r.toLocation||""}</td>
      <td>${r.toCustomer||""}</td>
      <td>${r.toOEM||""}</td>
      <td>${r.toPartName||""}</td>
      <td>${r.quantities?.pallet||0}</td>
      <td>${r.quantities?.sleeve||0}</td>
      <td>${r.quantities?.lid||0}</td>
      <td>${r.quantities?.inserts||0}</td>
      <td>${r.quantities?.separator||0}</td>
      <td>${r.quantities?.crates||0}</td>
      <td>${r.quantities?.dummy||0}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("menuTransferHistory")?.addEventListener("click", loadTransferHistory);
