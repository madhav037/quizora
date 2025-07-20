interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

export function rateLimit(config: RateLimitConfig) {
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    // Clean up old entries
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < windowStart) {
        delete store[key];
      }
    });
    
    if (!store[identifier]) {
      store[identifier] = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      return true;
    }
    
    if (store[identifier].resetTime < now) {
      store[identifier] = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      return true;
    }
    
    if (store[identifier].count >= config.maxRequests) {
      return false;
    }
    
    store[identifier].count++;
    return true;
  };
}

// Common rate limit configurations
export const rateLimits = {
  auth: rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 }), // 5 requests per 15 minutes
  api: rateLimit({ windowMs: 60 * 1000, maxRequests: 100 }), // 100 requests per minute
  quiz: rateLimit({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 quiz creations per minute
};