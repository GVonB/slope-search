module.exports = function handleQuery(err, results, res) {
    if (err) {
        return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
        return res.status(404).json({ error: 'No results found' });
    }
    res.json(results);
}