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
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Base frame */}
      <rect x="10" y="55" width="80" height="25" rx="3" fill={colors.base} stroke="#424242" strokeWidth="1.5" />
      
      {/* Bed legs and wheels */}
      <circle cx="20" cy="83" r="3" fill="#757575" />
      <circle cx="80" cy="83" r="3" fill="#757575" />
      <rect x="17" y="80" width="6" height="3" fill="#9E9E9E" />
      <rect x="77" y="80" width="6" height="3" fill="#9E9E9E" />
      
      {/* Bed platform */}
      <rect x="13" y="48" width="74" height="8" rx="2" fill="white" stroke="#757575" strokeWidth="1" />
      
      {/* Mattress */}
      <rect x="15" y="45" width="70" height="5" rx="2" fill={colors.mattress} stroke="#9E9E9E" strokeWidth="0.8" />
      
      {/* Pillow */}
      <rect x="18" y="40" width="15" height="5" rx="2" fill={colors.pillow} stroke="#BDBDBD" strokeWidth="0.6" />
      
      {/* Blanket */}
      <path d="M33 45 H76 Q78 45 80 48 V51 H33 V45 Z" fill={colors.blanket} stroke="#9E9E9E" strokeWidth="0.6" />
      
      {/* Side rails (up position) */}
      <rect x="10" y="35" width="2" height="15" fill="#9E9E9E" stroke="#757575" strokeWidth="0.4" />
      <rect x="88" y="35" width="2" height="15" fill="#9E9E9E" stroke="#757575" strokeWidth="0.4" />
      <rect x="10" y="35" width="18" height="2" fill="#9E9E9E" />
      <rect x="72" y="35" width="18" height="2" fill="#9E9E9E" />
      
      {/* Bed identification panel */}
      <rect x="40" y="62" width="20" height="12" rx="2" fill="white" stroke="#616161" strokeWidth="1" />
      <text x="50" y="71" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#424242" textAnchor="middle">
        {bedNumber}
      </text>
      
      {/* Monitoring equipment and IV pole */}
      <rect x="60" y="20" width="18" height="15" rx="2" fill={colors.monitor} stroke="#616161" strokeWidth="1" />
      <line x1="63" y1="25" x2="75" y2="25" stroke="#616161" strokeWidth="1" />
      <line x1="63" y1="30" x2="72" y2="30" stroke="#616161" strokeWidth="1" />
      <line x1="69" y1="35" x2="69" y2="40" stroke="#616161" strokeWidth="1" strokeDasharray="1.5 0.5" />
      
      {/* IV pole */}
      <line x1="83" y1="15" x2="83" y2="45" stroke="#757575" strokeWidth="1.5" />
      <circle cx="83" cy="15" r="2" fill="#9E9E9E" />
      <rect x="81" y="25" width="4" height="2.5" fill="#BDBDBD" />
      
      {/* Status indicator with pulsating effect */}
      <circle cx="80" cy="62" r="4" fill={colors.accent}>
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