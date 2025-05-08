const pool = require('../config/db');

exports.getSkiAreas = (req, res) => {
    const { country, region, minVertical, maxVertical, orderBy, sortOrder, userId, favorites, minRunCount, maxRunCount, minMaxPitch } = req.query;

    // Using a SQL alias for each table for simplicity
    let baseQuery = `
        SELECT sa.*, COUNT(r.RunID) AS runCount, 
               MAX(r.AveragePitch) AS maxAverageRunPitch
        FROM SkiArea sa
        LEFT JOIN SkiAreaRun sar ON sa.SkiAreaID = sar.SkiAreaID
        LEFT JOIN Run r ON sar.RunID = r.RunID
        LEFT JOIN SkiAreaName san ON sa.SkiAreaID = san.SkiAreaID
    `;

    const params = [];

    // JOIN favorites if true and userId exists
    if (favorites === 'true' && userId) {
        baseQuery += `
            INNER JOIN Favorites f ON sa.SkiAreaID = f.SkiAreaID AND f.UserID = ?
        `;
        params.push(userId);
    }

    // Doesn't modify returned results by itself
    baseQuery += ' WHERE 1=1';

    if (country) {
        baseQuery += ' AND sa.Country = ?';
        params.push(country);
    }

    if (region) {
        baseQuery += ' AND sa.Region = ?';
        params.push(region);
    }

    if (minVertical) {
        baseQuery += ' AND sa.VerticalM >= ?';
        params.push(Number(minVertical));
    }

    if (maxVertical) {
        baseQuery += ' AND sa.VerticalM <= ?';
        params.push(Number(maxVertical));
    }

    baseQuery += ' GROUP BY sa.SkiAreaID';

    // Since these values are computed during the select, having is used, not where
    let havingConditions = [];

    if (minRunCount) havingConditions.push(`runCount >= ${Number(minRunCount)}`);
    if (maxRunCount) havingConditions.push(`runCount <= ${Number(maxRunCount)}`);
    if (minMaxPitch) havingConditions.push(`maxAverageRunPitch >= ${Number(minMaxPitch)}`);

    if (havingConditions.length > 0) {
        baseQuery += ' HAVING ' + havingConditions.join(' AND ');
    }

    if (orderBy) {
        const allowedOrder = ['VerticalM', 'maxAverageRunPitch', 'runCount', 'DownhillDistanceKm', 'LiftCount', 'MaxElevationM'];
        if (allowedOrder.includes(orderBy)) {
            const orderDirection = (sortOrder && sortOrder.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
            baseQuery += ` ORDER BY ${orderBy} ${orderDirection}`;
        }
    }

    pool.query(baseQuery, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
};