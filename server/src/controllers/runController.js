const pool = require('../config/db');
const handleQuery = require('../utils/handleQuery');

exports.getRuns = (req, res) => {

    // For a useful query we need the run name, and the
    // name of the ski area the run is at. However,
    // this requires two joins. One to get the actual
    // run name, and another for the ski area name.
    // Luckily, using MIN() should prioritize English
    // names, just as it appears to in the ski area queries.
    const query = `
        SELECT r.*,
            MIN(rn.Name) AS primaryRunName,
            MIN(san.Name) AS skiAreaName
        FROM Run r
        LEFT JOIN RunName rn ON r.RunID = rn.RunID
        LEFT JOIN SkiAreaRun sar ON r.RunID = sar.RunID
        LEFT JOIN SkiArea sa ON sar.SkiAreaID = sa.SkiAreaID
        LEFT JOIN SkiAreaName san ON sa.SkiAreaID = san.SkiAreaID
        GROUP BY r.RunID
    `;
    
    pool.query(query, (err, results) => {
        handleQuery(err, results, res);
    });
};