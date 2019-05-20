const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncomeSchema = new Schema({    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }, 

    userName: {
        type: String
    },
    incomeDate: {
        type: Date,
        default: Date.now
    },
    incomeType: {
        type: String,
        required: true
    },
    incomeNote: {
        type: String
    },
    incomeAmount: {
        type: Number,
        required: true
    }
});

module.exports = Income = mongoose.model('income', IncomeSchema);