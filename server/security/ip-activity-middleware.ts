import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { 
  ipActivity, 
  botThreatDetection, 
  ipWatchlist,
  ipGeoData
} from '@shared/schema';
import { eq, and, gte, count, sql } from 'drizzle-orm';

// Get client IP address from request
const getIpAddress = (req: Request): string => {
  return req.ip || 
    req.headers['x-forwarded-for'] as string || 
    req.socket.remoteAddress || 
    'unknown';
};

// Track IP activity and analyze for potential threats
export const trackIpActivity = async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Capture request data
  const ipAddress = getIpAddress(req);
  const requestPath = req.originalUrl || req.url;
  const requestMethod = req.method;
  const userAgent = req.headers['user-agent'] || '';
  const referer = req.headers['referer'] || '';
  // Safely check if authenticated function exists (in case middleware runs before auth setup)
  const userId = typeof req.isAuthenticated === 'function' ? 
    (req.isAuthenticated() ? (req.user as any)?.id : null) : null;
  const sessionId = (req as any).sessionID || '';
  const requestPayloadSize = req.headers['content-length'] ? parseInt(req.headers['content-length'] as string) : 0;
  
  // Store headers as JSON for analysis
  const relevantHeaders = JSON.stringify({
    'user-agent': req.headers['user-agent'],
    'accept': req.headers['accept'],
    'accept-language': req.headers['accept-language'],
    'accept-encoding': req.headers['accept-encoding'],
    'connection': req.headers['connection'],
    'cache-control': req.headers['cache-control'],
    'sec-fetch-dest': req.headers['sec-fetch-dest'],
    'sec-fetch-mode': req.headers['sec-fetch-mode'],
    'sec-fetch-site': req.headers['sec-fetch-site'],
    'sec-fetch-user': req.headers['sec-fetch-user'],
    'sec-ch-ua': req.headers['sec-ch-ua'],
    'sec-ch-ua-mobile': req.headers['sec-ch-ua-mobile'],
  });

  // Capture original end method to track response
  const originalEnd = res.end;
  let responseBody = '';
  let responseSize = 0;

  // Override end method to capture response data
  res.end = function(chunk: any, ...args: any[]) {
    if (chunk) {
      responseBody += chunk;
      responseSize += chunk.length;
    }
    
    // Calculate response time
    const responseTime = Date.now() - startTime;
    
    // Log IP activity asynchronously to not block the response
    setTimeout(async () => {
      try {
        // Insert IP activity record
        const [activity] = await db.insert(ipActivity).values({
          ipAddress,
          userId,
          requestPath,
          requestMethod,
          userAgent,
          referer,
          responseStatus: res.statusCode,
          responseTime,
          requestPayloadSize,
          responseSize,
          requestHeaders: relevantHeaders,
          sessionId
        }).returning();
        
        // Analyze for threat detection
        await analyzeThreatBehavior(ipAddress, activity.id);
      } catch (error) {
        console.error('Error tracking IP activity:', error);
      }
    }, 0);
    
    // Call original end method
    return originalEnd.apply(res, [chunk, ...args]);
  };
  
  // Check if IP is on watchlist before proceeding
  try {
    // Check if IP is on watchlist and blocked
    const [watchlistEntry] = await db
      .select()
      .from(ipWatchlist)
      .where(
        and(
          eq(ipWatchlist.ipAddress, ipAddress),
          eq(ipWatchlist.isActive, true),
          sql`${ipWatchlist.expiresAt} IS NULL OR ${ipWatchlist.expiresAt} > NOW()`
        )
      );
    
    if (watchlistEntry) {
      // IP is on watchlist - check if it should be blocked
      if (watchlistEntry.threatSeverity === 'high' || watchlistEntry.threatSeverity === 'critical') {
        // Block with 403 Forbidden for high/critical threats
        return res.status(403).json({
          error: 'Access denied',
          message: 'Your IP address has been blocked due to suspicious activity.'
        });
      }
      
      // For medium threats, add rate limiting
      if (watchlistEntry.threatSeverity === 'medium') {
        // Check recent activity count
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        const [{ requestCount }] = await db
          .select({ requestCount: count() })
          .from(ipActivity)
          .where(
            and(
              eq(ipActivity.ipAddress, ipAddress),
              gte(ipActivity.timestamp, oneDayAgo)
            )
          );
        
        // If too many requests, apply rate limiting
        if (requestCount > 200) { // Threshold can be adjusted
          return res.status(429).json({
            error: 'Too many requests',
            message: 'You have exceeded the allowed number of requests in a 24-hour period.'
          });
        }
      }
    }
  } catch (error) {
    console.error('Error checking IP watchlist:', error);
  }
  
  next();
};

// Analyze IP for potential threat behavior
async function analyzeThreatBehavior(ipAddress: string, activityId: number) {
  try {
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
    
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    // Get request counts
    const [minuteStats] = await db
      .select({ count: count() })
      .from(ipActivity)
      .where(
        and(
          eq(ipActivity.ipAddress, ipAddress),
          gte(ipActivity.timestamp, oneMinuteAgo)
        )
      );
    
    const [hourStats] = await db
      .select({ count: count() })
      .from(ipActivity)
      .where(
        and(
          eq(ipActivity.ipAddress, ipAddress),
          gte(ipActivity.timestamp, oneHourAgo)
        )
      );
    
    // Count unique paths accessed in last hour
    const uniquePaths = await db
      .select({ path: ipActivity.requestPath })
      .from(ipActivity)
      .where(
        and(
          eq(ipActivity.ipAddress, ipAddress),
          gte(ipActivity.timestamp, oneHourAgo)
        )
      )
      .groupBy(ipActivity.requestPath);
    
    const requestsPerMinute = minuteStats.count;
    const requestsPerHour = hourStats.count;
    const uniquePathsAccessed = uniquePaths.length;
    
    // Calculate threat score
    let threatScore = 0;
    let threatSeverity: "none" | "low" | "medium" | "high" | "critical" = "none";
    
    // Request frequency analysis
    if (requestsPerMinute > 30) threatScore += 20;
    else if (requestsPerMinute > 15) threatScore += 10;
    else if (requestsPerMinute > 5) threatScore += 5;
    
    if (requestsPerHour > 300) threatScore += 30;
    else if (requestsPerHour > 100) threatScore += 20;
    else if (requestsPerHour > 50) threatScore += 10;
    
    // Check recent failed login attempts
    const [loginFailures] = await db
      .select({ count: count() })
      .from(ipActivity)
      .where(
        and(
          eq(ipActivity.ipAddress, ipAddress),
          eq(ipActivity.requestPath, '/api/login'),
          eq(ipActivity.responseStatus, 401),
          gte(ipActivity.timestamp, oneHourAgo)
        )
      );
    
    const failedLoginAttempts = loginFailures.count;
    
    if (failedLoginAttempts > 10) threatScore += 40;
    else if (failedLoginAttempts > 5) threatScore += 20;
    else if (failedLoginAttempts > 2) threatScore += 10;
    
    // Access pattern analysis
    let hasAbnormalTiming = false;
    
    if (uniquePathsAccessed > 20 && requestsPerMinute > 10) {
      hasAbnormalTiming = true;
      threatScore += 15;
    }
    
    // Determine threat severity based on score
    if (threatScore >= 70) threatSeverity = "critical";
    else if (threatScore >= 50) threatSeverity = "high";
    else if (threatScore >= 30) threatSeverity = "medium";
    else if (threatScore >= 10) threatSeverity = "low";
    
    // Determine action to take
    let actionTaken = "monitored";
    let isBlocked = false;
    let blockExpiration: Date | null = null;
    
    if (threatSeverity === "critical") {
      actionTaken = "blocked";
      isBlocked = true;
      blockExpiration = new Date();
      blockExpiration.setDate(blockExpiration.getDate() + 7); // Block for 7 days
      
      // Add to watchlist automatically for critical threats
      await db.insert(ipWatchlist).values({
        ipAddress,
        reason: "Automatic block due to critical threat score",
        threatSeverity,
        notes: `Automatically added by system. Threat score: ${threatScore}`,
        isActive: true,
        expiresAt: blockExpiration
      }).onConflictDoUpdate({
        target: ipWatchlist.ipAddress,
        set: {
          threatSeverity,
          isActive: true,
          expiresAt: blockExpiration
        }
      });
    } 
    else if (threatSeverity === "high") {
      actionTaken = "rate-limited";
      isBlocked = false;
    }
    
    // Record threat detection
    await db.insert(botThreatDetection).values({
      ipAddress,
      requestsPerMinute,
      requestsPerHour,
      uniquePathsAccessed,
      hasAbnormalTiming,
      failedLoginAttempts,
      threatScore,
      threatSeverity,
      actionTaken,
      isBlocked,
      blockExpiration,
      analysisNotes: `Auto analysis: RPM=${requestsPerMinute}, RPH=${requestsPerHour}, uniquePaths=${uniquePathsAccessed}`
    });
  } catch (error) {
    console.error('Error analyzing threat behavior:', error);
  }
}

// This middleware should be added to the Express app in index.ts right after session setup
// app.use(trackIpActivity);