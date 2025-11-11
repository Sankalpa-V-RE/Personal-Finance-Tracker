const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cors());

//mongoose.connect('mongodb://127.0.0.1:27017/PiggyBank')
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piggybank';   //change when dockerize
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use("/api/auth", authRoutes);

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});