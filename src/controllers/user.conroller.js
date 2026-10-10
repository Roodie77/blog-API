const usermodel = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');




const registerUser = async (req, res, next) => {
    try {const {email,name,password} = req.body;
    const existingUser = await usermodel.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await hashPassword(password);
    const user = new usermodel({
        name: name,
        email: email,
        password: hashed
    })

    await user.save();
   return  res.status(201).json({ message: 'User registered successfully' });
        
    } catch (error) {
       
        next(error);
    }
        
    };

    const loginUser = async (req, res, next) => {
try {
    const { email, password } = req.body;
        const user = await usermodel.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }


        const isMatch = await comparePassword(password, user.password);
        if (!isMatch)  throw new Error('Invalid credentials');

        const token = jwt.sign(
            { userid: user._id,name: user.name},
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const responseUser = {
            id: user._id,
            email: user.email,
            name: user.name
        };

        return res.status(200).json({ message: 'User logged in successfully', user: responseUser, token });
    } catch (error) {
        next(error);
    }
    };


    module.exports = {loginUser, registerUser};
