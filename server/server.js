const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Create Express app
const app = express();
const port = 4000;

// Open SQLite database
const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT NOT NULL
    )`);
});

// Close database connection when app exits
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Closed the SQLite database connection.');
            process.exit();
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Insert a new user
app.post('/users', (req, res) => {
    const { username, email } = req.body;
    db.run(`INSERT INTO users (username, email) VALUES (?, ?)`, [username, email], function(err) {
        if (err) {
            return console.error('Error inserting user:', err.message);
        }
        console.log(`A new user with ID ${this.lastID} has been added.`);
        res.sendStatus(201);
    });
});

// Example function to fetch users from SQLite
function getUsers(callback) {
    db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
            console.error(err.message);
            return callback(err);
        }
        callback(null, rows);
    });
}

// Get all users
app.get('/users', (req, res) => {
    getUsers((err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(users);
    });
});

