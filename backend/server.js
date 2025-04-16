const express = require('express');
const mysql = require('mysql2/promise'); // Use mysql2 for MySQL connection
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
app.use(express.json());

// MySQL connection configuration
const dbConfig = {
    host: 'localhost', 
    port: 3306,       
    user: 'root',      
    password: '123456',      
    database: 'SpoilAlertDB' 
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Query the database (table name is 'User' as per your MySQL schema)
        const [results] = await connection.execute(
            'SELECT UserID FROM User WHERE UserName = ? AND Password = ?',
            [username, password]
        );

        // Release the connection back to the pool
        connection.release();

        if (results.length > 0) {
            // Successful login
            res.json({ success: true, userID: results[0].UserID });
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