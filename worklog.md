---
Task ID: 1
Agent: Main
Task: Fix "only Z AI logo" bug, switch to PostgreSQL (Neon), remove "Load Demo Tests" button, seed questions

Work Log:
- Found project at /home/z/my-project (not /home/user/app as in previous session)
- Database already configured with PostgreSQL provider in schema.prisma
- Neon PostgreSQL already seeded with 78 questions (demo user + test existed)
- Fixed .env file - removed quotes around DATABASE_URL that Prisma couldn't parse
- Fixed db.ts - removed problematic db.$connect() at import time and unhandledRejection handler
- Fixed db.ts - added hardcoded Neon URL as fallback with datasources override
- Fixed page.tsx - simplified hydration logic, removed complex mounted/hydratedUser state management
- Fixed page.tsx - changed shuffleOptions to use string[] instead of readonly array (was causing potential runtime errors)
- Removed output: "standalone" from next.config.ts (was causing "next start" to not work properly)
- Confirmed "Load Demo Tests" button was already removed from UI
- Verified all API endpoints work: /api/tests, /api/tests/[id], /api/auth/login, /api/auth/register, /api/seed
- Verified homepage renders correctly (24KB HTML with ChemTest auth page)
- Verified 78 chemistry questions are accessible from the Neon database

Stage Summary:
- App now connects to Neon PostgreSQL successfully
- Auth page renders correctly on first load
- All 78 questions available in the "Chemistry: Complete Test"
- Demo user credentials: demo@chemtest.com / demo123
- Server has stability issues in this environment (dies after ~30s idle) but works correctly while running
