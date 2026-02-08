module.exports = [
  {
    partName: "TURBO CHARGER T6",
    commonWith: {},
    unique: [
      "pallet",
      "sleeve",
      "lid",
      "inserts",
      "separator"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "TURBO CHARGER 1603",
    commonWith: {
      pallet: [
        "TURBO CHARGER HR 10",
        "FLANGE"
      ],
      separator: [
        "TURBO CHARGER HR 10"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "sleeve",
      "lid",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "TURBO CHARGER HR 10",
    commonWith: {
      pallet: [
        "TURBO CHARGER 1603",
        "FLANGE"
      ],
      separator: [
        "TURBO CHARGER 1603"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "sleeve",
      "lid",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "TURBO CHARGER VW",
    commonWith: {},
    unique: [
      "pallet",
      "inserts",
      "separator",
      "dummy"
    ],
    notRequired: [
      "sleeve",
      "lid",
      "crates"
    ]
  },
  {
    partName: "TML KITE",
    commonWith: {
      pallet: [
        "YRA BLACK",
        "YL1",
        "YR9"
      ],
      sleeve: [
        "YRA BLACK",
        "YL1",
        "YR9"
      ],
      lid: [
        "YRA BLACK",
        "YL1",
        "YR9"
      ],
      separator: [
        "YXA GREEN",
        "DV5-1B5"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "YG8",
    commonWith: {
      pallet: [
        "YXA GREEN"
      ],
      lid: [
        "YXA GREEN"
      ]
    },
    unique: [
      "sleeve",
      "inserts"
    ],
    notRequired: [
      "separator",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "YRA BLACK",
    commonWith: {
      pallet: [
        "TML KITE",
        "YL1",
        "YR9"
      ],
      sleeve: [
        "TML KITE",
        "YL1",
        "YR9"
      ],
      lid: [
        "TML KITE",
        "YL1",
        "YR9"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "separator",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "YL1",
    commonWith: {
      pallet: [
        "TML KITE",
        "YRA BLACK",
        "YR9"
      ],
      sleeve: [
        "TML KITE",
        "YRA BLACK",
        "YR9"
      ],
      lid: [
        "TML KITE",
        "YRA BLACK",
        "YR9"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "separator",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "YR9",
    commonWith: {
      pallet: [
        "TML KITE",
        "YRA BLACK",
        "YL1"
      ],
      sleeve: [
        "TML KITE",
        "YRA BLACK",
        "YL1"
      ],
      lid: [
        "TML KITE",
        "YRA BLACK",
        "YL1"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "separator",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "YXA GREEN",
    commonWith: {
      pallet: [
        "YG8"
      ],
      lid: [
        "YG8"
      ],
      separator: [
        "TML KITE",
        "DV5-1B5"
      ]
    },
    unique: [
      "sleeve",
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "DV5-1B5",
    commonWith: {
      separator: [
        "TML KITE",
        "YXA GREEN"
      ]
    },
    unique: [
      "pallet",
      "sleeve",
      "lid",
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "RADIATOR",
    commonWith: {
      pallet: [
        "COMBO COLLER",
        "FRONT",
        "REAR",
        "HEATER"
      ],
      sleeve: [
        "COMBO COLLER",
        "FRONT",
        "REAR",
        "HEATER"
      ],
      lid: [
        "COMBO COLLER",
        "FRONT",
        "REAR",
        "HEATER"
      ],
      separator: [
        "COMBO COLLER",
        "FRONT",
        "REAR",
        "HEATER",
        "BOTTOM YOKE",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "COMBO COLLER",
    commonWith: {
      pallet: [
        "RADIATOR",
        "FRONT",
        "REAR",
        "HEATER"
      ],
      sleeve: [
        "RADIATOR",
        "FRONT",
        "REAR",
        "HEATER"
      ],
      lid: [
        "RADIATOR",
        "FRONT",
        "REAR",
        "HEATER"
      ],
      separator: [
        "RADIATOR",
        "FRONT",
        "REAR",
        "HEATER",
        "BOTTOM YOKE",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "FRONT",
    commonWith: {
      pallet: [
        "RADIATOR",
        "COMBO COLLER",
        "REAR",
        "HEATER"
      ],
      sleeve: [
        "RADIATOR",
        "COMBO COLLER",
        "REAR",
        "HEATER"
      ],
      lid: [
        "RADIATOR",
        "COMBO COLLER",
        "REAR",
        "HEATER"
      ],
      separator: [
        "RADIATOR",
        "COMBO COLLER",
        "REAR",
        "HEATER",
        "BOTTOM YOKE",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "REAR",
    commonWith: {
      pallet: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "HEATER"
      ],
      sleeve: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "HEATER"
      ],
      lid: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "HEATER"
      ],
      separator: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "HEATER",
        "BOTTOM YOKE",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "HEATER",
    commonWith: {
      pallet: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "REAR"
      ],
      sleeve: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "REAR"
      ],
      lid: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "REAR"
      ],
      separator: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "REAR",
        "BOTTOM YOKE",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ]
    },
    unique: [
      "inserts",
      "dummy"
    ],
    notRequired: [
      "crates"
    ]
  },
  {
    partName: "CYLINDER 9914",
    commonWith: {
      pallet: [
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      sleeve: [
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      lid: [
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      separator: [
        "CYLINDER 8626",
        "CYLINDER 9653",
        "JACK ASSEMBLY"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "CYLINDER 8626",
    commonWith: {
      pallet: [
        "CYLINDER 9914",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      sleeve: [
        "CYLINDER 9914",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      lid: [
        "CYLINDER 9914",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      separator: [
        "CYLINDER 9914",
        "CYLINDER 9653",
        "JACK ASSEMBLY"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "CYLINDER 9653",
    commonWith: {
      pallet: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      sleeve: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      lid: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      separator: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "JACK ASSEMBLY"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "CYLINDER GREEN",
    commonWith: {
      pallet: [
        "CYLINDER ORANGE",
        "CYLINDER BLUE",
        "CYLINDER GRAY"
      ]
    },
    unique: [],
    notRequired: [
      "sleeve",
      "lid",
      "inserts",
      "separator",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "CYLINDER ORANGE",
    commonWith: {
      pallet: [
        "CYLINDER GREEN",
        "CYLINDER BLUE",
        "CYLINDER GRAY"
      ]
    },
    unique: [],
    notRequired: [
      "sleeve",
      "lid",
      "inserts",
      "separator",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "CYLINDER BLUE",
    commonWith: {
      pallet: [
        "CYLINDER GREEN",
        "CYLINDER ORANGE",
        "CYLINDER GRAY"
      ]
    },
    unique: [],
    notRequired: [
      "sleeve",
      "lid",
      "inserts",
      "separator",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "CYLINDER GRAY",
    commonWith: {
      pallet: [
        "CYLINDER GREEN",
        "CYLINDER ORANGE",
        "CYLINDER BLUE"
      ]
    },
    unique: [],
    notRequired: [
      "sleeve",
      "lid",
      "inserts",
      "separator",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "EXCUVATOR BLUE",
    commonWith: {},
    unique: [
      "pallet"
    ],
    notRequired: [
      "sleeve",
      "lid",
      "inserts",
      "separator",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "CYLINDERS BIG",
    commonWith: {},
    unique: [
      "pallet"
    ],
    notRequired: [
      "sleeve",
      "lid",
      "inserts",
      "separator",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "CYLINDERS SMALL",
    commonWith: {},
    unique: [
      "pallet"
    ],
    notRequired: [
      "sleeve",
      "lid",
      "inserts",
      "separator",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "X104",
    commonWith: {
      pallet: [
        "1SS",
        "NSS",
        "TATA CURVE",
        "NSS_1"
      ],
      sleeve: [
        "1SS",
        "NSS",
        "TATA CURVE",
        "NSS_1"
      ],
      lid: [
        "1SS",
        "NSS",
        "TATA CURVE",
       "NSS_1"
      ],
      separator: [
        "1SS",
        "NSS",
        "TATA CURVE",
        "NSS_1"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "1SS",
    commonWith: {
      pallet: [
        "X104",
        "NSS",
        "TATA CURVE",
       "NSS_1"
      ],
      sleeve: [
        "X104",
        "NSS",
        "TATA CURVE",
       "NSS_1"
      ],
      lid: [
        "X104",
        "NSS",
        "TATA CURVE",
        "NSS_1"
      ],
      separator: [
        "X104",
        "NSS",
        "TATA CURVE",
        "NSS_1"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "NSS",
    commonWith: {
      pallet: [
        "X104",
        "1SS",
        "TATA CURVE",
        "NSS_1"
      ],
      sleeve: [
        "X104",
        "1SS",
        "TATA CURVE",
        "NSS_1"
      ],
      lid: [
        "X104",
        "1SS",
        "TATA CURVE",
        "NSS_1"
      ],
      separator: [
        "X104",
        "1SS",
        "TATA CURVE",
        "NSS_1"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "TATA CURVE",
    commonWith: {
      pallet: [
        "X104",
        "1SS",
        "NSS",
        "NSS_1"
      ],
      sleeve: [
        "X104",
        "1SS",
        "NSS",
       "NSS_1"
      ],
      lid: [
        "X104",
        "1SS",
        "NSS",
        "NSS_1"
      ],
      separator: [
        "X104",
        "1SS",
        "NSS",
       "NSS_1"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "NSS_1",
    commonWith: {
      pallet: [
        "X104",
        "1SS",
        "TATA CURVE",
        "NSS"
      ],
      sleeve: [
        "X104",
        "1SS",
        "TATA CURVE",
        "NSS"
        
      ],
      lid: [
        "X104",
        "1SS",
        "TATA CURVE",
        "NSS"
      ],
      separator: [
        "X104",
        "1SS",
        "TATA CURVE",
        "NSS"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "BOTTOM YOKE",
    commonWith: {
      separator: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "REAR",
        "HEATER",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ]
    },
    unique: [
      "pallet",
      "sleeve",
      "lid",
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "CRANK SHAFT",
    commonWith: {
      pallet: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      sleeve: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      lid: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      separator: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "REAR",
        "HEATER",
        "BOTTOM YOKE",
        "BALANCER SHAFT",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "BALANCER SHAFT",
    commonWith: {
      pallet: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      sleeve: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      lid: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      separator: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "REAR",
        "HEATER",
        "BOTTOM YOKE",
        "CRANK SHAFT",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "THROTTLE BODY",
    commonWith: {
      pallet: [
        "THROTTLE BODY HMI"
      ],
      lid: [
        "THROTTLE BODY HMI"
      ]
    },
    unique: [
      "inserts",
      "separator",
      "crates"
    ],
    notRequired: [
      "sleeve"
    ]
  },
  {
    partName: "FORGED CRANK SHAFT",
    commonWith: {},
    unique: [
      "pallet",
      "separator"
    ],
    notRequired: [
      "sleeve",
      "lid",
      "inserts",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "JACK ASSEMBLY",
    commonWith: {
      pallet: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      sleeve: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      lid: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      separator: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653"
      ]
    },
    unique: [],
    notRequired: [
      "inserts",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "IN/OUT SHAFT",
    commonWith: {},
    unique: [
      "pallet",
      "lid",
      "inserts",
      "separator",
      "dummy"
    ],
    notRequired: [
      "sleeve",
      "crates"
    ]
  },
  {
    partName: "THROTTLE BODY HMI",
    commonWith: {
      pallet: [
        "THROTTLE BODY"
      ],
      lid: [
        "THROTTLE BODY"
      ]
    },
    unique: [
      "crates"
    ],
    notRequired: [
      "sleeve",
      "inserts",
      "separator"
    ]
  },
  {
    partName: "CAM SHAFT",
    commonWith: {},
    unique: [
      "pallet",
      "sleeve",
      "lid",
      "inserts"
    ],
    notRequired: [
      "separator",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "FLANGE",
    commonWith: {
      pallet: [
        "TURBO CHARGER 1603",
        "TURBO CHARGER HR 10"
      ],
      separator: [
        "STOP PLATES"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "sleeve",
      "lid",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "TOOLS BRACKETS",
    commonWith: {},
    unique: [],
    notRequired: [
      "pallet",
      "sleeve",
      "lid",
      "inserts",
      "separator",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "STOP PLATES",
    commonWith: {
      separator: [
        "FLANGE"
      ]
    },
    unique: [
      "pallet"
    ],
    notRequired: [
      "sleeve",
      "lid",
      "inserts",
      "crates",
      "dummy"
    ]
  },
  {
    partName: "ASS AIR FILTER",
    commonWith: {
      pallet: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      sleeve: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      lid: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      separator: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "REAR",
        "HEATER",
        "BOTTOM YOKE",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "DAD ASS AIR FILTER",
    commonWith: {
      pallet: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      sleeve: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      lid: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ],
      separator: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "REAR",
        "HEATER",
        "BOTTOM YOKE",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "ASS AIR FILTER",
        "PSA C21 ASS AIR",
        "DAD C21 ASS AIR"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "PSA C21 ASS AIR",
    commonWith: {
      pallet: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "DAD C21 ASS AIR"
      ],
      sleeve: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "DAD C21 ASS AIR"
      ],
      lid: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "DAD C21 ASS AIR"
      ],
      separator: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "REAR",
        "HEATER",
        "BOTTOM YOKE",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "DAD C21 ASS AIR"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  },
  {
    partName: "DAD C21 ASS AIR",
    commonWith: {
      pallet: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR"
      ],
      sleeve: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR"
      ],
      lid: [
        "CYLINDER 9914",
        "CYLINDER 8626",
        "CYLINDER 9653",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "JACK ASSEMBLY",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR"
      ],
      separator: [
        "RADIATOR",
        "COMBO COLLER",
        "FRONT",
        "REAR",
        "HEATER",
        "BOTTOM YOKE",
        "CRANK SHAFT",
        "BALANCER SHAFT",
        "ASS AIR FILTER",
        "DAD ASS AIR FILTER",
        "PSA C21 ASS AIR"
      ]
    },
    unique: [
      "inserts"
    ],
    notRequired: [
      "crates",
      "dummy"
    ]
  }
];
