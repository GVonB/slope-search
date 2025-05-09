const pool = require('../config/db');
const handleQuery = require('../utils/handleQuery');

exports.getWebsitesBySkiAreaId = (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT WebsiteURL
        FROM SkiAreaWebsite
        WHERE SkiAreaID = ?
    `;

    pool.query(query, [id], (err, results) => {
        handleQuery(err, results, res);
    })
};