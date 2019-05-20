const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const Expenses = require('../../models/Expenses');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const config = require('config');
const auth = require('../../middleware/auth');

//@route  POST api/expenses
//@desc   Create an expense
//@access Public
router.post(
    '/', 
    [
        auth, 
        [
            check('expenseType', 'Expense type is required')
                .not()
                .isEmpty(),
            check('expenseAmount', 'Expense amount is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newExpense = new Expenses ({
            expenseDate: req.body.expenseDate, 
            expenseType: req.body.expenseType, 
            expenseNote: req.body.expenseNote, 
            expenseAmount: req.body.expenseAmount,
            userName: user.name,
            user: req.user.id
        });

        const expense = await newExpense.save();
        res.json(expense);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }     
});

//@route  GET api/expenses
//@desc   Get all expenses
//@access Private
router.get('/', auth, async (req, res) => {
    try {
       const expenses = await Expenses.find().sort({date: -1});
       res.json(expenses); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');       
    }
});

//@route  GET api/expenses/:id
//@desc   Get expense by id
//@access Private
router.get('/:id', auth, async (req, res) => {
    try {
       const expense = await Expenses.findById(req.params.id);
       if(!expense) {
           return res.status(404).json({ msg: 'Expense not found' });
       }
       res.json(expense); 
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Expense not found' });
        }
        res.status(500).send('Server error');       
    }
});

//@route  DELETE api/expenses/:id
//@desc   Delete expense by id
//@access Private
router.delete('/:id', auth, async (req, res) => {
    try {
       const expense = await Expenses.findById(req.params.id);

        if(!expense) {
            return res.status(401).json({ msg: 'Expense not found' });
        }
       //check user
       if(expense.user.toString() !== req.user.id) {
           return res.status(401).json({ msg: 'User is not authorized' });
       }

       await expense.remove();
       res.json({ msg: 'Expense is removed' }); 
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Expense not found' });
        }
        res.status(500).send('Server error');       
    }
});


module.exports = router;
