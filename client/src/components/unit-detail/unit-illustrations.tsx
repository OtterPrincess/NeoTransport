import React from 'react';

// Unit #1 Illustration - Neonatal Incubator with Advanced Monitoring
export const Unit1Illustration: React.FC = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 200 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Base frame */}
    <rect x="40" y="70" width="120" height="10" rx="2" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Wheels */}
    <circle cx="55" cy="85" r="5" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    <circle cx="145" cy="85" r="5" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Main unit body */}
    <rect x="50" y="35" width="100" height="35" rx="5" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Transparent incubator top */}
    <path d="M50 35C50 35 60 20 100 20C140 20 150 35 150 35" stroke="#6A1B9A" strokeWidth="2" strokeDasharray="2 2" />
    
    {/* Monitor screen */}
    <rect x="60" y="45" width="30" height="20" rx="2" fill="white" stroke="#6A1B9A" strokeWidth="2" />
    <line x1="65" y1="50" x2="85" y2="50" stroke="#6A1B9A" strokeWidth="1" />
    <line x1="65" y1="55" x2="80" y2="55" stroke="#6A1B9A" strokeWidth="1" />
    <line x1="65" y1="60" x2="75" y2="60" stroke="#6A1B9A" strokeWidth="1" />
    
    {/* Patient area */}
    <rect x="95" y="40" width="45" height="25" rx="3" fill="white" stroke="#6A1B9A" strokeWidth="2" />
    <ellipse cx="117.5" cy="52.5" rx="12.5" ry="7.5" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="1" />
    
    {/* Control panel */}
    <rect x="155" y="45" width="15" height="25" rx="2" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    <circle cx="162.5" cy="52.5" r="2.5" fill="#6A1B9A" />
    <circle cx="162.5" cy="62.5" r="2.5" fill="#6A1B9A" />
    
    {/* Distinctive badge */}
    <rect x="55" y="25" width="15" height="8" rx="2" fill="#6A1B9A" />
    <text x="58" y="31" fontSize="6" fill="white" fontWeight="bold">NST-1</text>
  </svg>
);

// Unit #2 Illustration - Transport Incubator with Specialized Ventilation
export const Unit2Illustration: React.FC = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 200 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Base frame with shock absorbers */}
    <rect x="45" y="75" width="110" height="8" rx="2" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="2" />
    <line x1="60" y1="75" x2="60" y2="83" stroke="#6A1B9A" strokeWidth="2" />
    <line x1="140" y1="75" x2="140" y2="83" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Wheels with suspension */}
    <circle cx="60" cy="90" r="7" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    <circle cx="140" cy="90" r="7" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    <line x1="55" y1="83" x2="65" y2="83" stroke="#6A1B9A" strokeWidth="2" />
    <line x1="135" y1="83" x2="145" y2="83" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Main unit - more angular design */}
    <rect x="50" y="30" width="100" height="45" rx="3" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Ventilation system */}
    <rect x="45" y="40" width="15" height="30" rx="2" fill="white" stroke="#6A1B9A" strokeWidth="2" />
    <circle cx="52.5" cy="50" r="5" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="1" />
    <circle cx="52.5" cy="65" r="3" fill="#6A1B9A" />
    
    {/* Patient compartment */}
    <rect x="70" y="37" width="60" height="30" rx="2" fill="white" stroke="#6A1B9A" strokeWidth="2" />
    <ellipse cx="100" cy="52" rx="15" ry="10" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="1" />
    
    {/* Advanced monitoring system */}
    <rect x="140" y="35" width="20" height="35" rx="2" fill="white" stroke="#6A1B9A" strokeWidth="2" />
    <line x1="145" y1="45" x2="155" y2="45" stroke="#6A1B9A" strokeWidth="1" />
    <line x1="145" y1="50" x2="155" y2="50" stroke="#6A1B9A" strokeWidth="1" />
    <line x1="145" y1="55" x2="155" y2="55" stroke="#6A1B9A" strokeWidth="1" />
    <circle cx="150" cy="65" r="5" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="1" />
    
    {/* Unit badge */}
    <rect x="92.5" y="20" width="15" height="8" rx="2" fill="#6A1B9A" />
    <text x="95.5" y="26" fontSize="6" fill="white" fontWeight="bold">NST-2</text>
  </svg>
);

// Unit #3 Illustration - High-Mobility Transport Unit with Integrated Systems
export const Unit3Illustration: React.FC = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 200 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Reinforced base frame */}
    <rect x="40" y="70" width="120" height="12" rx="3" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Heavy-duty wheels */}
    <circle cx="60" cy="90" r="8" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    <circle cx="140" cy="90" r="8" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Modular main unit */}
    <rect x="45" y="35" width="110" height="35" rx="4" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Detachable modules */}
    <rect x="50" y="40" width="30" height="25" rx="2" fill="white" stroke="#6A1B9A" strokeWidth="2" />
    <rect x="85" y="40" width="30" height="25" rx="2" fill="white" stroke="#6A1B9A" strokeWidth="2" />
    <rect x="120" y="40" width="30" height="25" rx="2" fill="white" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Connection points between modules */}
    <line x1="80" y1="52.5" x2="85" y2="52.5" stroke="#6A1B9A" strokeWidth="2" />
    <line x1="115" y1="52.5" x2="120" y2="52.5" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Interactive display */}
    <rect x="90" y="45" width="20" height="15" rx="1" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="1" />
    <line x1="95" y1="50" x2="105" y2="50" stroke="#6A1B9A" strokeWidth="1" />
    <line x1="95" y1="55" x2="105" y2="55" stroke="#6A1B9A" strokeWidth="1" />
    
    {/* Support systems */}
    <circle cx="60" cy="50" r="5" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="1" />
    <circle cx="140" cy="50" r="5" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="1" />
    
    {/* Unit badge */}
    <rect x="92.5" y="25" width="15" height="8" rx="2" fill="#6A1B9A" />
    <text x="95.5" y="31" fontSize="6" fill="white" fontWeight="bold">NST-3</text>
  </svg>
);

// Unit #4 Illustration - Specialized Long-Distance Transport Unit
export const Unit4Illustration: React.FC = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 200 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Reinforced long-distance base */}
    <rect x="35" y="75" width="130" height="10" rx="3" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Enhanced wheel system */}
    <circle cx="50" cy="95" r="10" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    <circle cx="150" cy="95" r="10" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    <line x1="45" y1="85" x2="55" y2="85" stroke="#6A1B9A" strokeWidth="2" />
    <line x1="145" y1="85" x2="155" y2="85" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Extended enclosure for long journeys */}
    <rect x="40" y="25" width="120" height="50" rx="5" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Climate controlled environment */}
    <rect x="45" y="30" width="110" height="40" rx="4" fill="white" stroke="#6A1B9A" strokeWidth="2" strokeDasharray="3 1" />
    
    {/* Multi-system monitoring */}
    <rect x="50" y="35" width="25" height="30" rx="2" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="1" />
    <line x1="55" y1="45" x2="70" y2="45" stroke="#6A1B9A" strokeWidth="1" />
    <line x1="55" y1="50" x2="70" y2="50" stroke="#6A1B9A" strokeWidth="1" />
    <line x1="55" y1="55" x2="70" y2="55" stroke="#6A1B9A" strokeWidth="1" />
    
    {/* Patient chamber with enhanced insulation */}
    <rect x="80" y="35" width="40" height="30" rx="3" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="1" />
    <ellipse cx="100" cy="50" rx="15" ry="10" fill="white" stroke="#6A1B9A" strokeWidth="1" />
    
    {/* Extended battery and supply systems */}
    <rect x="125" y="35" width="25" height="30" rx="2" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="1" />
    <rect x="130" y="40" width="15" height="10" rx="1" fill="white" stroke="#6A1B9A" strokeWidth="1" />
    <rect x="130" y="55" width="15" height="5" rx="1" fill="white" stroke="#6A1B9A" strokeWidth="1" />
    
    {/* Unit designation */}
    <rect x="92.5" y="15" width="15" height="8" rx="2" fill="#6A1B9A" />
    <text x="95.5" y="21" fontSize="6" fill="white" fontWeight="bold">NST-4</text>
  </svg>
);

// Unit #5 Illustration - Compact Emergency Response Unit
export const Unit5Illustration: React.FC = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 200 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Lightweight rapid deployment base */}
    <rect x="45" y="65" width="110" height="8" rx="2" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Quick-release wheel system */}
    <circle cx="60" cy="80" r="7" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    <circle cx="140" cy="80" r="7" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    <line x1="60" y1="73" x2="60" y2="65" stroke="#6A1B9A" strokeWidth="1" />
    <line x1="140" y1="73" x2="140" y2="65" stroke="#6A1B9A" strokeWidth="1" />
    
    {/* Compact unified design */}
    <rect x="50" y="35" width="100" height="30" rx="4" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="2" />
    
    {/* Central monitoring system */}
    <rect x="85" y="40" width="30" height="20" rx="2" fill="white" stroke="#6A1B9A" strokeWidth="2" />
    <line x1="90" y1="45" x2="110" y2="45" stroke="#6A1B9A" strokeWidth="1" />
    <line x1="90" y1="50" x2="110" y2="50" stroke="#6A1B9A" strokeWidth="1" />
    <line x1="90" y1="55" x2="110" y2="55" stroke="#6A1B9A" strokeWidth="1" />
    
    {/* Quick-access supply compartments */}
    <rect x="55" y="40" width="25" height="8" rx="1" fill="white" stroke="#6A1B9A" strokeWidth="1" />
    <rect x="55" y="52" width="25" height="8" rx="1" fill="white" stroke="#6A1B9A" strokeWidth="1" />
    <rect x="120" y="40" width="25" height="8" rx="1" fill="white" stroke="#6A1B9A" strokeWidth="1" />
    <rect x="120" y="52" width="25" height="8" rx="1" fill="white" stroke="#6A1B9A" strokeWidth="1" />
    
    {/* Emergency light beacon */}
    <rect x="97.5" y="25" width="5" height="10" rx="1" fill="#E1E1FB" stroke="#6A1B9A" strokeWidth="1" />
    <circle cx="100" cy="25" r="7" fill="#F3E5F5" stroke="#6A1B9A" strokeWidth="1" />
    
    {/* Unit designation */}
    <rect x="75" y="45" width="15" height="8" rx="2" fill="#6A1B9A" />
    <text x="78" y="51" fontSize="6" fill="white" fontWeight="bold">NST-5</text>
  </svg>
);

// Get illustration based on unit number
export const getUnitIllustration = (unitId: string): React.ReactNode => {
  switch (unitId) {
    case "Unit #1":
      return <Unit1Illustration />;
    case "Unit #2":
      return <Unit2Illustration />;
    case "Unit #3":
      return <Unit3Illustration />;
    case "Unit #4":
      return <Unit4Illustration />;
    case "Unit #5":
      return <Unit5Illustration />;
    default:
      return <Unit1Illustration />;
  }
};

export default getUnitIllustration;