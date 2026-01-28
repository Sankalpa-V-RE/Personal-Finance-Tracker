const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Add new transaction
router.post('/add', async (req, res) => {
    try {
        const { userId, title, amount, type, category, date, description } = req.body;

        if (!userId || !title || !amount || !type || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTransaction = new Transaction({
            userId,
            title,
            amount,
            type,
            category,
            date,
            description
        });

        await newTransaction.save();
        res.status(200).json({ message: "Transaction added successfully", transaction: newTransaction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all transactions for a user
router.get('/get/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await Transaction.find({ userId }).sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete transaction
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Transaction.findByIdAndDelete(id);
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
