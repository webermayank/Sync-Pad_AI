import jwt from 'jsonwebtoken';

import user from '../models/user.js';

export const protect = async (req, res, next) => {
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return res.status(401).json({message: "Unauthorized , token missing"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await user.findById(decoded.userId).select("-password");
        next();
    }
    catch(err){
        console.error("Error verifying token", err);
        return res.status(401).json({message: "Unauthorized , invalid token"});
    }
}