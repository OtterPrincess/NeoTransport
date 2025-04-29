import { pgTable, text, serial, timestamp, integer, real, boolean, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Unit status types
export const UnitStatus = z.enum(["normal", "warning", "alert", "offline"]);
export type UnitStatus = z.infer<typeof UnitStatus>;

// Base user model for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("nurse"), // Valid roles: director, head_nurse, assigned_nurse, nurse, tech_support, admin
  displayName: text("display_name"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  displayName: true,
});

// Main unit model
export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  unitId: text("unit_id").notNull().unique(), // e.g. "Unit #1"
  serialNumber: text("serial_number").notNull(),
  firmwareVersion: text("firmware_version"),
  room: text("room"), // e.g. "NICU-A"
  location: text("location"), // e.g. "Room 101"
  assignedNurse: text("assigned_nurse"),
  lastMaintenance: timestamp("last_maintenance"),
  nextMaintenance: timestamp("next_maintenance"),
  status: text("status").notNull().default("normal"), // normal, warning, alert, offline
});

export const insertUnitSchema = createInsertSchema(units).omit({
  id: true,
});

// Unit telemetry
export const telemetry = pgTable("telemetry", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull().references(() => units.id),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  internalTemp: real("internal_temp"), // Celsius
  surfaceTemp: real("surface_temp"), // Celsius
  vibration: real("vibration"), // g-force or similar unit
  batteryLevel: integer("battery_level"), // percentage
  batteryCharging: boolean("battery_charging").default(false),
});

export const insertTelemetrySchema = createInsertSchema(telemetry).omit({
  id: true,
});

// Alerts
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull().references(() => units.id),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  alertType: text("alert_type").notNull(), // e.g. "temperature", "vibration", "battery"
  message: text("message").notNull(),
  value: text("value"), // the value that triggered the alert
  status: text("status").notNull().default("active"), // active, acknowledged, resolved
  acknowledgedBy: text("acknowledged_by"),
  acknowledgedAt: timestamp("acknowledged_at"),
  resolvedAt: timestamp("resolved_at"),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  acknowledgedAt: true,
  resolvedAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Unit = typeof units.$inferSelect;
export type InsertUnit = z.infer<typeof insertUnitSchema>;

export type Telemetry = typeof telemetry.$inferSelect;
export type InsertTelemetry = z.infer<typeof insertTelemetrySchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

// Custom types for the frontend
export type UnitWithTelemetry = Unit & {
  telemetry: Telemetry | null;
  alerts: Alert[];
};

// Define relations
export const unitsRelations = relations(units, ({ many }) => ({
  telemetry: many(telemetry),
  alerts: many(alerts)
}));

export const telemetryRelations = relations(telemetry, ({ one }) => ({
  unit: one(units, {
    fields: [telemetry.unitId],
    references: [units.id]
  })
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  unit: one(units, {
    fields: [alerts.unitId],
    references: [units.id]
  })
}));

// Mobile shock measurement schemas
export const mobileMeasurements = pgTable("mobile_measurements", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  deviceId: text("device_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  startTime: timestamp("start_time").notNull(),
  duration: integer("duration").notNull(), // in seconds
  peakVibration: real("peak_vibration").notNull(),
  averageVibration: real("average_vibration").notNull(),
  unitId: integer("unit_id").references(() => units.id),
  metadata: text("metadata"), // JSON string for additional data
});

export const mobileMeasurementPoints = pgTable("mobile_measurement_points", {
  id: serial("id").primaryKey(),
  measurementId: integer("measurement_id").notNull().references(() => mobileMeasurements.id),
  timestamp: timestamp("timestamp").notNull(),
  x: real("x").notNull(),
  y: real("y").notNull(),
  z: real("z").notNull(),
  total: real("total").notNull(),
});

export const insertMobileMeasurementSchema = createInsertSchema(mobileMeasurements).omit({
  id: true,
});

export const insertMobileMeasurementPointSchema = createInsertSchema(mobileMeasurementPoints).omit({
  id: true,
});

export type MobileMeasurement = typeof mobileMeasurements.$inferSelect;
export type InsertMobileMeasurement = z.infer<typeof insertMobileMeasurementSchema>;

export type MobileMeasurementPoint = typeof mobileMeasurementPoints.$inferSelect;
export type InsertMobileMeasurementPoint = z.infer<typeof insertMobileMeasurementPointSchema>;

export const mobileMeasurementsRelations = relations(mobileMeasurements, ({ one, many }) => ({
  unit: one(units, {
    fields: [mobileMeasurements.unitId],
    references: [units.id]
  }),
  points: many(mobileMeasurementPoints)
}));

export const mobileMeasurementPointsRelations = relations(mobileMeasurementPoints, ({ one }) => ({
  measurement: one(mobileMeasurements, {
    fields: [mobileMeasurementPoints.measurementId],
    references: [mobileMeasurements.id]
  })
}));

// Security database tables for IP activity tracking and bot detection

// Threat severity levels for security events
export const ThreatSeverityEnum = z.enum([
  "none",       // No threat detected
  "low",        // Low threat (e.g., slightly unusual patterns)
  "medium",     // Medium threat (e.g., suspicious behavior)
  "high",       // High threat (e.g., likely bot activity)
  "critical"    // Critical threat (e.g., confirmed attack)
]);

export type ThreatSeverity = z.infer<typeof ThreatSeverityEnum>;

// IP geolocation data
export const ipGeoData = pgTable("ip_geo_data", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull().unique(),
  country: text("country"),
  region: text("region"),
  city: text("city"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  isp: text("isp"),
  organization: text("organization"),
  asn: text("asn"),
  isProxy: boolean("is_proxy").default(false),
  isVpn: boolean("is_vpn").default(false),
  isTor: boolean("is_tor").default(false),
  isHosting: boolean("is_hosting").default(false),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// IP activity logging
export const ipActivity = pgTable("ip_activity", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull(),
  userId: integer("user_id"), // Null for unauthenticated requests
  requestPath: text("request_path").notNull(),
  requestMethod: text("request_method").notNull(),
  userAgent: text("user_agent"),
  referer: text("referer"),
  timestamp: timestamp("timestamp").defaultNow(),
  responseStatus: integer("response_status"),
  responseTime: integer("response_time"), // in milliseconds
  requestPayloadSize: integer("request_payload_size"), // in bytes
  responseSize: integer("response_size"), // in bytes
  requestHeaders: text("request_headers"), // JSON string of relevant headers
  sessionId: text("session_id"),
});

// Bot detection and threat assessment
export const botThreatDetection = pgTable("bot_threat_detection", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  
  // Request frequency metrics
  requestsPerMinute: integer("requests_per_minute"),
  requestsPerHour: integer("requests_per_hour"),
  uniquePathsAccessed: integer("unique_paths_accessed"),
  
  // Behavioral patterns
  hasAbnormalTiming: boolean("has_abnormal_timing").default(false),
  hasUncommonHeaders: boolean("has_uncommon_headers").default(false),
  hasFingerprintEvasion: boolean("has_fingerprint_evasion").default(false),
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  accessedHoneypotRoutes: boolean("accessed_honeypot_routes").default(false),
  
  // Threat assessment
  threatScore: real("threat_score").notNull(),
  threatSeverity: text("threat_severity").notNull().$type<ThreatSeverity>().default("none"),
  
  // Actions taken
  actionTaken: text("action_taken"), // e.g., "blocked", "rate-limited", "monitored", "allowed"
  isBlocked: boolean("is_blocked").default(false),
  blockExpiration: timestamp("block_expiration"),
  
  // Analysis
  analysisNotes: text("analysis_notes"),
  falsePositive: boolean("false_positive"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// IP watchlist for known threats
export const ipWatchlist = pgTable("ip_watchlist", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull().unique(),
  reason: text("reason").notNull(),
  threatSeverity: text("threat_severity").notNull().$type<ThreatSeverity>(),
  addedBy: integer("added_by"), // User ID who added this entry
  addedAt: timestamp("added_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // Optional expiration
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
  evidence: text("evidence"), // JSON string with evidence details
});

// Security audit log for administrative actions
export const securityAuditLog = pgTable("security_audit_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(), // e.g., "block_ip", "unblock_ip", "update_threat_rules"
  details: text("details").notNull(), // JSON string with action details
  ipAddress: text("ip_address").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  affectedResource: text("affected_resource"), // e.g., IP address or user affected
  success: boolean("success").default(true),
});

// Relations
export const ipActivityRelations = relations(ipActivity, ({ one }) => ({
  user: one(users, {
    fields: [ipActivity.userId],
    references: [users.id],
  }),
}));

export const securityAuditLogRelations = relations(securityAuditLog, ({ one }) => ({
  user: one(users, {
    fields: [securityAuditLog.userId],
    references: [users.id],
  }),
}));

// Insert schemas for security tables
export const insertIpGeoDataSchema = createInsertSchema(ipGeoData);
export const insertIpActivitySchema = createInsertSchema(ipActivity);
export const insertBotThreatDetectionSchema = createInsertSchema(botThreatDetection);
export const insertIpWatchlistSchema = createInsertSchema(ipWatchlist);
export const insertSecurityAuditLogSchema = createInsertSchema(securityAuditLog);

// Type exports for security tables
export type IpGeoData = typeof ipGeoData.$inferSelect;
export type InsertIpGeoData = z.infer<typeof insertIpGeoDataSchema>;

export type IpActivity = typeof ipActivity.$inferSelect;
export type InsertIpActivity = z.infer<typeof insertIpActivitySchema>;

export type BotThreatDetection = typeof botThreatDetection.$inferSelect;
export type InsertBotThreatDetection = z.infer<typeof insertBotThreatDetectionSchema>;

export type IpWatchlist = typeof ipWatchlist.$inferSelect;
export type InsertIpWatchlist = z.infer<typeof insertIpWatchlistSchema>;

export type SecurityAuditLog = typeof securityAuditLog.$inferSelect;
export type InsertSecurityAuditLog = z.infer<typeof insertSecurityAuditLogSchema>;
