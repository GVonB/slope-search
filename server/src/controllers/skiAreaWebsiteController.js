const pool = require('../config/db');
const handleQuery = require('../utils/handleQuery');

exports.getWebsitesBySkiAreaId = (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT WebsiteURL as websiteUrl
        FROM SkiAreaWebsite
        WHERE SkiAreaID = ?
    `;

    pool.query(query, [id], (err, results) => {
        handleQuery(err, results, res);
    })
};