const express = require("express");
const router = express.Router();

const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "worker", password: "worker123", role: "worker" },
];

// Endpoint pro přihlášení
router.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Prosím vyplňte uživatelské jméno a heslo.",
        });
    }

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (user) {
        req.session.user = {
            username: user.username,
            role: user.role,
        };

        return res.json({
            success: true,
            username: user.username,
            role: user.role,
        });
    }

    res.status(401).json({
        success: false,
        message: "Neplatné uživatelské jméno nebo heslo.",
    });
});

module.exports = router;
