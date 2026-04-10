import jwt from 'jsonwebtoken';
import logger from '#config/logger.js';

const JWT_SECRET =
  process.env.JWT_SECRET || 'plase add your token to the env variable ';
const EXPIRES_IN = '1d';

export const jwttoken = {
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
    } catch (e) {
      logger.error(`Failed to Sign-in JWT token ${e}`);
      throw new Error('Failed to Sign-in JWT token ', {cause:e});
    }
  },
  verify: token => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      logger('Failed to Sign-in JWT token ', e);
      throw new Error('Failed to Sign-in JWT token ', {cause:e});
    }
  },
};
