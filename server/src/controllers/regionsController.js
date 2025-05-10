const pool = require('../config/db');

exports.getRegionsByCountry = (req, res) => {
    const { country } = req.query;

    const query = `
        SELECT DISTINCT Region
        FROM SkiArea
        WHERE Country = ?
        AND Region IS NOT NULL
        ORDER BY Region
    `;

    pool.query(query, [country], (err, results) => {
        if (err) {
            console.error("DB error in getRegionsByCountry:", err);
            return res.status(500).json({ error: "Database error" });
        }

        // Return an empty array if no regions found (totally valid)
        res.json(results.map(row => row.Region));
    });
};