const express = require('express');
const pool = require('./config/db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Ski API is running!');
});

const skiAreaRoutes = require('./routes/skiAreaRoutes');
app.use('/api/ski-areas', skiAreaRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});