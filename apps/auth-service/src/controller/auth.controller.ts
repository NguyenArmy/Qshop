import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, sendOtp, trackOtpRequests, validationRegistrationData, verifyOtp } from "@/utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";




//register a new user
export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validationRegistrationData(req.body, "user");
    const {name, email} = req.body;

    const existingUser = await prisma.users.findUnique({
      where: { email }
    })
    if (existingUser) {
      return next(new ValidationError("Email already in use!"))
    };
    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);

    await sendOtp(email, name, "user-activation-mail");
    res.status(200).json({ message: "Otp has been sent to your email" });
    







  } catch (err) {
    return next(err);
  }

}


//verify user with otp
export const verifyUser = async(req:Request, res:Response, next:NextFunction)=>{

  try {
    const {email, otp, password, name} = req.body;
    if(!email || !otp || !password || !name){
      return next(new ValidationError("All fields are required!"));
    }
    await verifyOtp(email, otp, next)
    const hashPassword = await bcrypt.hash(password, 10);
    
    await prisma.users.create({
      data:{
        name, email, password: hashPassword
      }

    })
  
    res.status(201).json({
      success: true, message: "User created successfully!"})
  
  } catch (error) {
    return next(error);
    
  }
}

