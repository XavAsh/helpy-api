const express = require("express");
const {
  createTask,
  getTasks,
  deleteTasks,
  updateTasks,
} = require("../controllers/taskController");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.post("/tasks", verifyToken, createTask);
router.get("/tasks", verifyToken, getTasks);
router.delete("/tasks", verifyToken, deleteTasks);
router.put("/tasks", verifyToken, updateTasks);
//router.get("/simulated", getTasks);

module.exports = router;
