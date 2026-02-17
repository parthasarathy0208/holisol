const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");

// GET all part size data
router.get("/part-sizes", async (req, res) => {
  try {
    const data = await Inventory.find({})
      .select("customer oem partName partSize -_id")
      .sort({ oemOrder: 1, itemOrder: 1 });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch part sizes" });
  }
});

module.exports = router;
