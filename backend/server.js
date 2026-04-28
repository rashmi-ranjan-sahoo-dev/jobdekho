import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
import userRoute from './routes/user.route.js'

dotenv.config();
const app = express();

// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.use(cookieParser());
// const corsOptions = {
//     origin:'http://localhost:5173',
//     credentials:true,
// }
// app.use(cors(corsOptions));

app.use(cors());

app.use("api/v1/user",userRoute);

app.get('/backend', (req,res) => {
    res.status(200).json({message: `Hello from the backend!`});
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`)
})