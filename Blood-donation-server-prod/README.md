# Blood Donation — Server

Express 5 + Prisma 6 + TypeScript backend for the blood-donation admin and donor apps.

## Stack
- **Runtime:** Node.js ≥ 18, ESM (`"type": "module"`)
- **Framework:** Express 5
- **ORM:** Prisma 6 (MySQL provider, runs against MariaDB)
- **Auth:** JWT
- **Validation:** Zod
- **Mail:** Nodemailer + Resend

## Layout
```
src/
  app.ts             # entry — boots Express, mounts /api/v1/* routes
  config/            # env validation (Zod), Prisma client singleton
  controllers/       # thin async wrappers, returning data to be serialized
  services/          # business logic; calls Prisma, throws AppError
  validations/       # Zod schemas for request bodies
  middleware/        # auth (authenticateUser, authenticateAdmin, requireSuperAdmin)
  routers/           # Express routers; one per resource
  templates/         # email HTML templates
  utils/             # asyncHandler, AppError, etc.
prisma/
  schema.prisma      # source of truth for all models
  seed.sql           # populates test data (8 hospitals, 15 donors, 10 alerts, ...)
  README.md          # local DB setup
docs/
  IMPLEMENTATION_SUMMARY.md   # questionnaire feature notes
API_DOCUMENTATION.md          # active API reference
```

## Quick start

1. **Start a database.** The fastest path is the MariaDB Docker image — see [`prisma/README.md`](prisma/README.md) for the full `docker run` command.

2. **Configure env.** Copy the variables below into `.env`:
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL="mysql://blood_user:blood_pass@localhost:3306/blood_donation"
   JWT_SECRET="something-long-and-random"
   RESEND_API_KEy="re_..."        # note the lowercase y — that's how src/config/env.ts spells it
   CLIENT_URL="http://localhost:5173"
   EMAIL_USER="..."
   EMAIL_PASS="..."
   ```

3. **Install + sync schema + seed:**
   ```bash
   npm install
   npx prisma generate
   npx prisma db push        # creates tables; no migration files
   docker exec -i blood-mariadb mariadb -ublood_user -pblood_pass blood_donation < prisma/seed.sql
   ```

4. **Run:**
   ```bash
   npm run dev               # tsx --watch on src/app.ts, port 3000
   curl http://localhost:3000/health
   ```

## Seeded admin credentials
| Email | Password | Role |
|---|---|---|
| `ilhem@gmail.com` | `ilhem123` | super_admin |
| `def@gmail.com` | `def123` | super_admin |

A boot-time `createSuperAdmin()` in `src/utils/initAdmin.ts` also creates `contact@bloodna.com / testg123£` if no super_admin exists yet.

## Scripts
- `npm run dev` — `tsx --watch src/app.ts`
- `npm run build` — `tsc` → `dist/`
- `npm start` — `node dist/app.js`

## API
All routes live under `/api/v1/*`. See [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md) for the full endpoint reference.

Quick smoke test:
```bash
curl http://localhost:3000/health
curl -X POST http://localhost:3000/api/v1/admins/cts/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ilhem@gmail.com","password":"ilhem123"}'
```
