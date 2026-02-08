const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const partMap = require("../utils/partCommonMap");

function getTotalTransferableStock(comp, map, Inventory) {
  const donorParts = map.commonWith[comp] || [];
  return Promise.all(
    donorParts.map(async part => {
      const inv = await Inventory.findOne({ partName: part });
      return inv ? inv.warehouseStock[comp] || 0 : 0;
    })
  ).then(values => values.reduce((a, b) => a + b, 0));
}



// ANALYZE SET AVAILABILITY
router.get("/analyze/:partName", async (req, res) => {
  console.log("🔥 SET AVAILABILITY HIT:", req.params.partName);
  try {
    const partName = req.params.partName;

    const selectedPart = await Inventory.findOne({ partName });
    if (!selectedPart) {
      return res.status(404).json({ message: "Part not found" });
    }

    const map = partMap.find(p => p.partName === partName);
    if (!map) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    const components = ["pallet", "sleeve", "lid", "inserts", "separator", "crates", "dummy"];

    let maxSets = Infinity;
    let limitingFactors = [];

    // 🔹 ALL components (unique + common, except notRequired)
    for (let comp of components) {
      if (map.notRequired.includes(comp)) continue;

      const perBox = selectedPart.boxQuantity[comp] || 0;
      if (perBox === 0) continue;

      const ownStock = selectedPart.warehouseStock[comp] || 0;

      let transferableStock = 0;

      // only common components can be transferred
      if (!map.unique.includes(comp)) {
        transferableStock = await getTotalTransferableStock(comp, map, Inventory);
      }

      const totalAvailable = ownStock + transferableStock;
      const possibleSets = Math.floor(totalAvailable / perBox);

      if (possibleSets < maxSets) {
        maxSets = possibleSets;
        limitingFactors = [comp];
      }
    }


    // 2️⃣ Check common components
    let transfers = [];
    let shortages = [];


    for (let comp of components) {
      if (
        map.notRequired.includes(comp) ||
        map.unique.includes(comp)
      ) continue;

      const required = selectedPart.boxQuantity[comp] || 0;
      const available = selectedPart.warehouseStock[comp] || 0;

      if (available < required * maxSets) {
        const totalRequired = required * maxSets;
        const shortageQty = totalRequired - available;

        shortages.push({
          component: comp,
          required: totalRequired,
          available: available,
          shortage: shortageQty
        });

        const donorParts = map.commonWith[comp] || [];
        for (let donor of donorParts) {
          const donorInv = await Inventory.findOne({ partName: donor });
          if (donorInv && donorInv.warehouseStock[comp] > 0) {
            transfers.push({
              component: comp,
              fromPart: donor,
              quantity: donorInv.warehouseStock[comp]
            });
          }
        }
      }

    }

    res.json({
      partName,
      maxDispatchableSets: maxSets,
      limitingFactors,
      shortages,
      transfers
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
