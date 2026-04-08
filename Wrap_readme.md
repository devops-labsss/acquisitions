# Acquisitions service Docker + Neon setup
This project is configured to use:
- Neon Local (Docker proxy) in development
- Neon Cloud directly in production

## Files added
- `Dockerfile`
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`
- `.env.development`
- `.env.production`

## 1) Development (Neon Local proxy + ephemeral branches)
Neon Local runs as a sidecar service and your app connects to:
- `postgres://neon:npg@neon-local:5432/neondb`

`neondatabase/neon_local` creates ephemeral branches by default when the container starts, and deletes them when it stops (`DELETE_BRANCH=true` by default).  
If you set `PARENT_BRANCH_ID`, ephemeral branches are created from that parent branch.

### Configure development env
Edit `.env.development` and set:
- `NEON_API_KEY`
- `NEON_PROJECT_ID`
- Optional: `PARENT_BRANCH_ID`

### Start development stack
```bash
docker compose -f docker-compose.dev.yml up --build
```

### Stop development stack
```bash
docker compose -f docker-compose.dev.yml down
```

## 2) Production (Neon Cloud URL, no Neon Local proxy)
Production uses only the app container. The database is external Neon Cloud, provided via `DATABASE_URL`.

### Configure production env
Edit `.env.production` and set:
- `DATABASE_URL=postgres://...neon.tech...`
- any additional runtime secrets as environment variables

### Start production stack
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### Stop production stack
```bash
docker compose -f docker-compose.prod.yml down
```

## 3) How DATABASE_URL switches between environments
- Development (`.env.development`):  
  `DATABASE_URL=postgres://neon:npg@neon-local:5432/neondb`
- Production (`.env.production`):  
  `DATABASE_URL=postgres://<user>:<password>@<project-endpoint>.neon.tech/neondb?sslmode=require`

The app reads `DATABASE_URL` from environment variables. No database URLs are hardcoded in app logic.

## 4) Driver behavior in code
`src/config/database.js` now does this:
- In non-production: points the Neon serverless driver to Neon Local HTTP endpoint (`http://neon-local:5432/sql`)
- In production: uses standard Neon Cloud behavior with your production `DATABASE_URL`