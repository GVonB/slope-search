const pool = require('../config/db');
const handleQuery = require('../utils/handleQuery');

exports.getNamesBySkiAreaId = (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT Name AS name
        FROM SkiAreaName
        WHERE SkiAreaID = ?
    `;

    pool.query(query, [id], (err, results) => {
        handleQuery(err, results, res, {
            errorMessage: 'Failed to get names',
            notFoundMessage: 'No names found for this ski area'
        });
    });
};