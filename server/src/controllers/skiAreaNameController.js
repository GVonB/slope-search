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

exports.getAllPrimaryNamesWithId = (req, res) => {
    const { country, region } = req.query;

    let baseQuery = `
        SELECT sa.SkiAreaID as id, MIN(san.Name) AS name
        FROM SkiArea sa
        LEFT JOIN SkiAreaName san ON sa.SkiAreaID = san.SkiAreaID
        WHERE 1=1
    `;

    const params = [];

    if (country) {
        baseQuery += ' AND sa.Country = ?';
        params.push(country);
    }

    if (region) {
        baseQuery += ' AND sa.Region = ?';
        params.push(region);
    }

    baseQuery += `
        GROUP BY sa.SkiAreaID
        ORDER BY name
    `;

    pool.query(baseQuery, params, (err, results) => {
        handleQuery(err, results, res, {
            errorMessage: 'Failed to get filtered ski area names',
            notFoundMessage: 'No ski areas found for these filters'
        });
    });
};