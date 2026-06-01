import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, handleForgotPassword, sendOtp, trackOtpRequests, validationRegistrationData, verifyForgotPasswordOtp, verifyOtp } from "@/utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { AuthError, ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "@/utils/cookies/setCookie";




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

    await sendOtp(name, email, "user-activation-mail");
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
      return next(new ValidationError("all the input fields are required!"));
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

//login user
export const loginUser = async(req: Request, res: Response, next: NextFunction)=>{
  try {
    const {email,password} = req.body;
    if(!email || !password){
      return next(new ValidationError("Email or password are required!"))
    }

    const user = await prisma.users.findUnique({
      where:{email}
    })
    if (!user){
      return next(new AuthError("User doesn't exist!"))
    }
    //verify password

    const isMatch = await bcrypt.compare(password, user.password!);
    if(!isMatch){
      return next(new AuthError("invalid email or password"))
    }

    //generate access token and refresh token
    
    //access token 15 phut
    const accessToken = jwt.sign({id: user?.id, role:"user"}, process.env.ACCESS_TOKEN_SECRET as string,{expiresIn: "15m"})
    //refresh token 7 ngay
    const refreshToken = jwt.sign({id: user?.id, role:"user"}, process.env.REFRESH_TOKEN_SECRET as string,{expiresIn: "7d"})

    //store the refresh and access token in an httpOnly secure cookie
    setCookie(res, "refresh_token", refreshToken);
    setCookie(res, "access_token", accessToken);

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
     
  } catch (error) {
    return next(error)
  }
}


//user quen password
export const userForgotPassword = async(req: Request, res: Response, next: NextFunction) => {
  
await handleForgotPassword(req, res, next, "user");


}

//verify forgot password otp
export const verifyForgotPassword = async(req: Request, res: Response, next: NextFunction) => {
  try {

    await verifyForgotPasswordOtp(req, res, next);

    
  } catch (error) {
    
  }
} 



//reset user password
export const resetUserPassword = async(req: Request, res: Response, next: NextFunction) => {
  try {

    const {email, newPassword} = req.body;
    if(!email || !newPassword) {
      return next(new ValidationError("Email or new password are required!"))
    }


    const user = await prisma.users.findUnique({where:{email}})
    if(!user){
      return next(new AuthError("User doesn't exist!"))
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password!);

  if(isSamePassword){
    return next(new ValidationError("new password cannot be the same as the old password!"))
  }

  //hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
    
  await prisma.users.update({
    where: { email },
    data: { password: hashedPassword }
  });

  res.status(200).json({
    success: true,
    message: "Password reset successfully!"
  });

  } catch (error) {
    return next(error);
  }
}