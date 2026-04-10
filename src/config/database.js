import 'dotenv/config';

import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}
const parsedDatabaseUrl = new URL(databaseUrl);
const neonLocalHost = process.env.NEON_LOCAL_HOST || parsedDatabaseUrl.hostname;
const neonLocalPort =
  process.env.NEON_LOCAL_PORT || parsedDatabaseUrl.port || '5432';
const shouldUseNeonLocalProxy =
  process.env.NODE_ENV !== 'production' &&
  ['neon-local', 'localhost', '127.0.0.1'].includes(neonLocalHost);

if (shouldUseNeonLocalProxy) {
  neonConfig.fetchEndpoint = `http://${neonLocalHost}:${neonLocalPort}/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export { sql, db };
