const express = require('express');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password} = req.body;

    try {
        const user = new User({email, password});
        await user.save();
        const token = jwt.sign({ user_id: user._id }, 'MY_SECRET_KEY');
        return res.send({token});    
    } catch (err) {
        return res.status(422).send(err.message);
    }

})

router.post('/signin', async (req, res) => {
    const { email, password} = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send({error: 'Please provide both email and password'});
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({error: 'User not found'});
        }
        try {
            user.comparePassword(password).then((result) => {
                const token = jwt.sign({ user_id: user.id }, 'MY_SECRET_KEY');
                return res.status(200).send({ "token": token });
            }, (error) => {
                return res.status(200).send({ "error": "password mismatch" });
            })
        } catch (error) {
            return res.status(404).send({"error": error.message});
        }
       
    } catch (error) {
        return res.status(400).send({"error": error.message});
    }
})

module.exports = router; 