import 'dotenv/config';

export default {
  schema: './src/models/*.js', // path to all the Modles
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
