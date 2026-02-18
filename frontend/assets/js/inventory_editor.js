const API = "https://holisol.onrender.com/api/inventory";

/* ---------- LOAD EXISTING ---------- */
async function loadExisting() {
  const customer = document.getElementById("edit_customer").value;
  const oem = document.getElementById("edit_oem").value;
  const part = document.getElementById("edit_part").value;

  const res = await fetch(`${API}/one?customer=${customer}&oem=${oem}&partName=${part}`);
  const data = await res.json();

  if (!data.ok) {
    alert("Record not found");
    return;
  }

  window.currentDoc = data.doc;

  document.getElementById("edit_oemOrder").value = data.doc.oemOrder;
  document.getElementById("edit_itemOrder").value = data.doc.itemOrder;

  fill7("box", data.doc.boxQuantity);
  fill7("wh", data.doc.warehouseStock);
}

function fill7(prefix, obj) {
  ["pallet", "sleeve", "lid", "inserts", "separator", "crates", "dummy"]
    .forEach(k => {
      document.getElementById(`${prefix}_${k}`).value = obj[k] || 0;
    });
}

/* ---------- ENABLE EDIT ---------- */
function enableEdit() {
  document.querySelectorAll("#existingForm input")
    .forEach(i => i.disabled = false);
}

/* ---------- UPDATE ---------- */
async function updateRecord() {
  const id = window.currentDoc._id;

  const payload = {
    oemOrder: document.getElementById("edit_oemOrder").value,
    itemOrder: document.getElementById("edit_itemOrder").value,
    boxQuantity: collect7("box"),
    warehouseStock: collect7("wh")
  };

  await fetch(`${API}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  alert("Updated Successfully");
}

function collect7(prefix) {
  const o = {};
  ["pallet", "sleeve", "lid", "inserts", "separator", "crates", "dummy"]
    .forEach(k => o[k] = Number(document.getElementById(`${prefix}_${k}`).value || 0));
  return o;
}

/* ---------- DELETE ---------- */
async function deleteRecord() {
  const id = window.currentDoc._id;

  if (!confirm("Delete this record?")) return;

  await fetch(`${API}/delete/${id}`, { method: "DELETE" });
  alert("Deleted");
}

/* ---------- CREATE NEW ---------- */
async function createNew() {
  const payload = {
    customer: document.getElementById("new_customer").value,
    oem: document.getElementById("new_oem").value,
    partName: document.getElementById("new_part").value,
    oemOrder: document.getElementById("new_oemOrder").value,
    itemOrder: document.getElementById("new_itemOrder").value
  };

  await fetch(`${API}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  alert("Created Successfully");
}

function clearSevenInputs(prefix) {
    sizeKeys.forEach(k => {
        const el = document.getElementById(`${prefix}_${k}`);
        if (el) {
            el.value = "";          // clear value
            el.defaultValue = "";   // clear browser cache
        }
    });
}

function resetEditForm() {

  currentRecordId = null;
  window.currentDoc = null;

  // 🔹 Clear dropdowns
  document.getElementById("edit_customer").value = "";
  document.getElementById("edit_oem").innerHTML = `<option value="">Select OEM</option>`;
  document.getElementById("edit_part").innerHTML = `<option value="">Select Part</option>`;

  // 🔹 Clear text/order fields
  ["edit_customer_text", "edit_oem_text", "edit_part_text","edit_loopQty",
    "edit_oemOrder", "edit_itemOrder"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.value = "";
        el.disabled = true;
      }
    });

  // ✅ VERY IMPORTANT — clear values BEFORE rebuild
  clearSevenInputs("edit_ps");
  clearSevenInputs("edit_pw"); 
  clearSevenInputs("edit_box");
  clearSevenInputs("edit_wh");

  // 🔹 Remove DOM nodes completely
  document.getElementById("edit_partSize").replaceChildren();
  document.getElementById("edit_partWeight").replaceChildren();
  document.getElementById("edit_boxQty").replaceChildren();
  document.getElementById("edit_whStock").replaceChildren();

  // 🔹 Rebuild fresh inputs
  createSevenInputs("edit_partSize", "edit_ps", true, "text");
  createSevenInputs("edit_partWeight", "edit_pw", true, "text");
  createSevenInputs("edit_boxQty", "edit_box", true, "number");
  createSevenInputs("edit_whStock", "edit_wh", true, "number");
}


document.getElementById("clearFilterBtn")
  .addEventListener("click", () => {
    resetEditForm();
  });
function clearNewFlowForm() {
  document.getElementById("new_customer").value = "";
  document.getElementById("new_oem").value = "";
  document.getElementById("new_part").value = "";
  document.getElementById("new_oemOrder").value = "";
  document.getElementById("new_itemOrder").value = "";
}
document.getElementById("newClearBtn")
  .addEventListener("click", clearNewFlowForm);
