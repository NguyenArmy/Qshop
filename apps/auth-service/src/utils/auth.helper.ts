import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendMail";
import { NextFunction } from "express";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validationRegistrationData = (data: any, userType: "user" | "seller") => {
  const { name, email, password, phone_number, country } = data;
  if (!name || !email || !password || (userType === "seller" && (!phone_number || !country))) {
    throw new ValidationError(`Missing required fields!`)

  }
  if (!emailRegex.test(email)) {
    throw new ValidationError(`Invalid email format!`)
  }

}
export const checkOtpRestrictions = async (email: string, next: NextFunction) => {

if(await redis.get(`otp_lock:${email}`)){
  return next(new ValidationError("Account locked due to multiple faild attempts! Try again after 30 minutes"))
}
if(await redis.get(`otp_spam_lock :${email}`)){
  return next(new ValidationError("Too many requests. Please try again later!"))
}
if(await redis.get(`otp_cooldown:${email}`)){
  return next(new ValidationError("Otp has been sent to your email, please wait 60 seconds"))
}
};
export const trackOtpRequests = async (email: string, next: NextFunction) => {
 const otpRequestKey = `otp_request_count:${email}`;
 let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0")

if(otpRequests >= 5){
  await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600) //lock for 1 hours
 return next(new ValidationError("Too many requests Otp. please wait 1 hour before requesting again."))

}
await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600)


};

export const sendOtp = async (name: string, email: string, template: string) => {
  const otp = crypto.randomInt(1000, 9999).toString();

  await sendEmail(email, "Activate Your QShop Account", template, { user: { name }, otp });

  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);




}
export const verifyOtp = async (email: string, otp: string, next: NextFunction) => {
  const storedOtp = await redis.get(`otp:${email}`);
  if(!storedOtp){
    throw new ValidationError("Invalid or expired OTP!")
  
  
  } 
  const failedAttemptsKey =`otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey))|| "0");
  if(storedOtp !== otp){
    if(failedAttempts >= 2){
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800) //lock for 30 minutes
      await redis.del(`otp:${email}`, failedAttemptsKey)
      
      
      throw new ValidationError("Account locked due to multiple faild attempts! Try again after 30 minutes")
    }
  
  await redis.set(failedAttemptsKey, failedAttempts +1, "EX", 300)
throw new ValidationError(`Invalid OTP. ${2 -failedAttempts} attempts left.`)
}

  


  await redis.del(`otp:${email}`, failedAttemptsKey)
    }
    

  

