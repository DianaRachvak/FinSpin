const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavingsSchema = new Schema({    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }, 
    userName: {
        type: String
    },
    
    savingsDate: {
        type: Date,
        default: Date.now,
    },
    savingsType: {
        type: String,
        required: true
    },
    savingsNote: {
        type: String
    },
    savingsAmount: {
        type: Number,
        required: true
    }
});

module.exports = Savings = mongoose.model('savings', SavingsSchema);