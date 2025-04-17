import React from 'react';

// Base NICU Bed Illustration
export const NICUBedBase: React.FC<{ bedNumber: number; status?: string }> = ({ bedNumber, status = "normal" }) => {
  // Colors based on status
  const getColors = () => {
    switch (status) {
      case "alert":
        return {
          base: "#FFEBEE",
          accent: "#E53935",
          monitor: "#FFCDD2",
          mattress: "#FFCDD2",
          pillow: "#FFE6E6",
          blanket: "#FFCDD2"
        };
      case "warning":
        return {
          base: "#FFF8E1",
          accent: "#FFA000",
          monitor: "#FFECB3",
          mattress: "#FFF3CD",
          pillow: "#FFF8E6",
          blanket: "#FFEFD0"
        };
      case "offline":
        return {
          base: "#F5F5F5",
          accent: "#BDBDBD",
          monitor: "#E0E0E0",
          mattress: "#EEEEEE",
          pillow: "#F8F8F8",
          blanket: "#EEEEEE"
        };
      default: // normal
        return {
          base: "#E8F5E9",
          accent: "#66BB6A",
          monitor: "#C8E6C9",
          mattress: "#E0F2E1",
          pillow: "#F1F8F1",
          blanket: "#D7EBD8"
        };
    }
  };

  const colors = getColors();

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Base frame */}
      <rect x="15" y="65" width="130" height="35" rx="3" fill={colors.base} stroke="#424242" strokeWidth="2" />
      
      {/* Bed legs and wheels */}
      <circle cx="30" y="105" r="5" fill="#757575" />
      <circle cx="130" y="105" r="5" fill="#757575" />
      <rect x="25" y="100" width="10" height="5" fill="#9E9E9E" />
      <rect x="125" y="100" width="10" height="5" fill="#9E9E9E" />
      
      {/* Bed platform */}
      <rect x="20" y="55" width="120" height="12" rx="2" fill="white" stroke="#757575" strokeWidth="1.5" />
      
      {/* Mattress */}
      <rect x="25" y="50" width="110" height="8" rx="3" fill={colors.mattress} stroke="#9E9E9E" strokeWidth="1" />
      
      {/* Pillow */}
      <rect x="30" y="45" width="25" height="8" rx="3" fill={colors.pillow} stroke="#BDBDBD" strokeWidth="0.8" />
      
      {/* Blanket */}
      <path d="M50 50 H115 Q118 50 120 53 V58 H50 V50 Z" fill={colors.blanket} stroke="#9E9E9E" strokeWidth="0.8" />
      
      {/* Side rails (up position) */}
      <rect x="15" y="40" width="3" height="25" fill="#9E9E9E" stroke="#757575" strokeWidth="0.5" />
      <rect x="142" y="40" width="3" height="25" fill="#9E9E9E" stroke="#757575" strokeWidth="0.5" />
      <rect x="15" y="40" width="30" height="3" fill="#9E9E9E" />
      <rect x="115" y="40" width="30" height="3" fill="#9E9E9E" />
      
      {/* Bed identification panel */}
      <rect x="60" y="75" width="40" height="20" rx="3" fill="white" stroke="#616161" strokeWidth="1.5" />
      <text x="80" y="89" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#424242" textAnchor="middle">
        {bedNumber}
      </text>
      
      {/* Monitoring equipment and IV pole */}
      <rect x="95" y="15" width="30" height="25" rx="2" fill={colors.monitor} stroke="#616161" strokeWidth="1.5" />
      <line x1="100" y1="25" x2="120" y2="25" stroke="#616161" strokeWidth="1.5" />
      <line x1="100" y1="30" x2="115" y2="30" stroke="#616161" strokeWidth="1.5" />
      <line x1="110" y1="40" x2="110" y2="50" stroke="#616161" strokeWidth="1.5" strokeDasharray="2 1" />
      
      {/* IV pole */}
      <line x1="135" y1="15" x2="135" y2="55" stroke="#757575" strokeWidth="2" />
      <circle cx="135" y="15" r="3" fill="#9E9E9E" />
      <rect x="132" y="25" width="6" height="4" fill="#BDBDBD" />
      
      {/* Status indicator with pulsating effect */}
      <circle cx="130" cy="75" r="7" fill={colors.accent}>
        {status === "alert" && (
          <animate 
            attributeName="opacity" 
            values="1;0.5;1" 
            dur="1s" 
            repeatCount="indefinite" 
          />
        )}
      </circle>
    </svg>
  );
};

// Get NICU bed illustration based on bed number and status
export const getBedIllustration = (bed: string, status: string = "normal"): React.ReactNode => {
  const bedNumberMatch = bed.match(/\d+/);
  const bedNumber = bedNumberMatch ? parseInt(bedNumberMatch[0], 10) : 0;
  
  if (bedNumber > 0) {
    return <NICUBedBase bedNumber={bedNumber} status={status} />;
  }
  
  return null;
};

export default getBedIllustration;