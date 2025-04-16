import { 
  users, type User, type InsertUser,
  units, type Unit, type InsertUnit,
  telemetry, type Telemetry, type InsertTelemetry,
  alerts, type Alert, type InsertAlert,
  type UnitWithTelemetry
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Unit operations
  getUnits(): Promise<Unit[]>;
  getUnit(id: number): Promise<Unit | undefined>;
  getUnitByUnitId(unitId: string): Promise<Unit | undefined>;
  createUnit(unit: InsertUnit): Promise<Unit>;
  updateUnit(id: number, unit: Partial<Unit>): Promise<Unit | undefined>;
  
  // Telemetry operations
  getTelemetryByUnitId(unitId: number, limit?: number): Promise<Telemetry[]>;
  createTelemetry(telemetry: InsertTelemetry): Promise<Telemetry>;
  getLatestTelemetry(unitId: number): Promise<Telemetry | undefined>;
  
  // Alert operations
  getAlerts(filter?: { unitId?: number, status?: string }): Promise<Alert[]>;
  getAlert(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, alert: Partial<Alert>): Promise<Alert | undefined>;
  
  // Combined operations
  getUnitsWithTelemetry(filter?: { room?: string, status?: string }): Promise<UnitWithTelemetry[]>;
  getUnitWithTelemetry(id: number): Promise<UnitWithTelemetry | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private units: Map<number, Unit>;
  private telemetry: Map<number, Telemetry>;
  private alerts: Map<number, Alert>;
  
  private userIdCounter: number;
  private unitIdCounter: number;
  private telemetryIdCounter: number;
  private alertIdCounter: number;

  constructor() {
    this.users = new Map();
    this.units = new Map();
    this.telemetry = new Map();
    this.alerts = new Map();
    
    this.userIdCounter = 1;
    this.unitIdCounter = 1;
    this.telemetryIdCounter = 1;
    this.alertIdCounter = 1;
    
    // Initialize with some sample units
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create some units
    const unit1 = await this.createUnit({
      unitId: "Unit #1",
      serialNumber: "NST-2023-001-A",
      firmwareVersion: "v2.1.5",
      room: "NICU-A",
      location: "Room 101",
      assignedNurse: "Nurse Johnson",
      lastMaintenance: new Date("2023-05-12"),
      nextMaintenance: new Date("2023-06-27"),
      status: "alert"
    });
    
    const unit2 = await this.createUnit({
      unitId: "Unit #2",
      serialNumber: "NST-2023-002-B",
      firmwareVersion: "v2.1.5",
      room: "NICU-B",
      location: "Room 203",
      assignedNurse: "Nurse Smith",
      lastMaintenance: new Date("2023-05-20"),
      nextMaintenance: new Date("2023-07-05"),
      status: "warning"
    });
    
    const unit3 = await this.createUnit({
      unitId: "Unit #3",
      serialNumber: "NST-2023-003-C",
      firmwareVersion: "v2.1.4",
      room: "NICU-A",
      location: "Room 105",
      assignedNurse: "Nurse Wilson",
      lastMaintenance: new Date("2023-04-30"),
      nextMaintenance: new Date("2023-06-30"),
      status: "normal"
    });
    
    const unit4 = await this.createUnit({
      unitId: "Unit #4",
      serialNumber: "NST-2023-004-D",
      firmwareVersion: "v2.1.5",
      room: "NICU-B",
      location: "Room 210",
      assignedNurse: "Nurse Garcia",
      lastMaintenance: new Date("2023-05-10"),
      nextMaintenance: new Date("2023-07-10"),
      status: "normal"
    });
    
    const unit5 = await this.createUnit({
      unitId: "Unit #5",
      serialNumber: "NST-2023-005-E",
      firmwareVersion: "v2.1.3",
      room: "Transport",
      location: "Transport Unit",
      assignedNurse: "Nurse Lee",
      lastMaintenance: new Date("2023-05-01"),
      nextMaintenance: new Date("2023-07-01"),
      status: "offline"
    });
    
    // Create telemetry for each unit
    this.createTelemetry({
      unitId: unit1.id,
      internalTemp: 39.2,
      surfaceTemp: 37.8,
      vibration: 0.2,
      batteryLevel: 82,
      batteryCharging: false,
      timestamp: new Date()
    });
    
    this.createTelemetry({
      unitId: unit2.id,
      internalTemp: 36.5,
      surfaceTemp: 35.8,
      vibration: 0.1,
      batteryLevel: 28,
      batteryCharging: false,
      timestamp: new Date()
    });
    
    this.createTelemetry({
      unitId: unit3.id,
      internalTemp: 36.8,
      surfaceTemp: 36.5,
      vibration: 0.1,
      batteryLevel: 95,
      batteryCharging: false,
      timestamp: new Date()
    });
    
    this.createTelemetry({
      unitId: unit4.id,
      internalTemp: 36.6,
      surfaceTemp: 36.4,
      vibration: 0.1,
      batteryLevel: 87,
      batteryCharging: false,
      timestamp: new Date()
    });
    
    // No telemetry for unit 5 (offline)
    
    // Create some alerts
    this.createAlert({
      unitId: unit1.id,
      alertType: "temperature",
      message: "Internal temperature exceeded threshold",
      value: "39.2°C",
      status: "active",
      timestamp: new Date()
    });
    
    this.createAlert({
      unitId: unit1.id,
      alertType: "temperature",
      message: "Surface temperature exceeded threshold",
      value: "37.8°C",
      status: "active",
      timestamp: new Date(Date.now() - 5 * 60000) // 5 minutes ago
    });
    
    this.createAlert({
      unitId: unit2.id,
      alertType: "battery",
      message: "Battery level is low",
      value: "28%",
      status: "active",
      timestamp: new Date()
    });
    
    this.createAlert({
      unitId: unit2.id,
      alertType: "temperature",
      message: "Surface temperature below normal range",
      value: "35.8°C",
      status: "active",
      timestamp: new Date()
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Unit operations
  async getUnits(): Promise<Unit[]> {
    return Array.from(this.units.values());
  }
  
  async getUnit(id: number): Promise<Unit | undefined> {
    return this.units.get(id);
  }
  
  async getUnitByUnitId(unitId: string): Promise<Unit | undefined> {
    return Array.from(this.units.values()).find(unit => unit.unitId === unitId);
  }
  
  async createUnit(insertUnit: InsertUnit): Promise<Unit> {
    const id = this.unitIdCounter++;
    const unit: Unit = { ...insertUnit, id };
    this.units.set(id, unit);
    return unit;
  }
  
  async updateUnit(id: number, unitUpdate: Partial<Unit>): Promise<Unit | undefined> {
    const unit = this.units.get(id);
    if (!unit) return undefined;
    
    const updatedUnit = { ...unit, ...unitUpdate };
    this.units.set(id, updatedUnit);
    return updatedUnit;
  }
  
  // Telemetry operations
  async getTelemetryByUnitId(unitId: number, limit = 100): Promise<Telemetry[]> {
    return Array.from(this.telemetry.values())
      .filter(t => t.unitId === unitId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  async createTelemetry(insertTelemetry: InsertTelemetry): Promise<Telemetry> {
    const id = this.telemetryIdCounter++;
    const telemetry: Telemetry = { ...insertTelemetry, id };
    this.telemetry.set(id, telemetry);
    return telemetry;
  }
  
  async getLatestTelemetry(unitId: number): Promise<Telemetry | undefined> {
    const telemetryItems = await this.getTelemetryByUnitId(unitId, 1);
    return telemetryItems.length > 0 ? telemetryItems[0] : undefined;
  }
  
  // Alert operations
  async getAlerts(filter: { unitId?: number, status?: string } = {}): Promise<Alert[]> {
    let alerts = Array.from(this.alerts.values());
    
    if (filter.unitId !== undefined) {
      alerts = alerts.filter(a => a.unitId === filter.unitId);
    }
    
    if (filter.status !== undefined) {
      alerts = alerts.filter(a => a.status === filter.status);
    }
    
    // Sort by timestamp (most recent first)
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }
  
  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.alertIdCounter++;
    const alert: Alert = { ...insertAlert, id };
    this.alerts.set(id, alert);
    return alert;
  }
  
  async updateAlert(id: number, alertUpdate: Partial<Alert>): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { ...alert, ...alertUpdate };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }
  
  // Combined operations
  async getUnitsWithTelemetry(filter: { room?: string, status?: string } = {}): Promise<UnitWithTelemetry[]> {
    let filteredUnits = Array.from(this.units.values());
    
    if (filter.room !== undefined && filter.room !== "") {
      filteredUnits = filteredUnits.filter(unit => unit.room === filter.room);
    }
    
    if (filter.status !== undefined && filter.status !== "") {
      filteredUnits = filteredUnits.filter(unit => unit.status === filter.status);
    }
    
    const unitsWithTelemetry: UnitWithTelemetry[] = await Promise.all(
      filteredUnits.map(async (unit) => {
        const latestTelemetry = await this.getLatestTelemetry(unit.id);
        const unitAlerts = await this.getAlerts({ unitId: unit.id });
        
        return {
          ...unit,
          telemetry: latestTelemetry || null,
          alerts: unitAlerts
        };
      })
    );
    
    return unitsWithTelemetry;
  }
  
  async getUnitWithTelemetry(id: number): Promise<UnitWithTelemetry | undefined> {
    const unit = await this.getUnit(id);
    if (!unit) return undefined;
    
    const latestTelemetry = await this.getLatestTelemetry(id);
    const unitAlerts = await this.getAlerts({ unitId: id });
    
    return {
      ...unit,
      telemetry: latestTelemetry || null,
      alerts: unitAlerts
    };
  }
}

// Database-backed storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Unit operations
  async getUnits(): Promise<Unit[]> {
    return db.select().from(units);
  }
  
  async getUnit(id: number): Promise<Unit | undefined> {
    const [unit] = await db.select().from(units).where(eq(units.id, id));
    return unit || undefined;
  }
  
  async getUnitByUnitId(unitId: string): Promise<Unit | undefined> {
    const [unit] = await db.select().from(units).where(eq(units.unitId, unitId));
    return unit || undefined;
  }
  
  async createUnit(insertUnit: InsertUnit): Promise<Unit> {
    const [unit] = await db
      .insert(units)
      .values(insertUnit)
      .returning();
    return unit;
  }
  
  async updateUnit(id: number, unitUpdate: Partial<Unit>): Promise<Unit | undefined> {
    const [updatedUnit] = await db
      .update(units)
      .set(unitUpdate)
      .where(eq(units.id, id))
      .returning();
    return updatedUnit || undefined;
  }
  
  // Telemetry operations
  async getTelemetryByUnitId(unitId: number, limit = 100): Promise<Telemetry[]> {
    return db
      .select()
      .from(telemetry)
      .where(eq(telemetry.unitId, unitId))
      .orderBy(desc(telemetry.timestamp))
      .limit(limit);
  }
  
  async createTelemetry(insertTelemetry: InsertTelemetry): Promise<Telemetry> {
    const [telemetryEntry] = await db
      .insert(telemetry)
      .values(insertTelemetry)
      .returning();
    return telemetryEntry;
  }
  
  async getLatestTelemetry(unitId: number): Promise<Telemetry | undefined> {
    const [latestTelemetry] = await db
      .select()
      .from(telemetry)
      .where(eq(telemetry.unitId, unitId))
      .orderBy(desc(telemetry.timestamp))
      .limit(1);
    return latestTelemetry || undefined;
  }
  
  // Alert operations
  async getAlerts(filter: { unitId?: number, status?: string } = {}): Promise<Alert[]> {
    let query = db.select().from(alerts);
    
    if (filter.unitId !== undefined) {
      query = query.where(eq(alerts.unitId, filter.unitId));
    }
    
    if (filter.status !== undefined) {
      query = query.where(eq(alerts.status, filter.status));
    }
    
    return query.orderBy(desc(alerts.timestamp));
  }
  
  async getAlert(id: number): Promise<Alert | undefined> {
    const [alert] = await db.select().from(alerts).where(eq(alerts.id, id));
    return alert || undefined;
  }
  
  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const [alert] = await db
      .insert(alerts)
      .values(insertAlert)
      .returning();
    return alert;
  }
  
  async updateAlert(id: number, alertUpdate: Partial<Alert>): Promise<Alert | undefined> {
    const [updatedAlert] = await db
      .update(alerts)
      .set(alertUpdate)
      .where(eq(alerts.id, id))
      .returning();
    return updatedAlert || undefined;
  }
  
  // Combined operations
  async getUnitsWithTelemetry(filter: { room?: string, status?: string } = {}): Promise<UnitWithTelemetry[]> {
    let query = db.select().from(units);
    
    if (filter.room !== undefined && filter.room !== "") {
      query = query.where(eq(units.room, filter.room));
    }
    
    if (filter.status !== undefined && filter.status !== "") {
      query = query.where(eq(units.status, filter.status));
    }
    
    const unitsList = await query;
    
    const unitsWithTelemetry: UnitWithTelemetry[] = await Promise.all(
      unitsList.map(async (unit) => {
        const latestTelemetry = await this.getLatestTelemetry(unit.id);
        const unitAlerts = await this.getAlerts({ unitId: unit.id });
        
        return {
          ...unit,
          telemetry: latestTelemetry || null,
          alerts: unitAlerts
        };
      })
    );
    
    return unitsWithTelemetry;
  }
  
  async getUnitWithTelemetry(id: number): Promise<UnitWithTelemetry | undefined> {
    const unit = await this.getUnit(id);
    if (!unit) return undefined;
    
    const latestTelemetry = await this.getLatestTelemetry(id);
    const unitAlerts = await this.getAlerts({ unitId: id });
    
    return {
      ...unit,
      telemetry: latestTelemetry || null,
      alerts: unitAlerts
    };
  }
}

// Create an instance of the database storage
export const storage = new DatabaseStorage();
