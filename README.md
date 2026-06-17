# Slope Search
A web application allowing users to search, filter, and favorite ski resorts around the world. Using data from openskimap.org.

Visit the live deployment at [slope-search.gvonb.dev](https://slope-search.gvonb.dev/)

## Architecture

Three pieces:

- **client/** — React + Vite frontend (served with `vite preview`)
- **server/** — Express API (`/api/...`) backed by MySQL
- **MySQL** — schema + data are created automatically on the server's first boot

The cleaned dataset ships in the repo (`server/seed/*.ndjson.gz`). On startup the
server creates the tables and bulk-loads the seed **only if the database is empty**, so
there is no manual SQL step and restarts don't re-import. No `LOAD DATA INFILE`, no
notebook required to run the app.

## Run locally (Docker)

Prerequisite: [Docker](https://www.docker.com/).

1. Create a root `.env`:
   ```bash
   MYSQL_ROOT_PASSWORD=password
   MYSQL_DATABASE=slope_search
   ```
2. Start everything:
   ```bash
   docker compose up --build
   ```
   The server waits for MySQL, seeds it on first boot (watch the logs for
   `Seed: loading data...` → `Seed: done.`), then starts serving.
3. Open [http://localhost:4173](http://localhost:4173).

To re-seed from scratch, drop the volume first: `docker compose down -v`.

## Run locally (without Docker)

You need a running MySQL instance and an empty database matching `server/.env`.

```bash
# server/.env
DB_HOST=localhost
DB_USER=your_user
DB_PASS=your_password
DB_NAME=slope_search
PORT=3000
```

```bash
# Terminal 1 - backend (creates schema + seeds on first run)
cd server && npm install && npm run dev
```
```bash
# Terminal 2 - frontend (uses the Vite dev proxy to reach the backend)
cd client && npm install && npm run dev
```

## Deploy on Railway (3 services)

Create a Railway project with three services:

1. **MySQL** — add the Railway MySQL plugin. Note its connection variables.
2. **Backend** — deploy from this repo with **root directory `server`** (uses
   `server/Dockerfile`). Set variables:
   | Variable | Value |
   |---|---|
   | `DB_HOST` / `DB_USER` / `DB_PASS` / `DB_NAME` | from the MySQL plugin |
   | `DB_SSL` | `true` only if your MySQL requires TLS |
   | `CLIENT_ORIGIN` | the frontend's public URL (for CORS) |
   | `PORT` | provided by Railway automatically |

   The backend seeds the database on its first successful boot.
3. **Frontend** — deploy from this repo with **root directory `client`** (uses
   `client/Dockerfile`). Set:
   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | the backend's public URL, e.g. `https://your-backend.up.railway.app` |

   `VITE_API_URL` is inlined at build time, so a change requires a rebuild.

## Regenerating the seed data

Only needed when the upstream OpenSkiMap data changes — deployers never run this.

1. Download `ski_areas.csv` and `runs.csv` from the about page on
   [openskimap.org](https://openskimap.org/?about#) into `notebook/data/`.
2. Install Python deps (`pip install -r notebook/requirements.txt`).
3. Regenerate and commit:
   ```bash
   python scripts/clean_data.py        # writes server/seed/*.ndjson.gz
   git add server/seed && git commit -m "Update seed data"
   ```
