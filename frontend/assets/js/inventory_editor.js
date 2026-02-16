const API = "/api/inventory";

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
  ["pallet","sleeve","lid","inserts","separator","crates","dummy"]
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
  ["pallet","sleeve","lid","inserts","separator","crates","dummy"]
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
function resetEditForm() {

    currentRecordId = null;

    // Clear dropdowns
    document.getElementById("edit_customer").value = "";
    document.getElementById("edit_oem").innerHTML = `<option value="">Select OEM</option>`;
    document.getElementById("edit_part").innerHTML = `<option value="">Select Part</option>`;

    // Clear editable text fields
    document.getElementById("edit_customer_text").value = "";
    document.getElementById("edit_oem_text").value = "";
    document.getElementById("edit_part_text").value = "";

    // Clear orders
    document.getElementById("edit_oemOrder").value = "";
    document.getElementById("edit_itemOrder").value = "";

    // Disable again (view mode)
    document.getElementById("edit_customer_text").disabled = true;
    document.getElementById("edit_oem_text").disabled = true;
    document.getElementById("edit_part_text").disabled = true;
    document.getElementById("edit_oemOrder").disabled = true;
    document.getElementById("edit_itemOrder").disabled = true;

    // Clear 7 inputs
    sizeKeys.forEach(k => {
        document.getElementById(`edit_box_${k}`).value = "";
        document.getElementById(`edit_wh_${k}`).value = "";

        document.getElementById(`edit_box_${k}`).disabled = true;
        document.getElementById(`edit_wh_${k}`).disabled = true;
    });
}
document.getElementById("clearFilterBtn")
    .addEventListener("click", () => {
        resetEditForm();
    });
function clearNewFlowForm(){
    document.getElementById("new_customer").value = "";
    document.getElementById("new_oem").value = "";
    document.getElementById("new_part").value = "";
    document.getElementById("new_oemOrder").value = "";
    document.getElementById("new_itemOrder").value = "";
}
document.getElementById("newClearBtn")
  .addEventListener("click", clearNewFlowForm);
