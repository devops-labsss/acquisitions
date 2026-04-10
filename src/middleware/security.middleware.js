import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20;
        message = 'Admin request limit exceeded (20 per minute). Slow down.';
        break;

      case 'user':
        limit = 10;
        message = 'User request limit exceeded (10 per minute). Slow down.';
        break;

      case 'guest':
        limit = 5;
        message = 'Guest request limit exceeded (5 per minute). Slow down.';
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req, {
      // If req.ip is missing, use localhost as a fallback
      ip: req.ip || '127.0.0.1',
    });

    if (decision.isDenied() && decision.reason.isBot()) {
      console.log('Arcjet decision:', decision);
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent: req.get('userAgent'),
        path: req.path,
      });

      return res.status(429).json({
        error: 'Forbidden',
        message,
      });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield blocked request', {
        ip: req.ip,
        userAgent: req.userAgent,
        path: req.path,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by the security policy',
      });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.userAgent,
        path: req.path,
      });

      return res
        .status(403)
        .json({ error: 'Forbidden', message: 'Too many requests' });
    }

    next();
  } catch (e) {
    console.log(`Arcjet MiddleWare Error ${e}`);
    res.status(500).json({
      error: 'Internal Server Error. ',
      message: 'Something went wrong wit the security middleware. ',
    });
  }
};

export default securityMiddleware;
