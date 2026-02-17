// utils/buildPartMapping.js

async function buildPartMapping(selectedPart, Inventory) {
  const components = ["pallet", "sleeve", "lid", "inserts", "separator", "crates", "dummy"];

  const allParts = await Inventory.find({});

  let mapping = {
    unique: [],
    commonWith: {},
    notRequired: []
  };

  for (let comp of components) {

    const selectedSize = selectedPart.partSize?.[comp];

    // 🔴 NOT REQUIRED
    if (!selectedSize || selectedSize === "NIL") {
      mapping.notRequired.push(comp);
      continue;
    }

    // 🟡 Find other parts using SAME SIZE
    const sameUsers = allParts.filter(p =>
      p.partName !== selectedPart.partName &&
      p.partSize?.[comp] === selectedSize
    );

    if (sameUsers.length === 0) {
      // 🟢 UNIQUE component
      mapping.unique.push(comp);
    } else {
      // 🔵 COMMON component
      mapping.commonWith[comp] = sameUsers.map(p => p.partName);
    }
  }

  return mapping;
}

module.exports = buildPartMapping;
