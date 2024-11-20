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

        const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/worker/dashboard';

        return res.json({
            success: true,
            redirect: redirectPath, // Přesměrování podle role
        });
    }

    res.status(401).json({
        success: false,
        message: "Neplatné uživatelské jméno nebo heslo.",
    });
});
