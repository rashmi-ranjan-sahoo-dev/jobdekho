import {User} from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();


export const register = async (req,res) => {
    try{

        const {fullname, email, phoneNumber,password, role} = req.body;

        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

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


export const login = async (req, res) => {
    try{
        const {email, password, role} = req.body;

        if(!email || !password || !role){
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            })
        }

        const user = await User.findOne({ email});

        if(!user){
            return res.status(400).json({
                message: "User not found",
                success: false,
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            return res.status(400).json({
                message: "Invalid password",
                success: false,
            })
        }

        if(role !== user.role){
            return res.status(400).json({
                message: "Account dosen't exist with current role",
                success: false
            })
        }

        const token = jwt.sign({ userId: user._id,role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        return res.status(200).json({
            message: "User logged in successfully",
            success: true,
            token: token
        });

    }catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

export const updateProfile = async () =>{
  try{
       const {fullname, email, phoneNumber, bio, skills, password} = req.body;

       const file = req.file;

       if(!fullname || !email || !phoneNumber || !bio || !skills || !password) {
        return status(400).json({
            message: "Somthing is missing",
            success: false
        })
       }

       const skillsArray = skills.split(",");

       const userId = req.user.userId; // middleware authentication;

       let user = await User.findById(userId);

       if(!user){
        return res.status(400).json({
            message: "User not found",
            success: false
        })
       }

       //update data

       user.fullname = fullname;
       user.email = email;
       user.phoneNumber = phoneNumber;
       user.profile.bio = bio;
       user.profile.skills = skills;
       if(password) {
        const hashedPassword = await bcrypt.hash(password,10);
        user.password = hashedPassword;
       }

       //resume come later here..

       await user.save();

       return res.status(200).json({
            message: "Profile update succseefully",
            success:true,
            user: {
                _id: user._id,
                fullname = user.fullname,
                email:user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile

            }
       });

  }catch(error){
       console.error("Error when upadating profile:", error);
       return res.status(500).json({
        message:"Internal server error",
        success: false,
       })
  }
}