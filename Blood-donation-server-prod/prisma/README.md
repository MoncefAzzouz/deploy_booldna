# Database Setup

## Prerequisites

- **Docker** installed and running
- **Node.js** 18+ with npm

## 1. Start MariaDB with Docker

```bash
docker run -d \
  --name blood-mariadb \
  -e MYSQL_ROOT_PASSWORD=blood123 \
  -e MYSQL_DATABASE=blood_donation \
  -e MYSQL_USER=blood_user \
  -e MYSQL_PASSWORD=blood_pass \
  -p 3306:3306 \
  mariadb:latest
```

Wait a few seconds for the container to be ready, then verify:

```bash
docker exec blood-mariadb mariadb -ublood_user -pblood_pass -e "SELECT 1" blood_donation
```

## 2. Configure Environment Variables

Create a `.env` file at the project root with these database variables:

```env
DATABASE_URL=mysql://blood_user:blood_pass@localhost:3306/blood_donation

DB_HOST=localhost
DB_PORT=3306
DB_USER=blood_user
DB_PASSWORD=blood_pass
DB_NAME=blood_donation
DB_CONNECTION_LIMIT=5
```

> `DATABASE_URL` is used by the Prisma CLI (migrations, db push).
> `DB_*` variables are used by the app at runtime via the MariaDB adapter.

## 3. Generate Prisma Client

```bash
npx prisma generate
```

This outputs the client to `../generated/prisma/` (configured in `schema.prisma`).

## 4. Push Schema to Database

```bash
npx prisma db push
```

This creates all tables based on `schema.prisma` without creating migration files.

## 5. Seed Test Data

```bash
docker exec -i blood-mariadb mariadb -ublood_user -pblood_pass blood_donation < prisma/seed.sql
```

### Seed Data Contents

| Table | Records | Details |
|-------|---------|---------|
| admins | 2 | Super admin (def@gmail.com / def123), Ilhem (ilhem@gmail.com / ilhem123) |
| users | 15 | Donors across all 8 blood types, all verified |
| hospitals | 8 | CHU Setif, EPH El Eulma, Ain Azel, CHU Constantine, EPH BBA, CHU Batna, Clinique Es-Salem, EPH Ain Oulmene |
| blood_alerts | 10 | 8 active + 2 recovered, mixed urgency levels |
| donations | 17 | 9 confirmed, 7 planned, 1 cancelled |
| user_blood_alert | 15 | Links between donors and matching alerts |
| notifications | 21 | 15 alert + 3 reminder + 3 info |

## DataGrip / GUI Connection

| Field | Value |
|-------|-------|
| Host | `localhost` |
| Port | `3306` |
| User | `blood_user` |
| Password | `blood_pass` |
| Database | `blood_donation` |
| Driver | MariaDB or MySQL |

## Common Commands

```bash
# Stop the database
docker stop blood-mariadb

# Start it again
docker start blood-mariadb

# Reset everything (delete container + data)
docker rm -f blood-mariadb

# View tables
docker exec blood-mariadb mariadb -ublood_user -pblood_pass blood_donation -e "SHOW TABLES;"

# Open interactive SQL shell
docker exec -it blood-mariadb mariadb -ublood_user -pblood_pass blood_donation
```

## Schema Overview

```
users ──────────┬── donations ──── blood_alerts ──── hospitals
                │                        │
                ├── user_blood_alert ─────┘
                ├── notifications
                └── audit_logs

admins ─────────┬── blood_alerts (created_by)
                ├── donations (approved_by)
                └── audit_logs

Standalone: questionnaires (not linked yet)
```

See `schema.prisma` for full model definitions.
