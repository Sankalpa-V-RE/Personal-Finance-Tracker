const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");

const app = express();
app.use(express.json());
// Allowed origins for CORS to fix connection issues
const allowedOrigins = [
  "http://localhost:5173",
  "http://52.45.42.182:5173",
  "http://52.45.42.182",
  "http://52.45.110.183"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

//mongoose.connect('mongodb://127.0.0.1:27017/PiggyBank')
//const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/piggybank';   // when dockerize
//const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piggybank';  // for local testing
const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/piggybank'; // Default to docker service name
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});