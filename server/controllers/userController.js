import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

//Signup a new user
export const signup = async (req,res)=>{
    const {fullName, email, password, bio } = req.body;

    try{
        if(!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details"})
        }
        const user =  await User.findOne({email});

        if(user){
            return res.json({success: false, message: "Account already exits"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName, 
            email,password: hashedPassword,
            bio
        })

        const token = generateToken(newUser._id);

        req.json({success: true, userData: newUser, token, message: "Account created successfully"});

    } catch (error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Controller for login  a user
export const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const userData = await User.findOne({email});

        const isPasswordCorrect = await bcrypt.compare(password,userData.password);

        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid credentials"});
        }

        const token = generateToken(userData._id);
        res.json({success: true, userData, token, message: "Login Successful"});

    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Controller to check if user is logged in or not
export const checkAuth = (req,res)=>{
    res.json({success: true, user: req.user});
}

//Controller to update user profile details
export const updateProfile = async(req,res)=>{
    try {
        const {fullName, bio, profilePic} = req.body;

        const userid = req.user._id;
        let updatedUser;

        if(profilePic){
            await User.findByIdAndUpdate(userid,{bio, fullName}, {new:true});
        }else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userid, {profilePic: upload.secure_url,bio,fullName} , {new: true});
        }
    }catch(error){
        console.log(error.message);
        res.json({success: false,message: error.message})
    }
}