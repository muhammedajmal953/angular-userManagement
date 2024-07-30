import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../DB/models/userModel";

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";



function generateJwtToken(
  userId: string,
  email: string,
  type: string,
  secretKey: string
) {
  const payload = { userId, email, type };
  const options = { expiresIn: "1h" };
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
    console.log(email);
    
    const user = await User.findOne({ email });
    console.log(user);
    
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
  
  const payload: JwtPayload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
  
  console.log(payload); 
  
  
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