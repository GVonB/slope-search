const pool = require('../config/db');
const handleQuery = require('../utils/handleQuery');

// Get all favorites for a user based on their UserID
exports.getFavoritesByUserId = (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT f.*, sa.*, MIN(san.Name) AS primaryName
        FROM Favorites f
        JOIN SkiArea sa ON f.SkiAreaID = sa.SkiAreaID
        LEFT JOIN SkiAreaName san ON sa.SkiAreaID = san.SkiAreaID
        WHERE f.UserID = ?
        GROUP BY sa.SkiAreaID
    `;
    pool.query(query, [userId], (err, results) => {
        handleQuery(err, results, res);
    });
};

// Add a favorite
exports.addFavorite = (req, res) => {
    const { userId, skiAreaId } = req.body;
    const query = 'INSERT INTO Favorites (UserID, SkiAreaID) VALUES (?, ?)';
    pool.query(query, [userId, skiAreaId], (err, results) => {
        handleQuery(err, results, res);
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
        handleQuery(err, results, res);
    });
};