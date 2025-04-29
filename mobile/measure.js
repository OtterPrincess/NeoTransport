// ===== Constants =====
const API_ENDPOINT = '/api/mobile/measurements'; // Endpoint for sending data to main dashboard
const SAMPLE_RATE = 50; // Number of samples per second
const VIBRATION_THRESHOLD = 0.1; // Minimum vibration to record (to filter noise)

// ===== DOM Elements =====
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const sendButton = document.getElementById('send-button');
const newMeasurementButton = document.getElementById('new-measurement-button');
const retryButton = document.getElementById('retry-button');
const okButton = document.getElementById('ok-button');
const successOkButton = document.getElementById('success-ok-button');
const errorOkButton = document.getElementById('error-ok-button');
const timerDisplay = document.getElementById('timer-display');
const xValue = document.getElementById('x-value');
const yValue = document.getElementById('y-value');
const zValue = document.getElementById('z-value');
const totalValue = document.getElementById('total-value');
const durationResult = document.getElementById('duration-result');
const peakResult = document.getElementById('peak-result');
const avgResult = document.getElementById('avg-result');

// Screens
const landingScreen = document.getElementById('landing-screen');
const measuringScreen = document.getElementById('measuring-screen');
const resultsScreen = document.getElementById('results-screen');

// Overlays
const permissionDeniedOverlay = document.getElementById('permission-denied');
const noSensorsOverlay = document.getElementById('no-sensors');
const sendingDataOverlay = document.getElementById('sending-data');
const successMessageOverlay = document.getElementById('success-message');
const errorMessageOverlay = document.getElementById('error-message');

// ===== State =====
let measuring = false;
let startTime = null;
let elapsedTime = 0;
let timerInterval = null;
let sensorData = [];
let peakVibration = 0;
let deviceId = generateDeviceId();
let sessionId = null;

// ===== Main Functions =====

// Initialize the application
function init() {
  attachEventListeners();
  checkSensorAvailability();
}

// Check if sensors are available on this device
function checkSensorAvailability() {
  if (window.DeviceMotionEvent === undefined) {
    showOverlay(noSensorsOverlay);
    return false;
  }
  return true;
}

// Request permission to access motion sensors (iOS 13+)
function requestMotionPermission() {
  return new Promise((resolve, reject) => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      // iOS 13+ requires explicit permission
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            resolve(true);
          } else {
            reject(new Error('Permission denied'));
          }
        })
        .catch(error => {
          reject(error);
        });
    } else {
      // Permission not required (Android or older iOS)
      resolve(true);
    }
  });
}

// Start measuring vibration
function startMeasuring() {
  if (measuring) return;
  
  requestMotionPermission()
    .then(() => {
      sessionId = generateSessionId();
      showScreen(measuringScreen);
      measuring = true;
      startTime = Date.now();
      sensorData = [];
      peakVibration = 0;
      
      // Start accelerometer listening
      window.addEventListener('devicemotion', handleMotion);
      
      // Start timer
      startTimer();
    })
    .catch(error => {
      console.error('Motion permission error:', error);
      showOverlay(permissionDeniedOverlay);
    });
}

// Stop measuring vibration
function stopMeasuring() {
  if (!measuring) return;
  
  // Stop accelerometer listening
  window.removeEventListener('devicemotion', handleMotion);
  
  // Stop timer
  stopTimer();
  
  // Calculate results
  const results = calculateResults();
  displayResults(results);
  
  measuring = false;
  showScreen(resultsScreen);
}

// Handle accelerometer data
function handleMotion(event) {
  const acceleration = event.acceleration || 
                      event.accelerationIncludingGravity;
  
  if (!acceleration) return;
  
  // Get acceleration values
  let x = acceleration.x || 0;
  let y = acceleration.y || 0;
  let z = acceleration.z || 0;
  
  // If using accelerationIncludingGravity, attempt to remove gravity
  if (!event.acceleration) {
    // This is a very basic gravity approximation
    // A more accurate approach would use a low-pass filter
    if (sensorData.length > 0) {
      const prev = sensorData[sensorData.length - 1];
      x -= prev.rawX * 0.8;
      y -= prev.rawY * 0.8;
      z -= prev.rawZ * 0.8;
    }
  }
  
  // Calculate total vibration magnitude
  const total = Math.sqrt(x*x + y*y + z*z);
  
  // Update peak vibration
  if (total > peakVibration) {
    peakVibration = total;
  }
  
  // Update display
  updateReadings(x, y, z, total);
  
  // Record if above threshold
  if (total > VIBRATION_THRESHOLD) {
    sensorData.push({
      timestamp: Date.now(),
      x: parseFloat(x.toFixed(3)),
      y: parseFloat(y.toFixed(3)),
      z: parseFloat(z.toFixed(3)),
      total: parseFloat(total.toFixed(3)),
      rawX: acceleration.x || 0,
      rawY: acceleration.y || 0,
      rawZ: acceleration.z || 0
    });
  }
}

// Update displayed readings
function updateReadings(x, y, z, total) {
  xValue.textContent = Math.abs(x).toFixed(2);
  yValue.textContent = Math.abs(y).toFixed(2);
  zValue.textContent = Math.abs(z).toFixed(2);
  totalValue.textContent = total.toFixed(2);
}

// Start the timer
function startTimer() {
  elapsedTime = 0;
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    updateTimerDisplay();
  }, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// Update timer display
function updateTimerDisplay() {
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Calculate measurement results
function calculateResults() {
  let avgVibration = 0;
  
  if (sensorData.length > 0) {
    const totalVibration = sensorData.reduce((sum, data) => sum + data.total, 0);
    avgVibration = totalVibration / sensorData.length;
  }
  
  return {
    duration: elapsedTime,
    peak: peakVibration,
    average: avgVibration,
    samples: sensorData.length
  };
}

// Display results on the results screen
function displayResults(results) {
  const minutes = Math.floor(results.duration / 60);
  const seconds = results.duration % 60;
  durationResult.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  peakResult.textContent = results.peak.toFixed(2);
  avgResult.textContent = results.average.toFixed(2);
}

// Send data to the main dashboard
function sendDataToDashboard() {
  if (sensorData.length === 0) {
    return Promise.reject(new Error('No data to send'));
  }
  
  const payload = {
    deviceId: deviceId,
    sessionId: sessionId,
    timestamp: new Date().toISOString(),
    startTime: new Date(startTime).toISOString(),
    duration: elapsedTime,
    peakVibration: peakVibration,
    averageVibration: parseFloat(avgResult.textContent),
    readings: sensorData
  };
  
  showOverlay(sendingDataOverlay);
  
  return fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    hideOverlay(sendingDataOverlay);
    showOverlay(successMessageOverlay);
    return data;
  })
  .catch(error => {
    console.error('Error:', error);
    hideOverlay(sendingDataOverlay);
    showOverlay(errorMessageOverlay);
    // Save data locally for later retry
    saveDataLocally(payload);
    throw error;
  });
}

// Save data locally when offline
function saveDataLocally(data) {
  try {
    const storedData = JSON.parse(localStorage.getItem('pendingMeasurements')) || [];
    storedData.push(data);
    localStorage.setItem('pendingMeasurements', JSON.stringify(storedData));
  } catch (error) {
    console.error('Error saving data locally:', error);
  }
}

// ===== Helper Functions =====

// Show a specific screen
function showScreen(screen) {
  // Hide all screens
  landingScreen.classList.remove('active');
  measuringScreen.classList.remove('active');
  resultsScreen.classList.remove('active');
  
  // Show the requested screen
  screen.classList.add('active');
}

// Show an overlay
function showOverlay(overlay) {
  overlay.style.display = 'flex';
}

// Hide an overlay
function hideOverlay(overlay) {
  overlay.style.display = 'none';
}

// Generate a unique session ID
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Generate a device ID or retrieve existing one
function generateDeviceId() {
  let id = localStorage.getItem('deviceId');
  if (!id) {
    id = 'device_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('deviceId', id);
  }
  return id;
}

// Attach event listeners to buttons
function attachEventListeners() {
  startButton.addEventListener('click', startMeasuring);
  stopButton.addEventListener('click', stopMeasuring);
  sendButton.addEventListener('click', () => {
    sendDataToDashboard()
      .catch(err => console.error(err));
  });
  newMeasurementButton.addEventListener('click', () => {
    showScreen(landingScreen);
  });
  retryButton.addEventListener('click', () => {
    hideOverlay(permissionDeniedOverlay);
    startMeasuring();
  });
  okButton.addEventListener('click', () => {
    hideOverlay(noSensorsOverlay);
  });
  successOkButton.addEventListener('click', () => {
    hideOverlay(successMessageOverlay);
    showScreen(landingScreen);
  });
  errorOkButton.addEventListener('click', () => {
    hideOverlay(errorMessageOverlay);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);