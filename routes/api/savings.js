const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');
const Savings = require('../../models/Savings');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

//@route  POST api/saving
//@desc   Create a saving
//@access Public
router.post(
    '/', 
    [
        auth, 
        [
            check('savingsType', 'Savings type is required')
                .not()
                .isEmpty(),
            check('savingsAmount', 'Savings amount is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newSaving = new Savings ({
            savingsDate: req.body.savingsDate, 
            savingsType: req.body.savingsType, 
            savingsNote: req.body.savingsNote, 
            savingsAmount: req.body.savingsAmount,
            userName: user.name,
            user: req.user.id
        });

        const savings = await newSaving.save();
        res.json(savings);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }     
});

//@route  GET api/savings
//@desc   Get all savings
//@access Private
router.get('/', auth, async (req, res) => {
    try {
       const savings = await Savings.find().sort({date: -1});
       res.json(savings); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');       
    }
});

//@route  GET api/savings/:id
//@desc   Get savings by id
//@access Private
router.get('/:id', auth, async (req, res) => {
    try {
       const saving = await Savings.findById(req.params.id);
       if(!saving) {
           return res.status(404).json({ msg: 'Saving not found' });
       }
       res.json(saving); 
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Saving not found' });
        }
        res.status(500).send('Server error');       
    }
});

//@route  DELETE api/savings/:id
//@desc   Delete saving by id
//@access Private
router.delete('/:id', auth, async (req, res) => {
    try {
       const saving = await Savings.findById(req.params.id);

        if(!saving) {
            return res.status(401).json({ msg: 'Saving not found' });
        }
       //check user
       if(saving.user.toString() !== req.user.id) {
           return res.status(401).json({ msg: 'User is not authorized' });
       }

       await saving.remove();
       res.json({ msg: 'Saving is removed' }); 
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Saving not found' });
        }
        res.status(500).send('Server error');       
    }
});


module.exports = router;
