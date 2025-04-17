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
  role: text("role").notNull().default("nurse"), // nurse, tech_support, admin, director
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
