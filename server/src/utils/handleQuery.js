module.exports = function handleQuery(err, results, res, options = {}) {
    // Generic errors, able to be swapped to custom through parameters
    const {
        errorMessage = 'Database query failed',
        notFoundMessage = 'No results found',
        successMessage = null
    } = options;

    if (err) {
        return res.status(500).json({ error: errorMessage });
    }

    if (Array.isArray(results) && results.length === 0) {
        return res.status(404).json({ error: notFoundMessage });
    }

    if (results.affectedRows !== undefined) {
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: notFoundMessage });
        }
        return res.json({ message: successMessage });
    }

    if (successMessage) {
        return res.json({ message: successMessage, data: results});
    }

    res.json(results);
}