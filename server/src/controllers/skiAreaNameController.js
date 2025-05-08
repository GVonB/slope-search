const pool = require('../config/db');

exports.getNamesBySkiAreaId = (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT Name AS name
        FROM SkiAreaName
        WHERE SkiAreaID = ?
    `;

    pool.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed'})
        res.json(results);
    });
};