import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./lib/db.js";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middlewares 
app.use(express.json({limit:"4mb"}));
app.use(cors());

app.use("/api/status", (req,res)=> res.send("Server is Live"));
app.use("/api/auth", userRouter);

//Connect to Database
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT,()=> console.log(`Server is running on PORT ${PORT}`));
