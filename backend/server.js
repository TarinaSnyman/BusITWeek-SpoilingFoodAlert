const express = require('express');
const ADODB = require('node-adodb');
const cors = require('cors');
const app = express();
const port = 3000;

// middleware
const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
app.use(express.json());

// Connection string to Access database 

const conn = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=..\\Database\\SpoilFoodAlertDB.accdb;');


// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the database
        const query = `SELECT FirstName FROM Users WHERE UserName=? AND Password=?`;
        const results = await conn.query(query, [username, password]);

        if (results.length > 0) {
            // Successful login
            res.json({ success: true, firstName: results[0].firstName });
        } else {
            // Invalid credentials
            res.status(401).json({ success: false, message: 'Username or password is incorrect' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});