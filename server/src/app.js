const express = require('express');
const cors = require('cors');
const skiAreaRoutes = require('./routes/skiAreaRoutes');
const runRoutes = require('./routes/runRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const userRoutes = require('./routes/userRoutes');
const regionRoutes = require('./routes/regionRoutes');
require('dotenv').config();

const app = express();
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://slope-search.gvonb.dev'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true, // optional: if you're using cookies/auth
}));

const port = process.env.PORT || 3000;

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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});