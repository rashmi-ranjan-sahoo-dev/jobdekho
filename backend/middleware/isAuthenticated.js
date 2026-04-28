import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = (req,res,next) =>{
    try{

        const authHeader = req.header.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
          return res.status(401).json({
            message: "No token provided",
            success: false
          });
        }

        const token = authHeader.split(" ");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;


    } catch(error){

        return res.status(401).json({
           message: "INvalid or expired token",
           success: false
        })
}
}