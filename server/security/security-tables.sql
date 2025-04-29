-- IP geolocation data
CREATE TABLE IF NOT EXISTS ip_geo_data (
  id SERIAL PRIMARY KEY,
  ip_address TEXT NOT NULL UNIQUE,
  country TEXT,
  region TEXT,
  city TEXT,
  latitude REAL,
  longitude REAL,
  isp TEXT,
  organization TEXT,
  asn TEXT,
  is_proxy BOOLEAN DEFAULT FALSE,
  is_vpn BOOLEAN DEFAULT FALSE,
  is_tor BOOLEAN DEFAULT FALSE,
  is_hosting BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IP activity logging
CREATE TABLE IF NOT EXISTS ip_activity (
  id SERIAL PRIMARY KEY,
  ip_address TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id),
  request_path TEXT NOT NULL,
  request_method TEXT NOT NULL,
  user_agent TEXT,
  referer TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  response_status INTEGER,
  response_time INTEGER,
  request_payload_size INTEGER,
  response_size INTEGER,
  request_headers TEXT,
  session_id TEXT
);

-- Bot detection and threat assessment
CREATE TABLE IF NOT EXISTS bot_threat_detection (
  id SERIAL PRIMARY KEY,
  ip_address TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Request frequency metrics
  requests_per_minute INTEGER,
  requests_per_hour INTEGER,
  unique_paths_accessed INTEGER,
  
  -- Behavioral patterns
  has_abnormal_timing BOOLEAN DEFAULT FALSE,
  has_uncommon_headers BOOLEAN DEFAULT FALSE,
  has_fingerprint_evasion BOOLEAN DEFAULT FALSE,
  failed_login_attempts INTEGER DEFAULT 0,
  accessed_honeypot_routes BOOLEAN DEFAULT FALSE,
  
  -- Threat assessment
  threat_score REAL NOT NULL,
  threat_severity TEXT NOT NULL DEFAULT 'none',
  
  -- Actions taken
  action_taken TEXT,
  is_blocked BOOLEAN DEFAULT FALSE,
  block_expiration TIMESTAMP,
  
  -- Analysis
  analysis_notes TEXT,
  false_positive BOOLEAN,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IP watchlist for known threats
CREATE TABLE IF NOT EXISTS ip_watchlist (
  id SERIAL PRIMARY KEY,
  ip_address TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  threat_severity TEXT NOT NULL,
  added_by INTEGER,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  evidence TEXT
);

-- Security audit log for administrative actions
CREATE TABLE IF NOT EXISTS security_audit_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  affected_resource TEXT,
  success BOOLEAN DEFAULT TRUE
);