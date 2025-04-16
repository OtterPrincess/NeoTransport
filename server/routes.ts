import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // GET all units with latest telemetry
  app.get("/api/units", async (req, res) => {
    try {
      const room = req.query.room as string | undefined;
      const status = req.query.status as string | undefined;
      const unitId = req.query.unitId as string | undefined;
      
      let units = await storage.getUnitsWithTelemetry({ room, status });
      
      // Filter by unitId if provided
      if (unitId) {
        const unit = await storage.getUnitByUnitId(unitId);
        if (unit) {
          units = await storage.getUnitsWithTelemetry();
          units = units.filter(u => u.unitId === unitId);
        } else {
          units = [];
        }
      }
      
      res.json(units);
    } catch (error) {
      console.error("Error getting units:", error);
      res.status(500).json({ message: "Failed to retrieve units" });
    }
  });

  // GET a specific unit with telemetry
  app.get("/api/units/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }
      
      const unit = await storage.getUnitWithTelemetry(id);
      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }
      
      res.json(unit);
    } catch (error) {
      console.error("Error getting unit:", error);
      res.status(500).json({ message: "Failed to retrieve unit" });
    }
  });

  // GET historical telemetry for a unit
  app.get("/api/units/:id/telemetry", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
      const telemetry = await storage.getTelemetryByUnitId(id, limit);
      
      res.json(telemetry);
    } catch (error) {
      console.error("Error getting telemetry:", error);
      res.status(500).json({ message: "Failed to retrieve telemetry data" });
    }
  });

  // GET alerts with optional filtering
  app.get("/api/alerts", async (req, res) => {
    try {
      const unitId = req.query.unitId ? parseInt(req.query.unitId as string, 10) : undefined;
      const status = req.query.status as string | undefined;
      
      const alerts = await storage.getAlerts({ unitId, status });
      res.json(alerts);
    } catch (error) {
      console.error("Error getting alerts:", error);
      res.status(500).json({ message: "Failed to retrieve alerts" });
    }
  });

  // POST to acknowledge an alert
  app.post("/api/alerts/:id/acknowledge", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid alert ID" });
      }
      
      const schema = z.object({
        acknowledgedBy: z.string().optional()
      });
      
      const validatedData = schema.parse(req.body);
      
      const alert = await storage.getAlert(id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      const updatedAlert = await storage.updateAlert(id, {
        status: "acknowledged",
        acknowledgedBy: validatedData.acknowledgedBy || "Unknown User",
        acknowledgedAt: new Date()
      });
      
      res.json(updatedAlert);
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      res.status(500).json({ message: "Failed to acknowledge alert" });
    }
  });

  // POST to request a tech check
  app.post("/api/units/:id/request-tech-check", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }
      
      const unit = await storage.getUnit(id);
      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }
      
      // Create a mock tech check alert
      const alert = await storage.createAlert({
        unitId: id,
        alertType: "maintenance",
        message: "Tech check requested",
        status: "active",
        timestamp: new Date()
      });
      
      res.json({
        message: "Tech check requested successfully",
        alert
      });
    } catch (error) {
      console.error("Error requesting tech check:", error);
      res.status(500).json({ message: "Failed to request tech check" });
    }
  });

  // POST to send alert to Teams (mock endpoint)
  app.post("/api/alerts/:id/send-to-teams", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid alert ID" });
      }
      
      const alert = await storage.getAlert(id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      // This would normally integrate with Microsoft Teams API
      // For now, we'll just mark the alert as sent
      const updatedAlert = await storage.updateAlert(id, {
        // Store that it was sent to Teams
      });
      
      res.json({
        message: "Alert sent to Microsoft Teams successfully",
        alert: updatedAlert
      });
    } catch (error) {
      console.error("Error sending to Teams:", error);
      res.status(500).json({ message: "Failed to send alert to Teams" });
    }
  });

  // POST to resolve/dismiss an alert
  app.post("/api/alerts/:id/resolve", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid alert ID" });
      }
      
      const alert = await storage.getAlert(id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      const updatedAlert = await storage.updateAlert(id, {
        status: "resolved",
        resolvedAt: new Date()
      });
      
      res.json(updatedAlert);
    } catch (error) {
      console.error("Error resolving alert:", error);
      res.status(500).json({ message: "Failed to resolve alert" });
    }
  });

  // POST to generate a device report (mock endpoint)
  app.post("/api/units/:id/generate-report", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }
      
      const unit = await storage.getUnit(id);
      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }
      
      // This would normally generate a PDF or other report format
      // For now, we'll just return a success message
      res.json({
        message: "Device report generated successfully",
        reportUrl: `/reports/${unit.unitId}_${Date.now()}.pdf`
      });
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ message: "Failed to generate device report" });
    }
  });

  // POST to generate a full report (mock endpoint)
  app.post("/api/units/:id/full-report", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }
      
      const unit = await storage.getUnit(id);
      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }
      
      // Get the unit's telemetry and alerts
      const telemetry = await storage.getTelemetryByUnitId(id, 100);
      const alerts = await storage.getAlerts({ unitId: id });
      
      // This would normally generate a comprehensive PDF or other report format
      // For now, we'll just return a success message with mock data
      res.json({
        message: "Full report generated successfully",
        reportUrl: `/reports/full_${unit.unitId}_${Date.now()}.pdf`,
        reportData: {
          unitInfo: unit,
          telemetryCount: telemetry.length,
          alertsCount: alerts.length,
          generatedAt: new Date()
        }
      });
    } catch (error) {
      console.error("Error generating full report:", error);
      res.status(500).json({ message: "Failed to generate full report" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
