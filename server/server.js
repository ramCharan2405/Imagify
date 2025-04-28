import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

import path from "path"
 
const PORT =process.env.PORT|| 4000;
const __dirname=path.resolve()
const app=express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

await connectDB()

app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)
app.get('/',(req,res)=>res.send("API Working fine"))

if (process.env.NODE_ENV === "production") {
    const clientBuildPath = path.join(__dirname, "./client/dist");

    app.use(express.static(clientBuildPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(clientBuildPath, "index.html"));
    });
}

app.listen(PORT,()=>console.log('Server running on port '+PORT))