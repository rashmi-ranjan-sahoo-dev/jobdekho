import {User} from '../models/user.model.js';
import bcrypt from "bcryptjs";


export const registerUser = async (req,res) => {
    try{

        const {fullname, email, phoneNumber,password, role} = req.body;

        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        c

        await User.create({
            fullname: fullname,
            email: email,
            PhoneNumber: phoneNumber,
            Password: hashedPassword,
            role: role
        })
        return res.status(201).json({
            message: "User registered successfully",
            success: true,
        })
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}