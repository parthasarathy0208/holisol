// ========================================
// LOAD CUSTOMER → OEM → PART DROPDOWNS
// ========================================

const sizeKeys = [
    "pallet",
    "sleeve",
    "lid",
    "inserts",
    "separator",
    "crates",
    "dummy"
];

function createSevenInputs(containerId, prefix, disabled = true) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    sizeKeys.forEach(key => {
        const input = document.createElement("input");
        input.type = "number";
        input.id = `${prefix}_${key}`;
        input.placeholder = key;
        if (disabled) input.disabled = true;

        container.appendChild(input);
    });
}




let editInventoryData = [];

async function loadEditDropdowns() {
    try {
        const res = await fetch('/api/inventory');
        const data = await res.json();

        editInventoryData = data.docs || data;

        fillCustomers();

    } catch (err) {
        console.error("Inventory load failed", err);
    }
}


// ---------------- CUSTOMER ----------------
function fillCustomers() {
    const sel = document.getElementById("edit_customer");

    const customers = [...new Set(
        editInventoryData.map(r => r.customer)
    )].sort();

    sel.innerHTML = `<option value="">Select Customer</option>`;

    customers.forEach(c => {
        sel.innerHTML += `<option value="${c}">${c}</option>`;
    });
}


// ---------------- OEM ----------------
function fillOems(customer) {
    const sel = document.getElementById("edit_oem");

    const oems = [...new Set(
        editInventoryData
            .filter(r => r.customer === customer)
            .map(r => r.oem)
    )].sort();

    sel.innerHTML = `<option value="">Select OEM</option>`;

    oems.forEach(o => {
        sel.innerHTML += `<option value="${o}">${o}</option>`;
    });

    document.getElementById("edit_part").innerHTML =
        `<option value="">Select Part</option>`;
}


// ---------------- PART ----------------
function fillParts(customer, oem) {
    const sel = document.getElementById("edit_part");

    const parts = [...new Set(
        editInventoryData
            .filter(r => r.customer === customer && r.oem === oem)
            .map(r => r.partName)
    )].sort();

    sel.innerHTML = `<option value="">Select Part</option>`;

    parts.forEach(p => {
        sel.innerHTML += `<option value="${p}">${p}</option>`;
    });
}


// ---------------- EVENTS ----------------
document.addEventListener("DOMContentLoaded", () => {

    loadEditDropdowns();
    createSevenInputs("edit_boxQty", "edit_box", true);
    createSevenInputs("edit_whStock", "edit_wh", true);

    document.getElementById("edit_customer")
        .addEventListener("change", function () {
            fillOems(this.value);
        });

    document.getElementById("edit_oem")
        .addEventListener("change", function () {
            const cust = document.getElementById("edit_customer").value;
            fillParts(cust, this.value);
        });

});


// ========================================
// LOAD BUTTON → FETCH RECORD
// ========================================

let currentRecordId = null;

document.getElementById("loadRecordBtn")
    .addEventListener("click", () => {

        const customer = document.getElementById("edit_customer").value;
        const oem = document.getElementById("edit_oem").value;
        const part = document.getElementById("edit_part").value;

        if (!customer || !oem || !part) {
            alert("Select Customer, OEM, Part");
            return;
        }

        const record = editInventoryData.find(r =>
            r.customer === customer &&
            r.oem === oem &&
            r.partName === part
        );

        if (!record) {
            alert("Record not found");
            return;
        }

        currentRecordId = record._id;
        document.getElementById("edit_customer_text").value = record.customer ?? "";
        document.getElementById("edit_oem_text").value = record.oem ?? "";
        document.getElementById("edit_part_text").value = record.partName ?? "";

        const oemInput = document.getElementById("edit_oemOrder");
        const itemInput = document.getElementById("edit_itemOrder");

        /* enable temporarily so browser paints value */
        oemInput.disabled = false;
        itemInput.disabled = false;

        /* set values */
        oemInput.value = record.oemOrder ?? 0;
        itemInput.value = record.itemOrder ?? 0;

        /* disable again (view mode) */
        oemInput.disabled = true;
        itemInput.disabled = true;


        // Fill Box Quantity
        sizeKeys.forEach(k => {
            document.getElementById(`edit_box_${k}`).value =
                record.boxQuantity?.[k] ?? 0;
        });

        // Fill Warehouse Stock
        sizeKeys.forEach(k => {
            document.getElementById(`edit_wh_${k}`).value =
                record.warehouseStock?.[k] ?? 0;
        });

    });
// ========================================
// ENABLE EDIT
// ========================================

document.getElementById("enableEditBtn")
    .addEventListener("click", () => {

        document.getElementById("edit_customer_text").disabled = false;
        document.getElementById("edit_oem_text").disabled = false;
        document.getElementById("edit_part_text").disabled = false;

        document.getElementById("edit_oemOrder").disabled = false;
        document.getElementById("edit_itemOrder").disabled = false;

        sizeKeys.forEach(k => {
            document.getElementById(`edit_box_${k}`).disabled = false;
            document.getElementById(`edit_wh_${k}`).disabled = false;
        });

    });
// ========================================
// UPDATE RECORD
// ========================================

document.getElementById("updateBtn")
    .addEventListener("click", async () => {

        if (!currentRecordId) {
            alert("Load record first");
            return;
        }

        const payload = {

            // 🔹 UPDATED TEXT FIELDS (important)
            customer: document.getElementById("edit_customer_text").value.trim(),
            oem: document.getElementById("edit_oem_text").value.trim(),
            partName: document.getElementById("edit_part_text").value.trim(),

            // 🔹 ORDERS
            oemOrder: Number(document.getElementById("edit_oemOrder").value || 0),
            itemOrder: Number(document.getElementById("edit_itemOrder").value || 0),

            // 🔹 QUANTITIES
            boxQuantity: {},
            warehouseStock: {}
        };


        sizeKeys.forEach(k => {
            payload.boxQuantity[k] =
                Number(document.getElementById(`edit_box_${k}`).value || 0);

            payload.warehouseStock[k] =
                Number(document.getElementById(`edit_wh_${k}`).value || 0);
        });

        const res = await fetch(`/api/inventory/update/${currentRecordId}`, {
            method: "PUT",

            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Updated Successfully");
            resetEditForm();
            loadEditDropdowns(); // refresh cache
        } else {
            alert("Update Failed");
        }

    });
// ========================================
// DELETE RECORD
// ========================================
// ========================================
// DELETE RECORD
// ========================================
document.getElementById("deleteBtn")
.addEventListener("click", async () => {

    // 🔐 Ask Delete Password First
    const entered = prompt("Enter Delete Authorization Password:");

    if (entered !== "HOLISOL@DELETE") {
        alert("❌ Incorrect Password! Delete Blocked.");
        return; // STOP DELETE
    }

    // Continue only if password correct
    if (!currentRecordId) {
        alert("Load record first");
        return;
    }

    if (!confirm("Confirm permanently delete?")) return;

    try {

        const res = await fetch(`/api/inventory/delete/${currentRecordId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();

        if (data.ok) {
            alert("Record Deleted Successfully ✅");
            resetEditForm();
            await loadEditDropdowns();
        } else {
            alert("Delete Failed From Server");
        }

    } catch (err) {
        console.error(err);
        alert("Server Error During Delete");
    }

});

// ========================================
// CREATE NEW RECORD
// ========================================

document.getElementById("createBtn")
    .addEventListener("click", async () => {

        const payload = {
            customer: document.getElementById("new_customer").value.trim(),
            oem: document.getElementById("new_oem").value.trim(),
            partName: document.getElementById("new_part").value.trim(),
            oemOrder: Number(document.getElementById("new_oemOrder").value || 0),
            itemOrder: Number(document.getElementById("new_itemOrder").value || 0)
        };

        if (!payload.customer || !payload.oem || !payload.partName) {
            alert("Enter Customer / OEM / Part Name");
            return;
        }

        const res = await fetch("/api/inventory/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (data.ok) {
            alert("New Flow Created ✅");

            clearNewFlowForm();      // ← ADD THIS
            loadEditDropdowns();

            document.getElementById("existingTab").click();
        }
        else {
            alert("Create Failed");
        }
    });


// ========================================
// TAB SWITCHING (EXISTING ↔ NEW FLOW)
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const existingTab = document.getElementById("existingTab");
    const newTab = document.getElementById("newTab");

    const existingSection = document.getElementById("existingSection");
    const newSection = document.getElementById("newSection");

    existingTab.addEventListener("click", () => {
        existingSection.style.display = "block";
        newSection.style.display = "none";

        existingTab.classList.add("active-tab");
        newTab.classList.remove("active-tab");
    });

    newTab.addEventListener("click", () => {
        existingSection.style.display = "none";
        newSection.style.display = "block";

        newTab.classList.add("active-tab");
        existingTab.classList.remove("active-tab");
    });

});

