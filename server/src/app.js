const express = require('express');
const skiAreaRoutes = require('./routes/skiAreaRoutes');
const runRoutes = require('./routes/runRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/api/ski-areas', skiAreaRoutes);

app.use('/api/runs', runRoutes);

app.use('/api/favorites', favoritesRoutes);

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Ski API is running!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});