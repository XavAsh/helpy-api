const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
