import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {UserModel,BookingModel} from "../Models/User.js";
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const Booking = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(email);
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User already exist, you can login', success: false });
        }
        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
       
        await userModel.save();
        
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        console.log(err);
        res.status(500)
            .json({
                message: err,
                success: false
            })
    }
}