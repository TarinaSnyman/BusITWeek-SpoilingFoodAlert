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
        connection.release();
        if (results.length > 0) {
            res.json({ success: true, userID: results[0].UserID });
        } else {
            res.status(401).json({ success: false, message: 'Username or password is incorrect' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
 // New endpoint to fetch user's food items
app.get('/userfood/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute(
            `SELECT f.FoodName, uf.Quantity, uf.ExpiryDate
             FROM UserFood uf
             JOIN Food f ON uf.FoodID = f.FoodID
             WHERE uf.UserID = ?`,
            [userID]
        );
        connection.release();

        res.json({ success: true, foodItems: results });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});