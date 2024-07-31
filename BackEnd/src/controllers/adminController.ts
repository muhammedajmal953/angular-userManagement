import User from "../DB/models/userModel";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import { validationResult } from 'express-validator';



function generateJwtToken(
    userId: string,
    email: string,
    type: string,
    secretKey: string
  ) {
    const payload = { userId, email, type };
    const options = { expiresIn: "6h" };
    return jwt.sign(payload, secretKey, options);
  }
export const adminLogin=async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const { email, password } = req.body
        const admin =await User.findOne({ email, isAdmin: true })
        if (!admin) {
            return res.status(400).json({
                message: "admin not found",
                err: "admin",
            })
        }  

        const token=generateJwtToken(admin._id.toString(),admin.email,"admin",process.env.JWT_SECRET!)
   
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(400).json({
                message: "incorrect password",
                err: "password",
            })
        }



        res.status(200).json({
            message: "login successful",
            admin,
            token
        })
    } catch (error) {
        next(error)
    }

 
}

export const getAllUsers=async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const users=await User.find({isAdmin:false})
        res.status(200).json({
            users
        })
    } catch (error) {
        next(error)
    }
}

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        const { _name, _email, _password, _profilePic } = req.body;
    
        const existingUser = await User.findOne({ email: _email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
    
        
    
        const newUser = new User({
            name: _name,
            email: _email,
            password: _password,
          });
      
        if (_profilePic) {
          try {
            const uploadResponse = await cloudinary.uploader.upload(_profilePic, {
              folder: 'user_profiles',
            });
            newUser.profileImg= uploadResponse.secure_url;
          } catch (error) {
            return res.status(500).json({ message: 'Error uploading image' });
          }
        }
    

    
        await newUser.save();
    
        res.status(201).json({ message: 'User created successfully', user: newUser });
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
}
export const editUser=async(req:Request,res:Response,next:NextFunction)=>{
  const { id } = req.params
  
  const { _name, _email, _oldPassword, _newPassword, _profilePic } = req.body
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    user.name = _name || user.name
    user.email = _email || user.email
    if(_newPassword){
      const isMatch = await bcrypt.compare(_oldPassword, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" })
      }
      user.password = _newPassword
    }
    if (_profilePic) {
      try {
        const result = await cloudinary.uploader.upload(_profilePic, {
          resource_type: "auto",
        })
        user.profileImg = result.secure_url
      } catch (error) {
        console.log(error)
      }
    }
    await user.save()
    res.status(200).json({
      message: "user updated successfully", 
      user
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}