const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Expenses = require('../../models/Expenses');

//@route  GET api/profile/me
//@desc   Get current user's profile
//@access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name');

        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// //@route  GET api/profile/expenses
// //@desc   Get current user's expenses
// //@access Private
// router.get('/expenses', auth, async (req, res) => {
//     try {
//         const expenses = await Expenses.findOne({ expenses: req.expenses })
//             .populate('expenses', 'expenseDate, expenseType, expenseNote, expenseAmount');

//         if(!expenses) {
//             return res.status(400).json({ msg: 'There are no expenses reported for this user' });
//         }

//         res.json(expenses);
//     } catch(err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// //@route  POST api/profile
// //@desc   Create or update user's profile
// //@access Private
// router.post('/', 
//     [ 
//         auth, 
//         [
//             check('expenses.expenseDate', 'Expense Date is required')
//                 .not()
//                 .isEmpty(),
//             check('expenses.expenseType', 'Expense Amount is required')
//                 .not()
//                 .isEmpty(),
//             check('expenses.expenseAmount', 'Expense Amount is required')
//                 .not()
//                 .isEmpty(),
//         ]
//     ], 
//     async (req, res) => {

//         const errors = validationResult(req);
//         if(!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array()});
//         }
        

//         const {
//             expenseDate,
//             expenseType,
//             expenseNote,
//             expenceAmount
//         } = req.body;

//         //Build profile object
//         const profileFields = {};
//         profileFields.user = req.user.id;

//         profileFields.expenses = {};
//         //profileFields.expenses = req.expenses;

//         if(expenseDate) profileFields.expenses.expenseDate = expenseDate;
//         if(expenseType) profileFields.expenses.expenseType = expenseType;
//         if(expenseNote) profileFields.expenses.expenseNote = expenseNote;
//         if(expenceAmount) profileFields.expenses.expenceAmount = expenceAmount;

//         try {
//             let profile = await Profile.findOne({ user: req.user.id });

//             if(profile) {
//                 profile = await Profile.findOneAndUpdate(
//                     { user: req.user.id}, 
//                     {$set: profileFields}, 
//                     {new: true}
//                 );
//                 return res.json(profile);
//             }

//             //create
//             profile = new Profile(profileFields);
//             await profile.save();
//             res.json(profile);
            
//         }catch(err) {
//             console.error(err.message);
//             res.status(500).send('Server error: post method not working properly');
//         }
//     }
// );

// //@route  GET api/profile
// //@desc   Get all profiles
// //@access Public
// router.get('/', async (req, res) => {
//     try {
//         const profiles = await Profile.find().populate('user', 'name');
//         res.json(profiles);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

//@route  POST api/profile
//@desc   Create or update user's profile
//@access Private
router.post('/', 
    [ 
        auth, 
        [
            check('company', 'Company name is required')
                .not()
                .isEmpty(),
            check('status', 'Status is required')
                .not()
                .isEmpty()
        ]
    ], 
    async (req, res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        

        const {
            location,
            status,
            company,
            skills,
            githubusername,
            facebook,
            linkedin,
            // expenseDate,
            // expenseType,
            // expenseNote,
            // expenceAmount
        } = req.body;

        //Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;

        // profileFields.expenses = {};
        // //profileFields.expenses = req.expenses;

        if(company) profileFields.company = company;
        if(status) profileFields.status = status;
        if(location) profileFields.location = location;
        if(githubusername) profileFields.githubusername = githubusername;
        if(skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        //Build social object
        profileFields.social = {};        
        if(facebook) profileFields.social.facebook = facebook;
        if(linkedin) profileFields.social.linkedin = linkedin;

        
        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if(profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id}, 
                    {$set: profileFields}, 
                    {new: true}
                );
                return res.json(profile);
            }

            //create
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
            
        }catch(err) {
            console.error(err.message);
            res.status(500).send('Server error: post method not working properly');
        }
    }
);

//@route  GET api/profile
//@desc   Get all profiles
//@access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', 'name');
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route  GET api/profile/user/:user_id
//@desc   Get profile by user id
//@access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', 'name');

        if(!profile) return res.status(400).json({ msg: 'Profile not found' });
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});

//@route  DELETE api/profile
//@desc   Delete profile & user associated info
//@access Private
router.delete('/', auth, async (req, res) => {
    try {
        //todo remove user's info

        //remove profile
        await Profile.findByIdAndRemove({ user: req.user.id });
        //remove user
        await User.findByIdAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route  PUT api/profile/social
//@desc  Add profile social
//@access Private
//example of adding new elements
router.put('/social', 
    [
        auth, 
        [
            check('facebook', 'Facebook page is reqired')
                .not()
                .isEmpty(),
            check('linkedin', 'Linkedin page is reqired')
                .not()
                .isEmpty(),
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            facebook,
            linkedin
        } = req.body;

        const newSocialInfo = {
            facebook,
            linkedin,
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.social.unshift(newSocialInfo); //won't work because social is not an array!!
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

});


module.exports = router;
