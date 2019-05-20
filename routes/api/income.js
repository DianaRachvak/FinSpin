const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const Income = require('../../models/Income');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const config = require('config');
const auth = require('../../middleware/auth');

//@route  POST api/income
//@desc   Create an income
//@access Public
router.post(
    '/', 
    [
        auth, 
        [
            check('incomeType', 'Income type is required')
                .not()
                .isEmpty(),
            check('incomeAmount', 'Income amount is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newIncome = new Income ({
            incomeDate: req.body.incomeDate, 
            incomeType: req.body.incomeType, 
            incomeNote: req.body.incomeNote, 
            incomeAmount: req.body.incomeAmount,
            userName: user.name,
            user: req.user.id
        });

        const income = await newIncome.save();
        res.json(income);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }     
});

//@route  GET api/income
//@desc   Get all incomes
//@access Private
router.get('/', auth, async (req, res) => {
    try {
       const incomes = await Income.find().sort({date: -1});
       res.json(incomes); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');       
    }
});

//@route  GET api/income/:id
//@desc   Get income by id
//@access Private
router.get('/:id', auth, async (req, res) => {
    try {
       const income = await Income.findById(req.params.id);
       
       if(!income) {
           return res.status(404).json({ msg: 'Income not found' });
       }

       res.json(income); 

    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Income not found' });
        }
        res.status(500).send('Server error');       
    }
});

//@route  DELETE api/income/:id
//@desc   Delete income by id
//@access Private
router.delete('/:id', auth, async (req, res) => {
    try {
       const income = await Income.findById(req.params.id);

        if(!income) {
            return res.status(401).json({ msg: 'Income not found' });
        }
       //check user
       if(income.user.toString() !== req.user.id) {
           return res.status(401).json({ msg: 'User is not authorized' });
       }

       await income.remove();
       res.json({ msg: 'Income is removed' }); 
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Income not found' });
        }
        res.status(500).send('Server error');       
    }
});


module.exports = router;
