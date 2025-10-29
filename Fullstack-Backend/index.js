const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const EmployeeModel = require('./models/Employee');

const app = express();
app.use(express.json());
app.use(cors());

//mongoose.connect('mongodb://127.0.0.1:27017/PiggyBank')
const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/piggybank';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    EmployeeModel.findOne({ email, password })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.status(200).json({ message: 'Login successful', user });
                } else {
                    res.status(401).json({ message: 'Invalid email or password' });
                }
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        })
});

app.post('/api/register',(req,res)=>{
    EmployeeModel.create(req.body)
    .then(employee => res.json(employee))
    .catch(err => res.json(err))
})

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});