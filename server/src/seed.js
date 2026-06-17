const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const mysql = require('mysql2/promise');

const SQL_DIR = path.join(__dirname, '..', 'sql');
const SEED_DIR = path.join(__dirname, '..', 'seed');
const BATCH = 5000;

// Seed files in FK-safe load order: parents before children.
// Columns must match createTables.sql and scripts/clean_data.py output order.
const TABLES = [
    ['SkiArea', ['SkiAreaID', 'Country', 'Region', 'DownhillDistanceKm', 'VerticalM', 'MinElevationM', 'MaxElevationM', 'LiftCount', 'RunConvention', 'OpenSkiMap', 'Geometry', 'Latitude', 'Longitude'], 'ski_area'],
    ['SkiAreaWebsite', ['SkiAreaID', 'WebsiteURL'], 'ski_area_website'],
    ['SkiAreaName', ['SkiAreaID', 'Name'], 'ski_area_name'],
    ['Run', ['RunID', 'Country', 'Region', 'Difficulty', 'Color', 'Lit', 'InclinedLengthM', 'DescentM', 'AveragePitch', 'MaxPitch', 'MinElevationM', 'MaxElevationM', 'DifficultyConvention', 'OpenSkiMap', 'Geometry', 'Latitude', 'Longitude'], 'run'],
    ['RunName', ['RunID', 'Name'], 'run_name'],
    ['SkiAreaRun', ['RunID', 'SkiAreaID'], 'ski_area_run'],
];

function readRows(name) {
    const buf = zlib.gunzipSync(fs.readFileSync(path.join(SEED_DIR, `${name}.ndjson.gz`)));
    return buf.toString('utf8').split('\n').filter(Boolean).map(JSON.parse);
}

async function loadTable(conn, table, columns, file) {
    const rows = readRows(file);
    const cols = columns.join(', ');
    for (let i = 0; i < rows.length; i += BATCH) {
        await conn.query(`INSERT INTO ${table} (${cols}) VALUES ?`, [rows.slice(i, i + BATCH)]);
    }
    return rows.length;
}

// Wait for the DB to accept connections (it may still be provisioning on first
// deploy). If this still gives up, the process exits and the orchestrator's restart
// policy (Railway's by default; `restart` in docker-compose) relaunches it.
async function connectWithRetry(retries = 90, delayMs = 2000) {
    const config = {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        multipleStatements: true,
        ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
    };
    for (let attempt = 1; ; attempt++) {
        try {
            return await mysql.createConnection(config);
        } catch (err) {
            if (attempt >= retries) throw err;
            console.log(`Seed: DB not ready (${err.code || err.message}), retry ${attempt}/${retries}...`);
            await new Promise((r) => setTimeout(r, delayMs));
        }
    }
}

// Create schema + load seed data on first boot only. Idempotent: if SkiArea already
// has rows we skip entirely, so restarts/redeploys don't double-insert.
async function runSeed() {
    const conn = await connectWithRetry();
    try {
        const [tables] = await conn.query("SHOW TABLES LIKE 'SkiArea'");
        if (tables.length) {
            const [[{ n }]] = await conn.query('SELECT COUNT(*) AS n FROM SkiArea');
            if (n > 0) {
                console.log(`Seed: SkiArea already has ${n} rows, skipping.`);
                return;
            }
        } else {
            console.log('Seed: creating schema...');
            await conn.query(fs.readFileSync(path.join(SQL_DIR, 'createTables.sql'), 'utf8'));
        }

        console.log('Seed: loading data...');
        for (const [table, columns, file] of TABLES) {
            const count = await loadTable(conn, table, columns, file);
            console.log(`  ${table}: ${count} rows`);
        }
        console.log('Seed: done.');
    } finally {
        await conn.end();
    }
}

module.exports = runSeed;

// Allow manual one-off seeding: `node src/seed.js`
if (require.main === module) {
    require('dotenv').config();
    runSeed().then(() => process.exit(0)).catch((err) => {
        console.error('Seed failed:', err);
        process.exit(1);
    });
}
