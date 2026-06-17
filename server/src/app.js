const express = require('express');
const skiAreaRoutes = require('./routes/skiAreaRoutes');
const runRoutes = require('./routes/runRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const userRoutes = require('./routes/userRoutes');
const regionRoutes = require('./routes/regionRoutes');
const runSeed = require('./seed');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// CORS: allow the deployed frontend (CLIENT_ORIGIN), or any origin in dev.
const clientOrigin = process.env.CLIENT_ORIGIN || '*';
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', clientOrigin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

app.use(express.json());

app.use('/api/ski-areas', skiAreaRoutes);

app.use('/api/runs', runRoutes);

app.use('/api/favorites', favoritesRoutes);

app.use('/api/users', userRoutes);

app.use('/api/regions', regionRoutes);

app.get('/', (req, res) => {
    res.send('Ski API is running!');
});

// If no other routes match
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Seed the database on first boot (idempotent), then start serving.
runSeed()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to seed database, not starting server:', err);
        process.exit(1);
    });