import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../DB/models/userModel";

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from 'cloudinary'



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



export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "email already exists",
        err: "email",
      });
    }
    console.log(name);
    const user = new User({ name, email, password });
    await user.save();
    const token = generateJwtToken(
      user._id.toString(),
      user.email,
      "user",
      process.env.JWT_SECRET!
    );
    res.status(200).json({
      message: "user saved successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {

    
    const user = await User.findOne({ email });

    
    if (!user) {
      return res.status(400).json({
        message: "user not found",
        err: "user",
      });
    }
    const token=generateJwtToken(user._id.toString(),user.email,"user",process.env.JWT_SECRET!)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { 
      console.log('problem is ti match the password');
      
      return res.status(400).json({
        message: "incorrect password",
        err: "password",
      });
    } else {
      res.status(200).json({
        message: "login successful",
        token,
        user
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {


  const token: string = req.headers.authorization!
 
  if (!token) {
    return res.status(400).json({
      message: "token not found",
      err: "token",
    });
  }

  const payload: JwtPayload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
  
  
  const findUser = await User.findOne({ _id: payload.userId });
   

  if (!findUser) {
    return res.status(400).json({
      message: "user not found",
      err: "user",
    });
  } else {
    res.status(200).json({
      message: "user found",
      user: findUser
    });
  }
    
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const tokenPayload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = tokenPayload.userId;

    const { _name, _email, _oldPassword, _newPassword, _profilePic } = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (_newPassword) {
      const isMatch = await bcrypt.compare(_oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }
      user.password = _newPassword
    }
 
    user.name = _name || user.name;
    user.email = _email || user.email;
   
    if (_profilePic) {
     try {
      const result = await cloudinary.uploader.upload(_profilePic, {
        resource_type: "auto",
       });
       user.profileImg = result.secure_url;
     } catch (error) {
       console.log(error);
     }
    }

    await user.save();

    res.status(200).json({
      message: "user updated successfully",
      user
    });
  } catch (error) {
    next(error);
  }
};



