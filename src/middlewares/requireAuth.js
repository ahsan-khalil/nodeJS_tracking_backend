const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');


module.exports = async (req, res, next) => {
    const { authorization} = req.headers;
    if (!authorization) {
        return res.status(401).send({ error: "You must logged in"});
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: err.message});
        }
        const { user_id } = payload;

        const user = await User.findById(user_id);
        req.user = user;
        next();
    });
};