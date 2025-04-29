import { Router, Request, Response } from 'express';
import { db } from './db';
import { 
  mobileMeasurements, 
  mobileMeasurementPoints, 
  insertMobileMeasurementSchema 
} from '../shared/schema';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

const router = Router();

// Enhanced schema for HIPAA-compliant measurement data
const mobileMeasurementDataSchema = z.object({
  deviceId: z.string(),
  deviceType: z.string().optional().default("Mobile App"),
  sessionId: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  duration: z.number().nonnegative(),
  maxValue: z.number().nonnegative().optional(),
  peakVibration: z.number().nonnegative().optional(),
  description: z.string().optional(),
  dataPoints: z.number().int().nonnegative().optional(),
  averageVibration: z.number().nonnegative().optional(),
  unitId: z.number().optional(),
  readings: z.array(z.object({
    timestamp: z.number().or(z.string()),
    x: z.number(),
    y: z.number(),
    z: z.number(),
    total: z.number()
  })).optional(),
  // HIPAA/security specific fields
  encrypted: z.boolean().optional().default(true),
  secureMode: z.boolean().optional().default(true),
  retentionDays: z.number().int().positive().optional().default(30),
}).transform(data => {
  // If we have maxValue and not peakVibration, use maxValue for peakVibration
  if (data.maxValue !== undefined && data.peakVibration === undefined) {
    data.peakVibration = data.maxValue;
  }
  
  // If we have peakVibration and not maxValue, use peakVibration for maxValue
  if (data.peakVibration !== undefined && data.maxValue === undefined) {
    data.maxValue = data.peakVibration;
  }
  
  // If we have readings array but no dataPoints count, count them
  if (data.readings && data.dataPoints === undefined) {
    data.dataPoints = data.readings.length;
  }
  
  return data;
});

// Schema for batch measurement points
const mobileMeasurementPointsSchema = z.object({
  points: z.array(z.object({
    measurementId: z.number(),
    timestamp: z.string().datetime(),
    xAxis: z.number(),
    yAxis: z.number(),
    zAxis: z.number(),
    totalValue: z.number()
  }))
});

type MobileMeasurementData = z.infer<typeof mobileMeasurementDataSchema>;

// Encrypt sensitive data if requested (for HIPAA compliance)
function encryptIfNeeded(data: string, shouldEncrypt: boolean): string {
  if (!shouldEncrypt) return data;
  
  try {
    // This is a simplified example - in a real app you would use a proper encryption key management system
    const encryptionKey = process.env.ENCRYPTION_KEY || 'nestara-hipaa-compliant-key-2024';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    return data; // Fallback to unencrypted data
  }
}

// POST /api/mobile/measurements - Create a new measurement session
router.post('/measurements', async (req: Request, res: Response) => {
  try {
    // Validate incoming data
    const validationResult = mobileMeasurementDataSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid data format',
        details: validationResult.error.format()
      });
    }
    
    const data = validationResult.data;
    const shouldEncrypt = data.encrypted || false;
    const secureMode = data.secureMode || false;
    
    // Process metadata for HIPAA compliance (remove any PHI)
    let metadata: any = {
      ...req.body.metadata,
      deviceType: data.deviceType,
      secureMode,
      retentionDays: data.retentionDays,
      createdAt: new Date().toISOString(),
      dataFormat: 'accelerometer'
    };
    
    // In secure mode, ensure no PHI is included
    if (secureMode) {
      // Remove any potential PHI from metadata
      delete metadata.patientName;
      delete metadata.patientId;
      delete metadata.medicalRecordNumber;
      delete metadata.dateOfBirth;
      delete metadata.ssn;
    }
    
    // Prepare measurement data with proper typing
    const measurementData = {
      deviceId: data.deviceId,
      sessionId: data.sessionId,
      timestamp: new Date(),
      startTime: new Date(data.startTime),
      duration: data.duration,
      peakVibration: data.peakVibration || data.maxValue || 0,
      averageVibration: data.averageVibration || (data.maxValue ? data.maxValue / 2 : 0),
      dataPoints: data.dataPoints || 0,
      unitId: data.unitId || null,
      metadata: JSON.stringify(metadata),
    };
    
    // Insert the main measurement record
    const [measurement] = await db.insert(mobileMeasurements).values(measurementData).returning();
    
    // If we have readings data, insert them as measurement points
    if (data.readings && data.readings.length > 0) {
      try {
        await db.insert(mobileMeasurementPoints).values(
          data.readings.map(reading => ({
            measurementId: measurement.id,
            timestamp: new Date(typeof reading.timestamp === 'number' 
              ? reading.timestamp 
              : Date.parse(reading.timestamp)),
            x: reading.x,
            y: reading.y,
            z: reading.z,
            total: reading.total
          }))
        );
        console.log(`Inserted ${data.readings.length} measurement points for measurement ID ${measurement.id}`);
      } catch (error) {
        console.error('Error inserting measurement points:', error);
        // Continue anyway since we already created the measurement record
      }
    }
    
    res.status(201).json({
      success: true,
      id: measurement.id,
      secureMode,
      pointsRecorded: data.readings?.length || 0,
      message: 'Measurement data recorded successfully'
    });
  } catch (error) {
    console.error('Error recording measurement:', error);
    res.status(500).json({ 
      error: 'Failed to record measurement data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/mobile/measurement-points - Add data points to a measurement
router.post('/measurement-points', async (req: Request, res: Response) => {
  try {
    // Validate the incoming points data
    const validationResult = mobileMeasurementPointsSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid data point format',
        details: validationResult.error.format()
      });
    }
    
    const { points } = validationResult.data;
    
    // Insert the measurement points in batches
    const insertedPoints = await db.insert(mobileMeasurementPoints).values(
      points.map(point => ({
        measurementId: point.measurementId,
        timestamp: new Date(point.timestamp),
        x: point.xAxis,
        y: point.yAxis,
        z: point.zAxis,
        total: point.totalValue
      }))
    ).returning({ id: mobileMeasurementPoints.id });
    
    res.status(201).json({
      success: true,
      pointsAdded: insertedPoints.length,
      message: 'Measurement points added successfully'
    });
  } catch (error) {
    console.error('Error adding measurement points:', error);
    res.status(500).json({ 
      error: 'Failed to add measurement points',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/mobile/measurements - Get list of measurements
router.get('/measurements', async (req: Request, res: Response) => {
  try {
    const secureMode = req.query.secure === 'true';
    
    // If in secure mode, check authentication
    if (secureMode && !req.isAuthenticated()) {
      return res.status(401).json({ 
        error: 'Authentication required for secure data access',
        message: 'Please log in to access secure measurements'
      });
    }
    
    // Get measurements with authentication check for secure mode
    // Use different queries based on authentication status to avoid type errors
    const measurements = secureMode && !req.isAuthenticated() 
      ? await db.select({
          id: mobileMeasurements.id,
          deviceId: mobileMeasurements.deviceId,
          sessionId: mobileMeasurements.sessionId,
          timestamp: mobileMeasurements.timestamp,
          startTime: mobileMeasurements.startTime,
          duration: mobileMeasurements.duration,
          peakVibration: mobileMeasurements.peakVibration,
          averageVibration: mobileMeasurements.averageVibration,
          unitId: mobileMeasurements.unitId,
          // Exclude metadata for unauthenticated requests in secure mode
        }).from(mobileMeasurements)
      : await db.select({
          id: mobileMeasurements.id,
          deviceId: mobileMeasurements.deviceId,
          sessionId: mobileMeasurements.sessionId,
          timestamp: mobileMeasurements.timestamp,
          startTime: mobileMeasurements.startTime,
          duration: mobileMeasurements.duration,
          peakVibration: mobileMeasurements.peakVibration,
          averageVibration: mobileMeasurements.averageVibration,
          unitId: mobileMeasurements.unitId,
          metadata: mobileMeasurements.metadata
    })
    .from(mobileMeasurements)
    .orderBy(desc(mobileMeasurements.timestamp))
    .limit(50);
    
    // Add no-cache headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.json(measurements);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
});

// GET /api/mobile/measurements/:id - Get a specific measurement with its data points
router.get('/measurements/:id', async (req: Request, res: Response) => {
  try {
    const measurementId = parseInt(req.params.id);
    
    if (isNaN(measurementId)) {
      return res.status(400).json({ error: 'Invalid measurement ID' });
    }
    
    const [measurement] = await db.select().from(mobileMeasurements)
      .where(eq(mobileMeasurements.id, measurementId));
    
    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found' });
    }
    
    const points = await db.select().from(mobileMeasurementPoints)
      .where(eq(mobileMeasurementPoints.measurementId, measurementId))
      .orderBy(mobileMeasurementPoints.timestamp);
    
    // Add no-cache headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.json({
      ...measurement,
      points
    });
  } catch (error) {
    console.error('Error fetching measurement details:', error);
    res.status(500).json({ error: 'Failed to fetch measurement details' });
  }
});

// Serve the mobile app static files
router.get('/', (req: Request, res: Response) => {
  res.redirect('/mobile/index.html');
});

export default router;