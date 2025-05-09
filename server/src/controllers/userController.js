const pool = require('../config/db');
const handleQuery = require('../utils/handleQuery');

// Add a new user
exports.addUser = (req, res) => {
    const { username } = req.body;
    const query = 'INSERT INTO User (Username) VALUES (?)';
    pool.query(query, [username], (err, results) => {
        // More accurate query response than generic handleQuery()
        if (err) return res.status(500).json({ error: 'Failed to add user'});
        res.json({ message: 'User added successfully', userId: results.insertId });
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