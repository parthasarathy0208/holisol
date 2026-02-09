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
            partSelectId: "st_from_part",
            inputs: {
                pallet: "from_pallet",
                sleeve: "from_sleeve",
                lid: "from_lid",
                inserts: "from_inserts",  
                separator: "from_separator",
                crates: "from_crates",
                dummy: "from_dummy"
            }
        }

    ];

    pageConfigs.forEach(config => {
        const partSelect = document.getElementById(config.partSelectId);
        if (!partSelect) return;

        partSelect.addEventListener("change", function () {

            const partValue = this.value;

            // 🔹 CASE 1: NO PART SELECTED → CLEAR SIZES
            if (!partValue) {
                Object.values(config.inputs).forEach(inputId => {
                    if (!inputId) return;

                    const sizeDiv = document.getElementById(
                        inputId.replace("Qty", "Size")
                    );

                    if (sizeDiv) {
                        sizeDiv.innerText = "";
                    }
                });
                return; // 👈 VERY IMPORTANT
            }

            // 🔹 CASE 2: PART SELECTED → SHOW SIZES
            const sizes = partSizes[partValue];
            if (!sizes) return;

            Object.keys(config.inputs).forEach(key => {
                const inputId = config.inputs[key];
                if (!inputId) return;

                const input = document.getElementById(inputId);
                if (!input) return;

                input.placeholder = key; // keep original label

                const sizeDiv = document.getElementById(
                    input.id.replace("Qty", "Size")
                );

                if (sizeDiv) {
                    sizeDiv.innerText = sizes[key] || "";
                }
            });
        });
    });


});
