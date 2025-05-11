const pool = require('../config/db');
const handleQuery = require('../utils/handleQuery');

// TODO: Redis caching for this query?
exports.getRuns = (req, res) => {
    const { country, region, difficulty, color, minInclinedLength, minAveragePitch, orderBy, sortOrder, skiAreaId, limit } = req.query;

    // For a useful query we need the run name, and the
    // name of the ski area the run is at. However,
    // this requires two joins. One to get the actual
    // run name, and another for the ski area name.
    // Luckily, using MIN() should prioritize English
    // names, just as it appears to in the ski area queries.
    let baseQuery = `
        SELECT
            r.RunID as runId,
            r.Country as country,
            r.Region as region,
            r.Difficulty as difficulty,
            r.Color as color,
            r.Lit as lit,
            r.InclinedLengthM as inclinedLengthM,
            r.DescentM as descentM,
            r.AveragePitch as averagePitch,
            r.MaxPitch as maxPitch,
            r.MinElevationM as minElevationM,
            r.MaxElevationM as maxElevationM,
            r.DifficultyConvention as difficultyConvention,
            r.OpenSkiMap as openSkiMap,
            r.Geometry as geometry,
            r.Latitude as latitude,
            r.Longitude as longitude,
            MIN(rn.Name) AS primaryRunName,
            MIN(san.Name) AS skiAreaName
        FROM Run r
        LEFT JOIN RunName rn ON r.RunID = rn.RunID
        LEFT JOIN SkiAreaRun sar ON r.RunID = sar.RunID
        LEFT JOIN SkiArea sa ON sar.SkiAreaID = sa.SkiAreaID
        LEFT JOIN SkiAreaName san ON sa.SkiAreaID = san.SkiAreaID
        WHERE 1=1
    `;

    const params = [];
    
    // Filter like Ski Areas, adding to query if needed
    if (country) {
        baseQuery += ' AND r.Country = ?';
        params.push(country);
    }
    if (region) {
        baseQuery += ' AND r.Region = ?';
        params.push(region);
    }
    if (difficulty) {
        baseQuery += ' AND r.Difficulty = ?';
        params.push(difficulty);
    }
    if (color) {
        baseQuery += ' AND r.Color = ?';
        params.push(color);
    }
    if (minInclinedLength) {
        baseQuery += ' AND r.InclinedLengthM >= ?';
        params.push(Number(minInclinedLength));
    }
    if (minAveragePitch) {
        baseQuery += ' AND r.AveragePitch >= ?';
        params.push(Number(minAveragePitch));
    }
    if (skiAreaId) {
        baseQuery += ' AND sa.SkiAreaID = ?';
        params.push(skiAreaId);
    }

    baseQuery += ' GROUP BY r.RunID';
    
    if (orderBy) {
        const allowedOrder = ['InclinedLengthM', 'AveragePitch', 'MaxPitch', 'DescentM'];
        if (allowedOrder.includes(orderBy)) {
            const direction = (sortOrder && sortOrder.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
            baseQuery += ` ORDER BY r.${orderBy} ${direction}`;
        }
    }

    const maxLimit = 1000;

    if (limit && !isNaN(limit)) {
        const limitVal = Math.min(parseInt(limit), maxLimit);
        baseQuery += ` LIMIT ${limitVal}`;
    } else {
        baseQuery += ` LIMIT ${maxLimit}`;
    }

    pool.query(baseQuery, params, (err, results) => {
        handleQuery(err, results, res, {
            errorMessage: 'Failed to get ski runs',
            notFoundMessage: 'No ski runs found matching the criteria'
        });
    });
};