import { NextFunction, Request, Response } from "express";
import { validationRegistrationData } from "../utils/auth.helper";
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";




//register a new user
export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
  validationRegistrationData(req.body, "user");
  const [name, email] = req.body;

  const existingUser = await prisma.users.findUnique({
    where: { email }
  })
  if (existingUser) {
    return next(new ValidationError("Email already in use!"))
  };
  await checkOtpRestrictions(email, next);
}

