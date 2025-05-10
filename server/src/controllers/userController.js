const pool = require('../config/db');
const handleQuery = require('../utils/handleQuery');

// Find or create a user by username
exports.findOrCreateUser = (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const selectQuery = 'SELECT UserID FROM User WHERE Username = ?';
    const insertQuery = 'INSERT INTO User (Username) VALUES (?)';

    pool.query(selectQuery, [username], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (results.length > 0) {
            return res.json({ userId: results[0].UserID });
        }

        pool.query(insertQuery, [username], (insertErr, insertResults) => {
            if (insertErr) return res.status(500).json({ error: 'Insert failed' });

            res.json({ userId: insertResults.insertId });
        });
    });
};

// Get all users (dev use)
exports.getAllUsers = (req, res) => {
    const query = 'SELECT * FROM User';
    pool.query(query, (err, results) => {
        handleQuery(err, results, res, {
            errorMessage: 'Failed to get users',
            notFoundMessage: 'No users found'
        });
    });
};

// Delete user by ID
exports.deleteUserById = (req, res) => {
    const { userId } = req.params;
    const query = 'DELETE FROM User WHERE UserID = ?';
    pool.query(query, [userId], (err, results) => {
        handleQuery(err, results, res, {
            errorMessage: 'Failed to delete user',
            notFoundMessage: 'User not found or already deleted',
            successMessage: 'User deleted successfully'
        });
    });
};