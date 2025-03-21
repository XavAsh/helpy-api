const db = require("../models/db");

exports.createTask = (req, res) => {
  const { user_id, task_name, task_date, task_time, price } = req.body;

  if (!user_id || !task_name || !task_date || !task_time || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    INSERT INTO tasks (user_id, task_name, task_date, task_time, price)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user_id, task_name, task_date, task_time, price],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        message: "Task created successfully",
        taskId: result.insertId,
      });
    }
  );
};

exports.getTasks = (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const sql = `
    SELECT id, task_name, task_date, task_time, price
    FROM tasks
    WHERE user_id = ?
    ORDER BY task_date, task_time
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

exports.updateTask = (req, res) => {
  const { id } = req.params; // Task ID from the URL
  const { task_name, task_date, task_time, price } = req.body; // Fields to update

  if (!task_name || !task_date || !task_time || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    UPDATE tasks
    SET task_name = ?, task_date = ?, task_time = ?, price = ?
    WHERE id = ?
  `;

  db.query(sql, [task_name, task_date, task_time, price, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task updated successfully" });
  });
};

exports.deleteTask = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM tasks
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  });
};
