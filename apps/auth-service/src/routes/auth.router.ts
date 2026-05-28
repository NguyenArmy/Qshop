import express, { Router } from "express";
import { userRegister, verifyUser } from "@/controller/auth.controller";

const router: Router = express.Router();

router.post("/user-registration", userRegister);
router.post("/verify-registration",verifyUser)



export default router;
