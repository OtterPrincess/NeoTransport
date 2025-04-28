import { pgTable, text, serial, timestamp, integer, real, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { units } from "./schema";

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
  metadata: jsonb("metadata"), // JSON data for additional information
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