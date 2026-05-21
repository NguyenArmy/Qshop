import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, sendOtp, trackOtpRequests, validationRegistrationData } from "@qshop/utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { ValidationError } from "@packages/error-handler";




//register a new user
export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
 try{
   validationRegistrationData(req.body, "user");
  const [name, email] = req.body;

  const existingUser = await prisma.users.findUnique({
    where: { email }
  })
  if (existingUser) {
    return next(new ValidationError("Email already in use!"))
  };
  await checkOtpRestrictions(email, next);
  await trackOtpRequests(email, next);
  await sendOtp(email, name, "user-activation-mail");
  res.status(200).json({message: "Otp has been sent to your email"});







 }catch(err){
  return next(err);
 } 
  
}

