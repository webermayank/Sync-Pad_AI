import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

router.post('/register', async (req, res) => {
    try {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const user = new User({email, password});
        await user.save();

        const payload ={
            userId: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || "15d"});

        res.status(201).json({
            token,
            user:{id: user._id, email: user.email, createdAt: user.createdAt,},
        })
    }
    catch{
        console.error("Error registering user", err);
        res.status(500).json({message: "Internal server error"});
    }
})

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */

router.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const payload ={
            userId: user._id,
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || "15d"}
        );
        
        res.json({
            token,
            user:{id: user._id, email: user.email, createdAt: user.createdAt,},
        })
    }
    catch(err){
        console.error("Error logging in", err);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;