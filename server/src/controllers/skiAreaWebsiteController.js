const pool = require('../config/db');
const handleQuery = require('../utils/handleQuery');

exports.getWebsitesBySkiAreaId = (req, res) => {
    const skiAreaId = req.params.id;

    const query = `
        SELECT WebsiteURL as websiteUrl
        FROM SkiAreaWebsite
        WHERE SkiAreaID = ?
    `;

    pool.query(query, [skiAreaId], (err, results) => {
        handleQuery(err, results, res, {
            errorMessage: 'Failed to get websites',
            notFoundMessage: 'Websites not found for this ski area'
        });
    })
};