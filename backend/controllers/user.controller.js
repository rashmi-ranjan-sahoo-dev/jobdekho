import {User} from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { z } from "zod";


dotenv.config();


//Register
export const register = async (req,res) => {
    try{

        // const {fullName, email, phoneNumber,password, role} = req.body;

        const isValid = z.object({
            fullName: z.
            string().min(3, "Full name must be at least 3 characters")
            .max(50, "Full name cannot exceed 50 chracters"),

            phoneNumber: z.string()
            .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),

            email: z.string()
            .email("Please enter a valid email address"),

            password: z
             .string()
             .min(8, "Password must be at least 8 characters")
             .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
             .regex(/[a-z]/, "Password must contain at least one lowercase letter")
             .regex(/[0-9]/, "Password must contain at least one number")
             .regex(/[@$!%*?&]/, "Password must contain at least one special character"),

             role: z.enum([ "user", "admin"])
            
        })

        const data = isValid.safeParse(req.body);

        if(!data.success){
            return res.status(400).json({
                error: data.error.issues,
                success: false
            })
        }

         const {fullName, email, phoneNumber,password, role} = req.body;


        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            password: hashedPassword,
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

        const isValid = z.object({
            email: z.string()
            .email("Please enter valid email"),

            password: z
             .string()
             .min(8, "Password must be at least 8 characters")
             .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
             .regex(/[a-z]/, "Password must contain at least one lowercase letter")
             .regex(/[0-9]/, "Password must contain at least one number")
             .regex(/[@$!%*?&]/, "Password must contain at least one special character"),

             role: z.enum([ "user", "admin"])
        })

        const data = isValid.safeParse(req.body);

        if(!data.success){
            res.status(400).json({
                error: data.error.issues,
                success: false,
            })
        }

        const {email, password, role} = req.body;

        let user = await User.findOne({ email });

        // if(!user){
        //     return res.status(400).json({
        //         message: "User not found",
        //         success: false,
        //     })
        // }

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

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        console.log(login);
        
      return res.status(200).cookie("token", token , {maxAge: 7 * 24 * 60 * 60 *1000, httpOnly : true, sameSite: 'strict'}).json({
        message:`Welcome back ${user.fullName}`,
        user,
        success: true
      })

    }catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

   // Logout  the user 

   export const logout = async (req,res) => {
        try{
            return res.status(200).cookie("token", {maxAge: 0}).json({
                message: "Logged out successfully",
                succsse: true
            })
         }catch(error) {
            console.error("Error during logout" , error);
            return res.status(500).json({
                message: "Internal server error",
                success: false
            })
         }

   }



export const updateProfile = async (req,res) =>{
  try{
       const {fullname, email, phoneNumber, bio, skills, password} = req.body;

       const file = req.file;

       if(!fullname || !email || !phoneNumber || !bio || !skills || !password) {
        return res.status(400).json({
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
                fullname : user.fullname,
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