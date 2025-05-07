const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', (req, res) => {
    pool.query('SELECT * FROM SkiArea', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed'});
        res.json(results);
    });
});

module.exports = router;