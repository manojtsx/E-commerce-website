const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = async() =>{
    try{
        const isConnect = await mongoose.connect(process.env.MONGODB_URI)
        if(!isConnect){
            throw new Error("Cannot connect to DB");
        }
        return "Connected to DB";
    }catch(err){
        return err.message;
    }
}

module.exports = connectDB;