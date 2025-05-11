const pool = require('../config/db');
const handleQuery = require('../utils/handleQuery');

// Get all favorites for a user based on their UserID
exports.getFavoritesByUserId = (req, res) => {
    const { userId } = req.params;
    // Admittedly, this is near complete code duplication from getSkiAreas.
    // Right now, this is just saving a refactor of the ski area controller
    // handling favorites in itself with user ids.
    const query = `
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
        FROM Favorites f
        JOIN SkiArea sa ON f.SkiAreaID = sa.SkiAreaID
        LEFT JOIN SkiAreaRun sar ON sa.SkiAreaID = sar.SkiAreaID
        LEFT JOIN Run r ON sar.RunID = r.RunID
        LEFT JOIN SkiAreaName san ON sa.SkiAreaID = san.SkiAreaID
        WHERE f.UserID = ?
        GROUP BY sa.SkiAreaID
    `;
    pool.query(query, [userId], (err, results) => {
        handleQuery(err, results, res, {
            errorMessage: 'Failed to get favorites',
            notFoundMessage: 'No favorites found for this user'
        });
    });
};

// Add a favorite
exports.addFavorite = (req, res) => {
    const { userId, skiAreaId } = req.body;
    const query = 'INSERT IGNORE INTO Favorites (UserID, SkiAreaID) VALUES (?, ?)';
    pool.query(query, [userId, skiAreaId], (err, results) => {
        handleQuery(err, results, res, {
            errorMessage: 'Failed to add favorite',
            successMessage: 'Favorite added successfully'
        });
    });
};

// Remove a favorite
exports.removeFavorite = (req, res) => {
    const { userId, skiAreaId } = req.body;
    const query = `
        DELETE FROM Favorites 
        WHERE UserID = ? AND SkiAreaID = ?
    `;
    pool.query(query, [userId, skiAreaId], (err, results) => {
        handleQuery(err, results, res, {
            errorMessage: 'Failed to remove favorite',
            notFoundMessage: 'Favorite not found or already removed',
            successMessage: 'Favorite removed successfully'
        });
    });
};