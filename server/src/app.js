const express = require('express');
const skiAreaRoutes = require('./routes/skiAreaRoutes');
const skiAreaNameRoutes = require('./routes/skiAreaNameRoutes');
const runRoutes = require('./routes/runRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/api/ski-areas', skiAreaRoutes);

app.use('/api/runs', runRoutes);

app.get('/', (req, res) => {
    res.send('Ski API is running!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});