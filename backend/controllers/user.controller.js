import {User} from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { z } from "zod";
import cloudinary from "../utils/cloudinary.js"
import getDataUri from "../utils/datauri.js"


dotenv.config();


//Register
export const register = async (req,res) => {
    try{

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

         const file  = req.files?.profilePhoto?.[0];

        //  const fileUri = getDataUri(file);

        let profilePhoto;

        if(file){
            const fileUri = getDataUri(file);

            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

            profilePhoto = cloudResponse.secure_url;
        }

        //  const cloudResponse = await cloudnary.uploader.upload(fileUri.content);

         const user = await User.findOne({ email });

         if(user){
            return res.status(400).json({
                message: 'User already exist with this email',
                success: false
            })
         }


        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            password: hashedPassword,
            role: role,
            profile:{
                profilePhoto 
            }
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

  //User login
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

   // Logout user 
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

  // Update user profile
export const updateProfile = async (req,res) =>{
  try{

    const isValid = z.object({
        fullName: z
        .string()
        .min(3, "Full name must be at least 3 characters")
        .max(50, "Full name cannot exceed 50 characters")
        .optional(),

    email: z
        .string()
        .email("Please enter a valid email address")
        .optional(),

    phoneNumber: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number")
        .optional(),

    bio: z
        .string()
        .max(300, "Bio cannot exceed 300 characters")
        .optional(),

    skills: z
        .string()
        .optional()
    })

    const data = isValid.safeParse(req.body);

    if(!data.success){
        return res.status(400).json({
            message: "Validation failed",
            errors: data.error.issues,
            success: false
        })
    }

       const {fullName, email, phoneNumber, bio, skills, password} = req.body;

        const userId = req.id // middleware authentication;

       let user = await User.findById(userId);

       if(!user){
        return res.status(400).json({
            message: "User not found",
            success: false
        })
       }

       let skillsArray;

       if(skills){
        skillsArray = skills.split(",");
       }

       //update data
       if(fullName) user.fullName = fullName
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray
       if(password) {
        const hashedPassword = await bcrypt.hash(password,10);
        user.password = hashedPassword;
       }

    const profilePhoto = req.files?.profilePhoto?.[0];
    const resume = req.files?.resume?.[0];

    // update profilePhoto here
    if(profilePhoto){
        const fileUri = getDataUri(profilePhoto);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        user.profile.profilePhoto = cloudResponse.secure_url;
    }

    // update resume here
    if(resume){
        const fileUri = getDataUri(resume);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "auto"
    });

        user.profile.resume = cloudResponse.secure_url;
    }

       await user.save();

       return res.status(200).json({
            message: "Profile update succseefully",
            success:true,
            user: {
                _id: user._id,
                fullName : user.fullName,
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