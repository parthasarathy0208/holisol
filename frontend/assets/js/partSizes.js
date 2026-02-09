

const partSizes = {
  "TURBO CHARGER T6": {
    "Pallet": "HLPL/PSB/1200*1000*1070",
    "Sleeve": "HLPL/PSB/1200*1000*1070",
    "Lid": "HLPL/PSB/1200*1000*1070",
    "Inserts": "HLPL/INSVFTRAYS/1120*455*310",
    "Separator": "HLPL/HDPE-SEP/1133*930*30",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "TURBO CHARGER 1603": {
    "Pallet": "HLPL/FLC/1200*1000*970",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "HLPL/INS/1095*895*250",
    "Separator": "HLPL/HDPE-SEP/1100*900*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "TURBO CHARGER HR 10": {
    "Pallet": "HLPL/FLC/1200*1000*970",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "HLPL/INS/1095*895*257",
    "Separator": "HLPL/HDPE-SEP/1100*900*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "TURBO CHARGER VW": {
    "Pallet": "HLPL/FLC/1200*1000*975",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "TEL_VW/TURBO CHARGER/INS/1115*915*217",
    "Separator": "HLPL/BG-SEP/1130*930*8",
    "Crates": "NIL",
    "Dummy": "TEL_VW/TURBO CHARGER/DUMMY-INS/1115*915*109"
  },
  "TML KITE": {
    "Pallet": "NIL",
    "Sleeve": "HLPL/PSB/1445*1150*1070",
    "Lid": "HLPL/PSB/1445*1150*1070",
    "Inserts": "HLPL/INS/1350*1040*115",
    "Separator": "HLPL/SEP/1360*1060*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "YG8": {
    "Pallet": "HLPL/PAL/1450*1125*150",
    "Sleeve": "HLPL/SLEEVE/1450*1125*1020",
    "Lid": "HLPL/LID/1450*1125*50",
    "Inserts": "HLPL/INS-VFTRAYS/YG8/1360*1050*110",
    "Separator": "NIL",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "YRA BLACK": {
    "Pallet": "HLPL/PSB/1445*1150*1070",
    "Sleeve": "HLPL/PSB/1445*1150*1070",
    "Lid": "HLPL/PSB/1445*1150*1070",
    "Inserts": "HLPL/INS-VFTRAYS/1360*1050*120",
    "Separator": "NIL",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "YL1": {
    "Pallet": "HLPL/PSB/1445*1150*1070",
    "Sleeve": "HLPL/PSB/1445*1150*1070",
    "Lid": "HLPL/PSB/1445*1150*1070",
    "Inserts": "HLPL/INS-VFTRAYS/YL1 (GREEN)",
    "Separator": "NIL",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "YR9": {
    "Pallet": "HLPL/PSB/1445*1150*1070",
    "Sleeve": "HLPL/PSB/1445*1150*1070",
    "Lid": "HLPL/PSB/1445*1150*1070",
    "Inserts": "HLPL/INS-VFTRAYS/YR9 (WHITE)",
    "Separator": "NIL",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "YXA GREEN": {
    "Pallet": "HLPL/PAL/1450*1125*150",
    "Sleeve": "HLPL/SLEEVE/1450*1125*990",
    "Lid": "HLPL/LID/1450*1125*50",
    "Inserts": "RANE_YXA/INS/1360*1050*112",
    "Separator": "HLPL/SEP/1360*1060*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "DV5-1B5": {
    "Pallet": "HLPL/PSB/1460*1130*1120",
    "Sleeve": "HLPL/PSB/1460*1130*1120",
    "Lid": "HLPL/PSB/1460*1130*1120",
    "Inserts": "HLPL/INS/1360*1060*125",
    "Separator": "HLPL/SEP/1360*1060*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "RADIATOR": {
    "Pallet": "HLPL/PSB/1200*800*1100",
    "Sleeve": "HLPL/PSB/1200*800*1100",
    "Lid": "HLPL/PSB/1200*800*1100",
    "Inserts": "HLPL/INS/1150*750*440",
    "Separator": "HLPL/SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "COMBO COLLER": {
    "Pallet": "HLPL/PSB/1200*800*1100",
    "Sleeve": "HLPL/PSB/1200*800*1100",
    "Lid": "HLPL/PSB/1200*800*1100",
    "Inserts": "HLPL/INS/1150*750*440",
    "Separator": "HLPL/SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "FRONT": {
    "Pallet": "HLPL/PSB/1200*800*1100",
    "Sleeve": "HLPL/PSB/1200*800*1100",
    "Lid": "HLPL/PSB/1200*800*1100",
    "Inserts": "HLPL/INS/1150*750*300",
    "Separator": "HLPL/SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "REAR": {
    "Pallet": "HLPL/PSB/1200*800*1100",
    "Sleeve": "HLPL/PSB/1200*800*1100",
    "Lid": "HLPL/PSB/1200*800*1100",
    "Inserts": "HLPL/INS/1150*750*175",
    "Separator": "HLPL/SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "HEATER": {
    "Pallet": "HLPL/PSB/1200*800*1100",
    "Sleeve": "HLPL/PSB/1200*800*1100",
    "Lid": "HLPL/PSB/1200*800*1100",
    "Inserts": "HLPL/INS/1150*750*185",
    "Separator": "HLPL/SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "HLPL/INS/1150*750*135"
  },
  "CYLINDER 9914": {
    "Pallet": "HLPL/PAL/1200*800*150",
    "Sleeve": "HLPL/SLEEVE/1200*800*820",
    "Lid": "HLPL/LID/1200*800*50",
    "Inserts": "HLPL/INS/1150*750*102",
    "Separator": "HLPL/HDPE-SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "CYLINDER 8626": {
    "Pallet": "HLPL/PAL/1200*800*150",
    "Sleeve": "HLPL/SLEEVE/1200*800*820",
    "Lid": "HLPL/LID/1200*800*50",
    "Inserts": "HLPL/INS/1150*750*98",
    "Separator": "HLPL/HDPE-SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "CYLINDER 9653": {
    "Pallet": "HLPL/PAL/1200*800*150",
    "Sleeve": "HLPL/SLEEVE/1200*800*820",
    "Lid": "HLPL/LID/1200*800*50",
    "Inserts": "HLPL/INS/1150*750*89",
    "Separator": "HLPL/HDPE-SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "CYLINDER GREEN": {
    "Pallet": "HLPL/PAL/1200*1030*420",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "NIL",
    "Separator": "NIL",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "CYLINDER ORANGE": {
    "Pallet": "HLPL/PAL/1200*1030*420",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "NIL",
    "Separator": "NIL",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "CYLINDER BLUE": {
    "Pallet": "HLPL/PAL/1200*1030*420",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "NIL",
    "Separator": "NIL",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "CYLINDER GRAY": {
    "Pallet": "HLPL/PAL/1200*1030*420",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "NIL",
    "Separator": "NIL",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "EXCUVATOR BLUE": {
    "Pallet": "HLPL/PAL/1880*1250*442",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "NIL",
    "Separator": "NIL",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "CYLINDERS BIG": {
    "Pallet": "HLPL/PAL/1030*920*725",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "NIL",
    "Separator": "NIL",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "CYLINDERS SMALL": {
    "Pallet": "HLPL/PAL/855*920*675",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "NIL",
    "Separator": "NIL",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "X104": {
    "Pallet": "HLPL/PSB/SONA_BLW/1200*800*970",
    "Sleeve": "HLPL/PSB/SONA_BLW/1200*800*970",
    "Lid": "HLPL/PSB/SONA_BLW/1200*800*970",
    "Inserts": "HLPL/INS/1150*750*105(18P)",
    "Separator": "HLPL/SEP/SONA_BLW/1155*755*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "1SS": {
    "Pallet": "HLPL/PSB/SONA_BLW/1200*800*970",
    "Sleeve": "HLPL/PSB/SONA_BLW/1200*800*970",
    "Lid": "HLPL/PSB/SONA_BLW/1200*800*970",
    "Inserts": "HLPL/INS/1150*750*150(25P)",
    "Separator": "HLPL/SEP/SONA_BLW/1155*755*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "NSS": {
    "Pallet": "HLPL/PSB/SONA_BLW/1200*800*970",
    "Sleeve": "HLPL/PSB/SONA_BLW/1200*800*970",
    "Lid": "HLPL/PSB/SONA_BLW/1200*800*970",
    "Inserts": "HLPL/INS/1150*750*150(28P)",
    "Separator": "HLPL/SEP/SONA_BLW/1155*755*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "TATA CURVE": {
    "Pallet": "HLPL/PSB/SONA_BLW/1200*800*970",
    "Sleeve": "HLPL/PSB/SONA_BLW/1200*800*970",
    "Lid": "HLPL/PSB/SONA_BLW/1200*800*970",
    "Inserts": "SonaBLW_TML/INS/1150*750*123",
    "Separator": "HLPL/SEP/SONA_BLW/1155*755*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "BOTTOM YOKE": {
    "Pallet": "HLPL/PSB/1200*800*180",
    "Sleeve": "HLPL/PSB/1200*800*180",
    "Lid": "HLPL/PSB/1200*800*180",
    "Inserts": "HLPL/INS/1150*750*107",
    "Separator": "HLPL/SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "CRANK SHAFT": {
    "Pallet": "HLPL/PAL/1200*800*150",
    "Sleeve": "HLPL/SLEEVE/1200*800*820",
    "Lid": "HLPL/LID/1200*800*50",
    "Inserts": "HLPL/INS/1150*750*121",
    "Separator": "HLPL/SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "BALANCER SHAFT": {
    "Pallet": "HLPL/PAL/1200*800*150",
    "Sleeve": "HLPL/SLEEVE/1200*800*820",
    "Lid": "HLPL/LID/1200*800*50",
    "Inserts": "HLPL/INS-VFTRAY/575*375*95",
    "Separator": "HLPL/SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "THROTTLE BODY": {
    "Pallet": "HLPL/PAL/1200*1000*160",
    "Sleeve": "NIL",
    "Lid": "HLPL/LID/1200*1000*100",
    "Inserts": "HLPL/INS/550*350*110",
    "Separator": "HLPL/SEP/550*350*10",
    "Crates": "HLPL/CRA/600*400*160",
    "Dummy": "NIL"
  },
  "FORGED CRANK SHAFT": {
    "Pallet": "HLPL/HMPC/1175*925*1084",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "NIL",
    "Separator": "HLPL/HDPE-SEP/1020*880*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "JACK ASSEMBLY": {
    "Pallet": "HLPL/PAL/1200*800*150",
    "Sleeve": "HLPL/SLEEVE/1200*800*820",
    "Lid": "HLPL/LID/1200*800*50",
    "Inserts": "NIL",
    "Separator": "HLPL/HDPE-SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "IN/OUT SHAFT": {
    "Pallet": "HLPL/HMPC/1325*1060*1105",
    "Sleeve": "NIL",
    "Lid": "HLPL/LID/1325*1060*20",
    "Inserts": "HLPL/INS/1175*905*325",
    "Separator": "HLPL/SEP/1175*915*5",
    "Crates": "NIL",
    "Dummy": "HLPL/DUMMY-INS/1175*905*230"
  },
  "THROTTLE BODY HMI": {
    "Pallet": "HLPL/PAL/1200*1000*160",
    "Sleeve": "NIL",
    "Lid": "HLPL/LID/1200*1000*100",
    "Inserts": "NIL",
    "Separator": "NIL",
    "Crates": "HLPL/IN-CRA/600*400*120(Blue)",
    "Dummy": "NIL"
  },
  "CAM SHAFT": {
    "Pallet": "HLPL/PSB/1200*800*750",
    "Sleeve": "HLPL/PSB/1200*800*750",
    "Lid": "HLPL/PSB/1200*800*750",
    "Inserts": "HLPL/INS-VFTRAYS/730*550*65",
    "Separator": "NIL",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "FLANGE": {
    "Pallet": "HLPL/FLC/1200*1000*970",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "HLPL/INS/1100*900*108",
    "Separator": "HLPL/HDPE-SEP/1100*900*3",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "TOOLS BRACKETS": {
    "Pallet": "NIL",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "NIL",
    "Separator": "NIL",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "STOP PLATES": {
    "Pallet": "HLPL/FSC/1200*1000*590",
    "Sleeve": "NIL",
    "Lid": "NIL",
    "Inserts": "NIL",
    "Separator": "HLPL/HDPE-SEP/1100*900*3",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "ASS AIR FILTER": {
    "Pallet": "HLPL/PAL/1200*800*150",
    "Sleeve": "HLPL/SLEEVE/1200*800*820",
    "Lid": "HLPL/LID/1200*800*50",
    "Inserts": "LUMAX/9844462180/INS/1150*750*80",
    "Separator": "HLPL/SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "DAD ASS AIR FILTER": {
    "Pallet": "HLPL/PAL/1200*800*150",
    "Sleeve": "HLPL/SLEEVE/1200*800*820",
    "Lid": "HLPL/LID/1200*800*50",
    "Inserts": "LUMAX/DAD 9843749180/INS/1150*750*85",
    "Separator": "HLPL/SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "PSA C21 ASS AIR": {
    "Pallet": "HLPL/PAL/1200*800*150",
    "Sleeve": "HLPL/SLEEVE/1200*800*820",
    "Lid": "HLPL/LID/1200*800*50",
    "Inserts": "Lumax_PCA/9837135180-PSA-CC21Assy/INS/1150*750*275",
    "Separator": "HLPL/SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  },
  "DAD C21 ASS AIR": {
    "Pallet": "HLPL/PAL/1200*800*150",
    "Sleeve": "HLPL/SLEEVE/1200*800*820",
    "Lid": "HLPL/LID/1200*800*50",
    "Inserts": "Lumax_PCA/987882380-DAD-CC21Assy/INS/1150*750*148",
    "Separator": "HLPL/SEP/1150*750*5",
    "Crates": "NIL",
    "Dummy": "NIL"
  }
};
