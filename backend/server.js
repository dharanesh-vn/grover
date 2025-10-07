const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in .env file.');
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// --- API Routes ---
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/weather', require('./routes/weather.routes'));
app.use('/api/crops', require('./routes/crop.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/inventory', require('./routes/inventory.routes')); // Add this new line for inventory

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});