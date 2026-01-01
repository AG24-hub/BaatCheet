const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

const protect  = expressAsyncHandler(async (req, res, next)=> {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token = req.headers.authorization.split(" ")[1]; //token looks like Bearer ygkjhdiutgliug
            //token decoding done here
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password")
            next()
        }catch(error){
            res.status(401)
            throw new Error("Not authorized, token failed")
        }
    }
    if(!token){
        res.status(401)
        throw new Error("Not authorized, no token") 
    }
})

module.exports = {protect}