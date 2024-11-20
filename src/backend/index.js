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

// Middleware pro odstranění .html z URL
app.get('/admin/:page', (req, res) => {
    res.sendFile(path.join(__dirname, `../frontend/admin/${req.params.page}.html`));
});
app.get('/worker/:page', (req, res) => {
    res.sendFile(path.join(__dirname, `../frontend/worker/${req.params.page}.html`));
});

// Middleware pro kontrolu přihlášení a role
const checkAuth = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role === role) {
            return next();
        }
        res.status(403).send('Přístup zakázán'); // Zakázání přístupu pro neautorizované role
    };
};

// Chráněné cesty
app.use('/admin', checkAuth('admin'));
app.use('/worker', checkAuth('worker'));

// Připojení rout pro autentizaci
app.use('/auth', authRoutes);

// Přesměrování na login při otevření hlavní stránky
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Spuštění serveru
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server běží na http://localhost:${PORT}`));
