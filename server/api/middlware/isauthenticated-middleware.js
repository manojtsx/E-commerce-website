const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const isAuthenticatedMiddleware = async(req,res,next) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) return res.status(401).json({msg : 'No token, authorization denied.'});
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if(!req.user) return res.status(403).json({msg : 'Access denied'});
        next();
    }catch(err){
        res.status(400).json({msg : 'Token isnot valid.'})
    }
}
module.exports = isAuthenticatedMiddleware;