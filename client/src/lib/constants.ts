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

// Vibration thresholds
export const VIBRATION_THRESHOLDS = {
  normal: 0.3,
  warning: 0.5,
  alert: 0.8
};

// Battery thresholds
export const BATTERY_THRESHOLDS = {
  warning: 30,
  alert: 20
};

// Rooms
export const ROOMS = [
  { value: "all", label: "All Rooms" },
  { value: "NICU-A", label: "NICU-A" },
  { value: "NICU-B", label: "NICU-B" },
  { value: "NICU-C", label: "NICU-C" },
  { value: "Transport", label: "Transport" }
];

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
