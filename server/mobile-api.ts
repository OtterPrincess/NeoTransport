import { Router, Request, Response } from 'express';
import { db } from './db';
import { 
  mobileMeasurements, 
  mobileMeasurementPoints, 
  insertMobileMeasurementSchema 
} from '../shared/schema';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';

const router = Router();

// Schema for validating incoming measurement data
const mobileMeasurementDataSchema = z.object({
  deviceId: z.string(),
  sessionId: z.string(),
  startTime: z.string().datetime(),
  duration: z.number().int().positive(),
  peakVibration: z.number().positive(),
  averageVibration: z.number().positive(),
  readings: z.array(z.object({
    timestamp: z.number(),
    x: z.number(),
    y: z.number(),
    z: z.number(),
    total: z.number()
  })).min(1),
  unitId: z.number().optional()
});

type MobileMeasurementData = z.infer<typeof mobileMeasurementDataSchema>;

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
    
    // Insert the main measurement record
    const [measurement] = await db.insert(mobileMeasurements).values({
      deviceId: data.deviceId,
      sessionId: data.sessionId,
      startTime: new Date(data.startTime),
      duration: data.duration,
      peakVibration: data.peakVibration,
      averageVibration: data.averageVibration,
      unitId: data.unitId || null,
      metadata: req.body.metadata || null,
    }).returning();
    
    // Insert all the measurement points
    if (data.readings && data.readings.length > 0) {
      const points = data.readings.map(reading => ({
        measurementId: measurement.id,
        timestamp: new Date(reading.timestamp),
        x: reading.x,
        y: reading.y,
        z: reading.z,
        total: reading.total
      }));
      
      await db.insert(mobileMeasurementPoints).values(points);
    }
    
    res.status(201).json({
      success: true,
      measurementId: measurement.id,
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

// GET /api/mobile/measurements - Get list of measurements
router.get('/measurements', async (req: Request, res: Response) => {
  try {
    const measurements = await db.select().from(mobileMeasurements)
      .orderBy(desc(mobileMeasurements.timestamp))
      .limit(50);
    
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