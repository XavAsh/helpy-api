const express = require("express");
const {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
} = require("../controllers/taskController");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.post("/tasks", verifyToken, createTask);
router.get("/tasks", verifyToken, getTasks);
router.delete("/tasks", verifyToken, deleteTask);
router.put("/tasks", verifyToken, updateTask);
//router.get("/simulated", getTasks);

module.exports = router;
