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
