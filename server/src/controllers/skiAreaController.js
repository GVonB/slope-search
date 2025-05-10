const pool = require('../config/db');
const handleQuery = require('../utils/handleQuery');

// TODO: Redis caching for this query?
exports.getSkiAreas = (req, res) => {
    const { country, region, minVertical, orderBy, sortOrder, userId, favorites, minRunCount, minMaxPitch } = req.query;

    // Using a SQL alias for each table for simplicity
    // Note, due to the finite nature of color ratings in runs, but the multiple conventions,
    // it's much more convenient to just count all colors, and then note to the user what
    // convention is being used, if not already clear by the country which we've guaranteed
    // to exist during data cleaning.
    // MIN(san.Name) is used to just get one name for the primary
    let baseQuery = `
        SELECT 
            sa.SkiAreaID as skiAreaId,
            sa.Country as country,
            sa.Region as region,
            sa.DownhillDistanceKm as downhillDistanceKm,
            sa.VerticalM as verticalM,
            sa.MinElevationM as minElevationM,
            sa.MaxElevationM as maxElevationM,
            sa.LiftCount as liftCount,
            sa.RunConvention as runConvention,
            sa.OpenSkiMap as openSkiMap,
            sa.Geometry as geometry,
            sa.Latitude as latitude,
            sa.Longitude as longitude,
            MIN(san.Name) AS primaryName,
            COUNT(DISTINCT r.RunID) AS runCount, 
            MAX(r.AveragePitch) AS maxAverageRunPitch,
            SUM(CASE WHEN r.Color = 'black' THEN 1 ELSE 0 END) AS blackCount,
            SUM(CASE WHEN r.Color = 'blue' THEN 1 ELSE 0 END) AS blueCount,
            SUM(CASE WHEN r.Color = 'green' THEN 1 ELSE 0 END) AS greenCount,
            SUM(CASE WHEN r.Color = 'grey' THEN 1 ELSE 0 END) AS greyCount,
            SUM(CASE WHEN r.Color = 'red' THEN 1 ELSE 0 END) AS redCount,
            SUM(CASE WHEN r.Color = 'orange' THEN 1 ELSE 0 END) AS orangeCount
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

    baseQuery += ' GROUP BY sa.SkiAreaID';

    // Since these values are computed during the select, having is used, not where
    let havingConditions = [];

    if (minRunCount) havingConditions.push(`runCount >= ${Number(minRunCount)}`);
    if (minMaxPitch) havingConditions.push(`maxAverageRunPitch >= ${Number(minMaxPitch)}`);

    if (havingConditions.length > 0) {
        baseQuery += ' HAVING ' + havingConditions.join(' AND ');
    }

    if (orderBy) {
        const allowedOrder = ['VerticalM', 'maxAverageRunPitch', 'runCount', 'DownhillDistanceKm', 'LiftCount', 'MaxElevationM'];
        if (allowedOrder.includes(orderBy)) {
            const orderDirection = (sortOrder && sortOrder.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
            if (orderDirection === 'ASC') {
                baseQuery += ` ORDER BY ISNULL(${orderBy}), ${orderBy} ASC`;
            } else {
                baseQuery += ` ORDER BY ${orderBy} DESC`;
            }
        }
    }

    baseQuery += ' LIMIT 100';

    pool.query(baseQuery, params, (err, results) => {
        handleQuery(err, results, res, {
            errorMessage: 'Failed to get ski areas',
            notFoundMessage: 'No ski areas found matching the criteria'
        });
    });
};