const mongoose = require('mongoose');

const recurringTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense']
    },
    category: {
        type: String,
        required: true
    },
    lastProcessedDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('RecurringTransaction', recurringTransactionSchema);
