const db = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    date_of_birth,
    phone_number,
    profile_picture,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    language,
    timezone,
    notifications_enabled,
  } = req.body;

  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `
        INSERT INTO users (
            email, password, first_name, last_name, date_of_birth, phone_number, 
            profile_picture, address_line1, address_line2, city, state, postal_code, 
            country, language, timezone, notifications_enabled, last_login
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      email,
      hashedPassword,
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      profile_picture,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      language,
      timezone,
      notifications_enabled,
      null,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "User registered successfully" });
    }
  );
};
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    // Update the last_login field with current date/time/seconds
    const updateLastLoginSql =
      "UPDATE users SET last_login = NOW() WHERE id = ?";
    db.query(updateLastLoginSql, [user.id], (updateErr) => {
      if (updateErr) return res.status(500).json({ error: updateErr.message });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      //this shit returns all the info on login , remove fields if needed
      const userResponse = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        date_of_birth: user.date_of_birth,
        phone_number: user.phone_number,
        profile_picture: user.profile_picture,
        address_line1: user.address_line1,
        address_line2: user.address_line2,
        city: user.city,
        state: user.state,
        postal_code: user.postal_code,
        country: user.country,
        language: user.language,
        timezone: user.timezone,
        notifications_enabled: user.notifications_enabled,
      };

      res.json({ token, user: userResponse });
    });
  });
};
