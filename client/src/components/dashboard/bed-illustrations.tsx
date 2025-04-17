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
          monitor: "#FFCDD2"
        };
      case "warning":
        return {
          base: "#FFF8E1",
          accent: "#FFA000",
          monitor: "#FFECB3"
        };
      case "offline":
        return {
          base: "#F5F5F5",
          accent: "#BDBDBD",
          monitor: "#E0E0E0"
        };
      default: // normal
        return {
          base: "#E8F5E9",
          accent: "#66BB6A",
          monitor: "#C8E6C9"
        };
    }
  };

  const colors = getColors();

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Bed frame */}
      <rect x="10" y="40" width="100" height="30" rx="2" fill={colors.base} stroke="#616161" strokeWidth="1.5" />
      
      {/* Bed legs */}
      <line x1="20" y1="70" x2="20" y2="78" stroke="#616161" strokeWidth="1.5" />
      <line x1="100" y1="70" x2="100" y2="78" stroke="#616161" strokeWidth="1.5" />
      
      {/* Bed surface with mattress */}
      <rect x="15" y="35" width="90" height="10" rx="1" fill="white" stroke="#616161" strokeWidth="1" />
      
      {/* Pillow */}
      <rect x="20" y="37" width="20" height="6" rx="2" fill="#F3E5F5" stroke="#9E9E9E" strokeWidth="0.5" />
      
      {/* Bed number */}
      <rect x="45" y="50" width="30" height="15" rx="2" fill="white" stroke="#616161" strokeWidth="1" />
      <text x="55" y="62" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#616161" textAnchor="middle">
        {bedNumber}
      </text>
      
      {/* Status indicator */}
      <circle cx="100" cy="50" r="5" fill={colors.accent} />
      
      {/* Monitoring equipment for NICU */}
      <rect x="75" y="10" width="25" height="25" rx="2" fill={colors.monitor} stroke="#616161" strokeWidth="1" />
      <line x1="80" y1="20" x2="95" y2="20" stroke="#616161" strokeWidth="1" />
      <line x1="80" y1="25" x2="90" y2="25" stroke="#616161" strokeWidth="1" />
      <line x1="87.5" y1="35" x2="87.5" y2="40" stroke="#616161" strokeWidth="1" strokeDasharray="2 1" />
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