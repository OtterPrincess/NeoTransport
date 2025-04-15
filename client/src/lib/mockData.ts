// Historical data for charts
export const generateMockHistoricalData = (
  current: number,
  hours: number = 4,
  minVariance: number = 0.1,
  maxVariance: number = 0.5
) => {
  const now = new Date();
  const data = [];
  
  for (let i = hours; i >= 0; i--) {
    // Generate a point every 10 minutes
    for (let m = 0; m < 6; m++) {
      const time = new Date(now.getTime() - ((i * 60) + (m * 10)) * 60000);
      
      // Random variance from the current value, with more recent values closer to current
      const distanceFactor = i / hours; // 0 (now) to 1 (oldest)
      const variance = (Math.random() * (maxVariance - minVariance) + minVariance) * (Math.random() > 0.5 ? 1 : -1);
      const adjustedVariance = variance * (1 + distanceFactor);
      
      // Generate a value with reasonable variance
      const value = current + adjustedVariance;
      
      data.push({
        time: time.toISOString(),
        value: Number(value.toFixed(1))
      });
    }
  }
  
  return data;
};

// Mock vibration data (spikes every now and then)
export const generateMockVibrationData = (hours: number = 4) => {
  const now = new Date();
  const data = [];
  
  for (let i = hours; i >= 0; i--) {
    // Generate a point every 10 minutes
    for (let m = 0; m < 6; m++) {
      const time = new Date(now.getTime() - ((i * 60) + (m * 10)) * 60000);
      
      // Baseline low vibration
      let value = Math.random() * 0.2;
      
      // Occasional spikes
      if (Math.random() > 0.95) {
        value = Math.random() * 0.7 + 0.3; // Spike between 0.3 and 1.0
      }
      
      data.push({
        time: time.toISOString(),
        value: Number(value.toFixed(2))
      });
    }
  }
  
  return data;
};

// Mock battery discharge curve
export const generateMockBatteryData = (currentLevel: number, hours: number = 24) => {
  const now = new Date();
  const data = [];
  
  // Calculate a reasonable starting point
  const startLevel = Math.min(100, currentLevel + (100 - currentLevel) * Math.random());
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60000);
    
    // Linear discharge with small variations
    const dischargeRatio = i / hours;
    const randomVariation = (Math.random() * 2 - 1) * 2; // -2 to +2 percent
    const level = currentLevel + (startLevel - currentLevel) * dischargeRatio + randomVariation;
    
    data.push({
      time: time.toISOString(),
      value: Math.min(100, Math.max(0, Number(level.toFixed(0))))
    });
  }
  
  return data;
};
