document.addEventListener("DOMContentLoaded", () => {

  const pageConfigs = [
    {
      partSelectId: "co_partSel",
      inputs: {
        Pallet: "co_palletQty",
        Sleeve: "co_sleeveQty",
        Lid: "co_lidQty",
        Inserts: "co_insertQty",
        Separator: "co_separatorQty",
        Crates: "co_cratesQty",
        Dummy: "co_dummyQty"
      }
    },
    {
      partSelectId: "ci_partSel",
      inputs: {
        Pallet: "ci_palletQty",
        Sleeve: "ci_sleeveQty",
        Lid: "ci_lidQty",
        Inserts: "ci_insertQty",
        Separator: "ci_separatorQty",
        Crates: "ci_cratesQty",
        Dummy: "ci_dummyQty"
      }
    },
    {
      partSelectId: "oem_partSel",
      inputs: {
        Pallet: "oem_palletQty",
        Sleeve: "oem_sleeveQty",
        Lid: "oem_lidQty",
        Inserts: "oem_insertQty",
        Separator: "oem_separatorQty",
        Crates: "oem_cratesQty",
        Dummy: "oem_dummyQty"
      }
    },
    {
      partSelectId: "st_part_from",
      inputs: {
        Pallet: "from_pallet",
        Sleeve: "from_sleeve",
        Lid: "from_lid",
        Inserts: "from_inserts",
        Separator: "from_separator",
        Crates: "from_crates",
        Dummy: "from_dummy"
      }
    }
  ];

  pageConfigs.forEach(config => {
    const partSelect = document.getElementById(config.partSelectId);
    if (!partSelect) return;

    partSelect.addEventListener("change", function () {
      const partValue = this.value;

      // clear sizes
      if (!partValue) {
        Object.values(config.inputs).forEach(inputId => {
          const input = document.getElementById(inputId);
          if (!input) return;

          const sizeDiv = input
            .closest(".small-input-item")
            ?.querySelector(".part-size-text");

          if (sizeDiv) sizeDiv.innerText = "";
        });
        return;
      }

      // show sizes
      const sizes = partSizes[partValue];
      if (!sizes) return;

      Object.entries(config.inputs).forEach(([key, inputId]) => {
        const input = document.getElementById(inputId);
        if (!input) return;

        const sizeDiv = input
          .closest(".small-input-item")
          ?.querySelector(".part-size-text");

        if (sizeDiv) {
          sizeDiv.innerText = sizes[key] || "";
        }
      });
    });
  });

});
