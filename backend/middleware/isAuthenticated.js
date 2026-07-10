import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = async (req,res,next) =>{
    try{
      const token = req.cookies.token;

      if(!token){
        return res.status(401).json({
          message: "User not authenticated",
          success: false
        })
      }

      const decode = await jwt.verify(token, process.env.JWT_SECRET)


      if(!decode){
          return res.status(401).json({
            message: "Invalid token",
            success: false
          })
      }

      req.id = decode.userId;

      console.log("User from middleware:", req.id);

        next();
        
    } catch(error){

        return res.status(401).json({
           message: "Invalid or expired token",
           success: false
        })
}
}