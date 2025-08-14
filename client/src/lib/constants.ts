// Status colors
export const STATUS_COLORS = {
  safe: {
    text: "text-[#66BB6A]",
    bg: "bg-[#66BB6A]",
    border: "border-[#66BB6A]",
    bgLight: "bg-[#66BB6A]/10",
    textHex: "#66BB6A",
    bgHex: "#66BB6A"
  },
  warning: {
    text: "text-[#FFA000]",
    bg: "bg-[#FFA000]",
    border: "border-[#FFA000]",
    bgLight: "bg-[#FFA000]/10",
    textHex: "#FFA000",
    bgHex: "#FFA000"
  },
  alert: {
    text: "text-[#E53935]",
    bg: "bg-[#E53935]",
    border: "border-[#E53935]",
    bgLight: "bg-[#E53935]/10",
    textHex: "#E53935",
    bgHex: "#E53935"
  },
  offline: {
    text: "text-[#BDBDBD]",
    bg: "bg-[#BDBDBD]",
    border: "border-[#BDBDBD]",
    bgLight: "bg-[#BDBDBD]/10",
    textHex: "#BDBDBD",
    bgHex: "#BDBDBD"
  }
};

// Brand colors
export const BRAND_COLORS = {
  primary: {
    bg: "bg-[#6A1B9A]",
    text: "text-[#6A1B9A]",
    hover: "hover:bg-[#6A1B9A]/90",
    textHex: "#6A1B9A",
    bgHex: "#6A1B9A"
  },
  accent: {
    bg: "bg-[#9C27B0]",
    text: "text-[#9C27B0]",
    hover: "hover:bg-[#9C27B0]/90",
    textHex: "#9C27B0",
    bgHex: "#9C27B0"
  },
  background: {
    bg: "bg-[#FAFAFA]",
    bgHex: "#FAFAFA"
  },
  cardBg: {
    bg: "bg-[#FFFFFF]",
    bgHex: "#FFFFFF"
  },
  textPrimary: {
    text: "text-[#212121]",
    textHex: "#212121"
  },
  textSecondary: {
    text: "text-[#616161]",
    textHex: "#616161"
  }
};



// Temperature ranges
export const TEMPERATURE_RANGES = {
  internal: {
    min: 36.0,
    max: 37.5,
    alertMin: 35.5,
    alertMax: 38.5
  },
  surface: {
    min: 35.5,
    max: 37.0,
    alertMin: 35.0,
    alertMax: 37.5
  }
};

// Vibration thresholds (in m/s²) - based on real data
export const VIBRATION_THRESHOLDS = {
  normal: 0.3,  // 0.0-0.3: Stable (minimal vibration)
  warning: 0.5, // 0.3-0.5: Moderate vibration 
  alert: 0.8    // >0.5: High/excessive vibration
};

// Battery thresholds
export const BATTERY_THRESHOLDS = {
  warning: 30,
  alert: 20
};

// Rooms with bed specifications
export const ROOMS = [
  { value: "all", label: "All Rooms" },
  { value: "NICU-A", label: "NICU-A (Beds 1-6)" },
  { value: "NICU-B", label: "NICU-B (Beds 7-12)" },
  { value: "NICU-C", label: "NICU-C (Beds 13-18)" },
  { value: "Transport", label: "Transport" }
];

// Room beds mapping
export const ROOM_BEDS = {
  "NICU-A": ["Bed 1", "Bed 2", "Bed 3", "Bed 4", "Bed 5", "Bed 6"],
  "NICU-B": ["Bed 7", "Bed 8", "Bed 9", "Bed 10", "Bed 11", "Bed 12"],
  "NICU-C": ["Bed 13", "Bed 14", "Bed 15", "Bed 16", "Bed 17", "Bed 18"],
  "Transport": ["Mobile"]
};

// Status options
export const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "normal", label: "Normal" },
  { value: "warning", label: "Warning" },
  { value: "alert", label: "Alert" },
  { value: "offline", label: "Offline" }
];

// Maintenance statuses
export const MAINTENANCE_STATUS = {
  upToDate: "up-to-date",
  due: "due-soon",
  overdue: "overdue"
};

// Recorded vibration measurements (from real data)
export const VIBRATION_MEASUREMENTS = [
  { timestamp: "00:02:40", average: 0.2, max: 1.0, aMax: 0.34 },
  { timestamp: "00:02:49", average: 0.2, max: 1.0, aMax: 0.43 },
  { timestamp: "00:04:47", average: 0.2, max: 1.1, aMax: 0.50 },
  { timestamp: "00:04:52", average: 0.2, max: 1.1, aMax: 0.21 },
  { timestamp: "00:05:03", average: 0.2, max: 1.1, aMax: 0.29 },
  { timestamp: "00:05:11", average: 0.2, max: 1.1, aMax: 0.36 },
  { timestamp: "00:05:26", average: 0.2, max: 1.1, aMax: 0.48 },
  { timestamp: "00:05:39", average: 0.2, max: 1.3, aMax: 0.55 },
  { timestamp: "00:05:45", average: 0.2, max: 1.3, aMax: 0.31 },
  { timestamp: "00:05:51", average: 0.2, max: 1.3, aMax: 0.43 },
  { timestamp: "00:05:59", average: 0.2, max: 1.3, aMax: 0.19 },
  { timestamp: "00:06:07", average: 0.2, max: 1.3, aMax: 0.25 }
];

// Instrumental intensity scale for vibration (from real data)
export const VIBRATION_INTENSITY_SCALE = [
  { level: "I", description: "Detectable only by instruments." },
  { level: "II-III", description: "Very slight vibration felt by only some people." },
  { level: "IV-V", description: "Feeling moderate shaking." },
  { level: "VI-VII", description: "Strong and very strong shock. Explicit destruction." },
  { level: "VIII", description: "Sudden shocks. Widespread destruction." },
  { level: "IX-X", description: "Change the configuration of land, landslides, and cracks." }
];
