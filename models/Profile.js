const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    location: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },  
    skills: {
        type: [String]
    },
    githubusername: {
        type: String
    },
    social: {
        facebook: {
            type:String,
            required: true
        },
        linkedin: {
            type: String,
            required: true
        }
    },    
    date: {
        type: Date,
        default: Date.now
    },

    expenses: {
        type: mongoose.Schema.Types.String,
        ref: 'expenses' 
    },
    income: {
        type: mongoose.Schema.Types.Number,
        ref: 'income' 
    },
    savings: {
        type: mongoose.Schema.Types.Number,
        ref: 'savings' 
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);