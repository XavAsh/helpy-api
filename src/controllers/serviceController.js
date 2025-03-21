exports.getServices = (req, res) => {
  const sql = "SELECT * FROM services";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};
