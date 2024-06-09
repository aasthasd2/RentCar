const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Serve static files from the "src" directory
app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.json()); // To parse JSON bodies

// Create and connect to the SQLite database
const db = new sqlite3.Database(':memory:');

// Create the cars table and insert some data
db.serialize(() => {
    db.run("CREATE TABLE cars (id INTEGER PRIMARY KEY, name TEXT, price INTEGER, type TEXT, brand TEXT, image TEXT, description TEXT)");

    const stmt = db.prepare("INSERT INTO cars (name, price, type, brand, image, description) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run("Toyota Corolla", 50, "Sedan", "Toyota", "images/car1.jpg", "The Toyota Corolla is a compact car that offers excellent fuel efficiency and a comfortable ride. It's a great choice for city driving and long road trips.");
    stmt.run("Honda Civic", 60, "Sedan", "Honda", "images/car2.jpg", "The Honda Civic is known for its reliability, fuel efficiency, and sporty design. It offers a smooth driving experience and advanced safety features.");
    stmt.finalize();

    // Create bookings table
    db.run("CREATE TABLE bookings (id INTEGER PRIMARY KEY, car_id INTEGER, user_name TEXT, user_email TEXT, pickup_date TEXT, dropoff_date TEXT, payment_method TEXT, FOREIGN KEY(car_id) REFERENCES cars(id))");
});

// API endpoint to get car data
app.get('/api/cars', (req, res) => {
    db.all("SELECT * FROM cars", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ cars: rows });
    });
});

// API endpoint to create a new booking
app.post('/api/bookings', (req, res) => {
    const { car_id, user_name, user_email, pickup_date, dropoff_date, payment_method } = req.body;
    const stmt = db.prepare("INSERT INTO bookings (car_id, user_name, user_email, pickup_date, dropoff_date, payment_method) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(car_id, user_name, user_email, pickup_date, dropoff_date, payment_method, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ booking_id: this.lastID });
    });
    stmt.finalize();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
