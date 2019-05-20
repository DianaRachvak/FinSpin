const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpensesSchema = new Schema({  
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }, 

    userName: {
        type: String
    },
    expenseDate: {
        type: Date,
        default: Date.now
    },
    expenseType: {
        type: String,
        reqyuired: true
    },
    expenseNote: {
        type: String
    },
    expenseAmount: {
        type: Number,
        required: true
    }
});

module.exports = Expenses = mongoose.model('expenses', ExpensesSchema);