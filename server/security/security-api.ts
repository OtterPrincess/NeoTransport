import { Router, Request, Response } from 'express';
import { db } from '../db';
import { 
  ipActivity, 
  botThreatDetection, 
  ipWatchlist,
  securityAuditLog
} from '@shared/schema';
import { eq, desc, and, count, sql, gte, lte } from 'drizzle-orm';

const router = Router();

// Authentication middleware - restricted to admins only
const requireAdmin = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const user = req.user as any;
  if (!user || (user.role !== 'admin' && user.role !== 'director')) {
    return res.status(403).json({ error: 'Access denied. Admin privileges required' });
  }
  
  next();
};

// Apply admin-only authentication to all security routes
router.use(requireAdmin);

// Get security dashboard summary statistics
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);
    
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    
    // Get total count of requests in past 24 hours
    const [dailyRequestCount] = await db
      .select({ count: count() })
      .from(ipActivity)
      .where(gte(ipActivity.timestamp, oneDayAgo));
      
    // Get count of unique IPs in past 24 hours
    const uniqueIps = await db
      .select({ ip: ipActivity.ipAddress })
      .from(ipActivity)
      .where(gte(ipActivity.timestamp, oneDayAgo))
      .groupBy(ipActivity.ipAddress);
      
    // Get count of threats by severity
    const threats = await db
      .select({
        severity: botThreatDetection.threatSeverity,
        count: count()
      })
      .from(botThreatDetection)
      .where(gte(botThreatDetection.timestamp, oneWeekAgo))
      .groupBy(botThreatDetection.threatSeverity);
      
    // Get count of currently active blocks
    const [blockedCount] = await db
      .select({ count: count() })
      .from(ipWatchlist)
      .where(
        and(
          eq(ipWatchlist.isActive, true),
          sql`${ipWatchlist.expiresAt} IS NULL OR ${ipWatchlist.expiresAt} > NOW()`
        )
      );
      
    // Transform threat data into object
    const threatsByLevel = {
      none: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    
    threats.forEach(threat => {
      threatsByLevel[threat.severity as keyof typeof threatsByLevel] = threat.count;
    });
    
    res.json({
      requestsLast24h: dailyRequestCount.count,
      uniqueIpsLast24h: uniqueIps.length,
      threatsByLevel,
      activeBlocks: blockedCount.count
    });
  } catch (error) {
    console.error('Error getting security summary:', error);
    res.status(500).json({ error: 'Failed to fetch security summary' });
  }
});

// Get recent threat detections
router.get('/threats', async (req: Request, res: Response) => {
  try {
    const { severity, timeframe } = req.query;
    
    // Default to 7 days if no timeframe provided
    const days = timeframe ? parseInt(timeframe as string) : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    let query = db
      .select()
      .from(botThreatDetection)
      .where(gte(botThreatDetection.timestamp, startDate))
      .orderBy(desc(botThreatDetection.timestamp))
      .limit(100);
    
    // Filter by severity if provided
    if (severity) {
      query = query.where(eq(botThreatDetection.threatSeverity, severity as string));
    }
    
    const threats = await query;
    res.json(threats);
  } catch (error) {
    console.error('Error getting threat detections:', error);
    res.status(500).json({ error: 'Failed to fetch threat detections' });
  }
});

// Get IP watchlist entries
router.get('/watchlist', async (req: Request, res: Response) => {
  try {
    const watchlist = await db
      .select()
      .from(ipWatchlist)
      .orderBy(desc(ipWatchlist.addedAt));
    
    res.json(watchlist);
  } catch (error) {
    console.error('Error getting IP watchlist:', error);
    res.status(500).json({ error: 'Failed to fetch IP watchlist' });
  }
});

// Add IP to watchlist
router.post('/watchlist', async (req: Request, res: Response) => {
  try {
    const { ipAddress, reason, threatSeverity, expiresAt, notes } = req.body;
    
    if (!ipAddress || !reason || !threatSeverity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const user = req.user as any;
    
    const [entry] = await db.insert(ipWatchlist).values({
      ipAddress,
      reason,
      threatSeverity,
      addedBy: user.id,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      notes,
      isActive: true
    }).returning();
    
    // Log this security action
    await db.insert(securityAuditLog).values({
      userId: user.id,
      action: 'add_to_watchlist',
      details: JSON.stringify({ ipAddress, threatSeverity }),
      ipAddress: req.ip || 'unknown',
      affectedResource: ipAddress
    });
    
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error adding to IP watchlist:', error);
    res.status(500).json({ error: 'Failed to add IP to watchlist' });
  }
});

// Update IP watchlist entry
router.patch('/watchlist/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { isActive, threatSeverity, reason, notes, expiresAt } = req.body;
    
    const [updatedEntry] = await db
      .update(ipWatchlist)
      .set({
        isActive: isActive,
        threatSeverity: threatSeverity,
        reason: reason,
        notes: notes,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined
      })
      .where(eq(ipWatchlist.id, id))
      .returning();
    
    if (!updatedEntry) {
      return res.status(404).json({ error: 'Watchlist entry not found' });
    }
    
    // Log this security action
    const user = req.user as any;
    await db.insert(securityAuditLog).values({
      userId: user.id,
      action: 'update_watchlist',
      details: JSON.stringify({ id, changes: req.body }),
      ipAddress: req.ip || 'unknown',
      affectedResource: updatedEntry.ipAddress
    });
    
    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating IP watchlist:', error);
    res.status(500).json({ error: 'Failed to update IP watchlist entry' });
  }
});

// Get activity for a specific IP
router.get('/ip/:ipAddress', async (req: Request, res: Response) => {
  try {
    const { ipAddress } = req.params;
    const { days } = req.query;
    
    // Default to 7 days of data
    const dayCount = days ? parseInt(days as string) : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dayCount);
    
    const activities = await db
      .select()
      .from(ipActivity)
      .where(
        and(
          eq(ipActivity.ipAddress, ipAddress),
          gte(ipActivity.timestamp, startDate)
        )
      )
      .orderBy(desc(ipActivity.timestamp))
      .limit(200);
    
    // Get threat detections for this IP
    const threats = await db
      .select()
      .from(botThreatDetection)
      .where(
        and(
          eq(botThreatDetection.ipAddress, ipAddress),
          gte(botThreatDetection.timestamp, startDate)
        )
      )
      .orderBy(desc(botThreatDetection.timestamp));
    
    // Get watchlist status
    const [watchlistEntry] = await db
      .select()
      .from(ipWatchlist)
      .where(eq(ipWatchlist.ipAddress, ipAddress));
    
    res.json({
      activities,
      threats,
      watchlistEntry
    });
  } catch (error) {
    console.error('Error getting IP details:', error);
    res.status(500).json({ error: 'Failed to fetch IP details' });
  }
});

// Get request patterns (for charts)
router.get('/analytics/traffic-patterns', async (req: Request, res: Response) => {
  try {
    const { timeframe } = req.query;
    
    // Default to 24 hours if no timeframe provided
    const hours = timeframe ? parseInt(timeframe as string) : 24;
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);
    
    // Generate time buckets for the chart
    const buckets = [];
    for (let i = 0; i < hours; i++) {
      const bucketStart = new Date(startDate);
      bucketStart.setHours(bucketStart.getHours() + i);
      
      const bucketEnd = new Date(bucketStart);
      bucketEnd.setHours(bucketEnd.getHours() + 1);
      
      // Get request count for this hour
      const [{ count: requestCount }] = await db
        .select({ count: count() })
        .from(ipActivity)
        .where(
          and(
            gte(ipActivity.timestamp, bucketStart),
            lte(ipActivity.timestamp, bucketEnd)
          )
        );
      
      // Get threat count for this hour
      const [{ count: threatCount }] = await db
        .select({ count: count() })
        .from(botThreatDetection)
        .where(
          and(
            gte(botThreatDetection.timestamp, bucketStart),
            lte(botThreatDetection.timestamp, bucketEnd)
          )
        );
      
      buckets.push({
        hour: bucketStart.toISOString(),
        displayHour: bucketStart.getHours(),
        requests: requestCount,
        threats: threatCount
      });
    }
    
    res.json(buckets);
  } catch (error) {
    console.error('Error getting traffic patterns:', error);
    res.status(500).json({ error: 'Failed to fetch traffic patterns' });
  }
});

// Get security audit logs
router.get('/audit-logs', async (req: Request, res: Response) => {
  try {
    const { days } = req.query;
    
    // Default to 30 days of logs
    const dayCount = days ? parseInt(days as string) : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dayCount);
    
    const logs = await db
      .select()
      .from(securityAuditLog)
      .where(gte(securityAuditLog.timestamp, startDate))
      .orderBy(desc(securityAuditLog.timestamp))
      .limit(100);
    
    res.json(logs);
  } catch (error) {
    console.error('Error getting audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

export default router;