/* ===================== BASE64 COMMAND MAP ===================== */
export const BASE64_EVENT_MAP = {
  /* Tracking */
  "IA==": { desc: "Tracking Point 20", code: "20", type: "tracking" },
  "IQ==": { desc: "Tracking Point 21", code: "21", type: "tracking" },
  "Ig==": { desc: "Tracking Point 22", code: "22", type: "tracking" },
  "Iw==": { desc: "Tracking Point 23", code: "23", type: "tracking" },
  "JA==": { desc: "Tracking Point 24", code: "24", type: "tracking" },
  "JQ==": { desc: "Tracking Point 25", code: "25", type: "tracking" },
  "Jg==": { desc: "Tracking Point 26", code: "26", type: "tracking" },
  "Jw==": { desc: "Tracking Point 27", code: "27", type: "tracking" },
  "KA==": { desc: "Tracking Point 28", code: "28", type: "tracking" },
  "KQ==": { desc: "Tracking Point 29", code: "29", type: "tracking" },
  "MA==": { desc: "Reverse Docking Location", code: "30", type: "tracking" },
  "MQ==": { desc: "Tracking Point 31", code: "31", type: "tracking" },
  "Mg==": { desc: "Tracking Point 32", code: "32", type: "tracking" },
  "Mw==": { desc: "Tracking Point 33", code: "33", type: "tracking" },
  "NA==": { desc: "Tracking Point 34", code: "34", type: "tracking" },
  "NQ==": { desc: "Tracking Point 35", code: "35", type: "tracking" },
  "Ng==": { desc: "Tracking Point 36", code: "36", type: "tracking" },
  "Nw==": { desc: "Tracking Point 37", code: "37", type: "tracking" },
  "OA==": { desc: "Tracking Point 38", code: "38", type: "tracking" },
  "OQ==": { desc: "Tracking Point 39", code: "39", type: "tracking" },
  "QA==": { desc: "Tracking Point 40", code: "40", type: "tracking" },

  /* Cleaning */
  "EQ==": { desc: "Cleaning Start", code: "11", type: "cleaning" },
  "FA==": { desc: "Cleaning Stop", code: "14", type: "cleaning" },
  "FQ==": { desc: "Return to Dock", code: "15", type: "cleaning" },
  "Fg==": { desc: "Cleaning Finish", code: "16", type: "cleaning" },

  /* Robot alerts */
  "8A==": { desc: "Brush Motor Fault", code: "F0", type: "robot_alert" },
  "8Q==": { desc: "Wheel Motor Fault", code: "F1", type: "robot_alert" },
  "/g==": { desc: "Cleaning Metrics Reset", code: "FE", type: "robot_alert" },
  "/w==": { desc: "Reset EEPROM Value", code: "FF", type: "robot_alert" },

  /* MDS */
  "UA==": { desc: "MDS returned at 1st location", code: "50", type: "mds" },
  "UQ==": { desc: "MDS returned at 2nd location", code: "51", type: "mds" },
  "AA==": { desc: "Connected to Gateway", code: "00", type: "reset" },
  "GQ==": { desc: "Ready to Clean", code: "19", type: "cleaning" },

  /* Dynamic metrics (Base64 only ones) */
  "7w==": {
    desc: "Dock battery metric (last cycle)",
    code: "EF",
    type: "metric",
    dynamic: true,
    unit: "%",
  },
};

/* ===================== ASCII METRIC PREFIX MAP ===================== */
export const ASCII_METRIC_MAP = {
  UV: {
    desc: "Battery",
    code: "UV",
    type: "battery",
    unit: "%",
  },
  TP: {
    desc: "Temperature",
    code: "TP",
    type: "metric",
    unit: "°C",
  },
  EE: {
    desc: "Battery At Reverse Station",
    code: "UV",
    type: "metric",
    unit: "%",
  },
  ED: {
    desc: "Battery Before Cleaning",
    code: "UV",
    type: "metric",
    unit: "%",
  },
  EF: {
    desc: "Battery After Cleaning",
    code: "UV",
    type: "metric",
    unit: "%",
  },
  EA: {
    desc: "Forward Cleaning Time",
    code: "UV",
    type: "metric",
    unit: " Sec",
  },
  EB: {
    desc: "Reverse Cleaning Time",
    code: "UV",
    type: "metric",
    unit: " Sec",
  },
  NM: {
    desc: "Cycle Max Brush Current",
    code: "MB",
    type: "metric",
    unit: " A",
  },
  YZ: {
    desc: "Total Partial Cleaning Cycles metric",
    code: "CM",
    type: "metric",
    unit: " sec",
  },
  EC: {
    desc: "Total Cleaning Time",
    code: "CM",
    type: "metric",
    unit: " sec",
  },
  DD: {
    desc: "Temperature Before Cleaning",
    code: "CM",
    type: "metric",
    unit: " °C",
  },
  DE: {
    desc: "Temperature At Reverse Station",
    code: "CM",
    type: "metric",
    unit: " °C",
  },
  DF: {
    desc: "Temperature After Cleaning",
    code: "CM",
    type: "metric",
    unit: " °C",
  },
  WC: {
    desc: "Cycle Average Wheel Current",
    code: "CM",
    type: "metric",
    unit: " A",
  },
  OP: {
    desc: "Cycle Max Wheel Current",
    code: "CM",
    type: "metric",
    unit: " A",
  },
  DC: {
    desc: "Cycle Count",
    code: "CM",
    type: "metric",
    unit: " NOS",
  },
  XV: {
    desc: "Firmware",
    code: "CM",
    type: "reset",
    unit: "",
  },
  JK: {
    desc: "Firmware",
    code: "CM",
    type: "reset",
    unit: "",
  },
};

/* ===================== DECODER ===================== */
export function decodeRobotPayload(base64) {
  if (!base64) {
    return unknown(base64);
  }

  /* -------- Try ASCII metric first (UV89, TP32, etc.) -------- */
  try {
    const ascii = atob(base64); // "UV89"
    /* ===== SPECIAL CASE: Firmware (XV) ===== */
    if (ascii && ascii.includes("XV")) {
      const [pcbRaw, fwRaw] = ascii.split("XV");

      return {
        base64,
        description: `Bat: 12V | Firmware : ${fwRaw} | PCB Version : ${pcbRaw}`,
        code: "XV",
        type: "reset",
        dynamic: false,
        unit: null,
      };
    }
    if (ascii && ascii.includes("JK")) {
      const [pcbRaw, fwRaw] = ascii.split("JK");

      return {
        base64,
        // description: `Firmware : ${fwRaw} | PCB Version : ${pcbRaw}`,
        description: `Bat: 24V | PCB: V${pcbRaw}  |  Firmware: V${fwRaw}`,
        code: "JK",
        type: "reset",
        dynamic: false,
        unit: null,
      };
    }

    if (/^[A-Z]{2}\d+$/.test(ascii)) {
      const prefix = ascii.slice(0, 2); // UV
      const value = Number(ascii.slice(2)); // 89

      const meta = ASCII_METRIC_MAP[prefix];
      if (meta && !Number.isNaN(value)) {
        return {
          base64,
          description: meta.desc,
          code: meta.code,
          type: meta.type,
          dynamic: true,
          unit: meta.unit,
          value,
        };
      }
    }
  } catch {
    /* ignore */
  }

  /* -------- Try direct Base64 lookup -------- */
  const entry = BASE64_EVENT_MAP[base64];
  if (entry) {
    return {
      base64,
      description: entry.desc,
      code: entry.code,
      type: entry.type,
      dynamic: Boolean(entry.dynamic),
      unit: entry.unit || null,
    };
  }

  return unknown(base64);
}

function unknown(base64) {
  return {
    base64,
    description: "Unknown payload",
    code: null,
    type: "unknown",
    dynamic: false,
    unit: null,
  };
}
