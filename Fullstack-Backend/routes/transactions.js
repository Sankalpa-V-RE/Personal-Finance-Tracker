const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const RecurringTransaction = require('../models/RecurringTransaction');

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

// Update transaction
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount, type, category, date } = req.body;

        await Transaction.findByIdAndUpdate(id, {
            title, amount, type, category, date
        });

        res.status(200).json({ message: "Transaction updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Recurring Transaction Routes ---

// Add Recurring Transaction
router.post('/recurring/add', async (req, res) => {
    try {
        const { userId, title, amount, type, category } = req.body;
        if (!userId || !title || !amount || !type || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newRecurring = new RecurringTransaction({ userId, title, amount, type, category });
        await newRecurring.save();
        res.status(200).json({ message: "Recurring transaction set successfully", recurring: newRecurring });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Recurring Transactions
router.get('/recurring/get/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const recurring = await RecurringTransaction.find({ userId });
        res.status(200).json(recurring);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Recurring Transaction
router.delete('/recurring/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await RecurringTransaction.findByIdAndDelete(id);
        res.status(200).json({ message: "Recurring transaction removed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Process Recurring Transactions (Lazy Load)
router.post('/recurring/process', async (req, res) => {
    try {
        const { userId } = req.body;
        const recurs = await RecurringTransaction.find({ userId });
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let processedCount = 0;

        for (let rec of recurs) {
            // Atomic check-and-update to prevent race conditions
            // effectively "locking" this month for this recurring transaction
            const startOfMonth = new Date(currentYear, currentMonth, 1);

            const result = await RecurringTransaction.updateOne(
                {
                    _id: rec._id,
                    $or: [
                        { lastProcessedDate: null },
                        { lastProcessedDate: { $lt: startOfMonth } }
                    ]
                },
                { $set: { lastProcessedDate: now } }
            );

            // If nModified is 1, it means WE won the race and should create the transaction
            if (result.modifiedCount === 1) {
                const newTx = new Transaction({
                    userId: rec.userId,
                    title: rec.title + ' (Monthly)',
                    amount: rec.amount,
                    type: rec.type,
                    category: rec.category,
                    date: now,
                    recurringId: rec._id
                });
                await newTx.save();
                processedCount++;
            }
        }

        res.status(200).json({ message: "Recurring transactions processed", count: processedCount });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
