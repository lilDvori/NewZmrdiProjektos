const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware pro parsování JSON
app.use(bodyParser.json());

// Middleware pro správu session
app.use(
    session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 3600000 },
    })
);

// Middleware pro statické soubory
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')));
app.use('/worker', express.static(path.join(__dirname, '../frontend/worker')));

// Middleware pro kontrolu přihlášení
const checkAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).send('Unauthorized');
};

// Připojení rout pro autentizaci
app.use('/auth', authRoutes);

// Chráněné cesty
app.use('/admin', checkAuth, express.static(path.join(__dirname, '../frontend/admin')));
app.use('/worker', checkAuth, express.static(path.join(__dirname, '../frontend/worker')));

// Přesměrování na login při otevření hlavní stránky
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Spuštění serveru
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server běží na http://localhost:${PORT}`));
