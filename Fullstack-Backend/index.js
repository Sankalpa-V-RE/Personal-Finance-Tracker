const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UserModel = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

//mongoose.connect('mongodb://127.0.0.1:27017/PiggyBank')
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piggybank';   //change when dockerize
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user && user.password === password) {
            return res.status(200).json({ message: 'Login successful', user });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.post('/api/signup',async (req,res)=>{
    try{
        const {email} = req.body;
        const existingUser = await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'Email already in use'});
        }
        const newUser = await UserModel.create(req.body);
        return  res.status(201).json({message: 'SignUp successful', user: newUser});
    }catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
})

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});