const jwt = require('jsonwebtoken');
const usermodel = require('../models/user.model');

const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) 
        return res.status(401).json({ message: 'Access denied,no token' });

    const token = authHeader.replace('Bearer ', '');

    

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usermodel.findById(payload.userid);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
        req.user = user;
        next();
    } catch (error) {
         res.status(401).json({ message: 'Invalid  or expired token' });
    }
};
module.exports = requireAuth;