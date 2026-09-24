const usermodel = require('../models/user.model');
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




const registerUser = async (req, res, next) => {
    const registerSchema = joi.object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {const {email,name,password} = req.body;
    const existingUser = await usermodel.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);
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
        const loginSchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(6).required()
        });
const { error } = loginSchema.validate(req.body);
if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
try {
    const { email, password } = req.body;
        const user = await usermodel.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
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
