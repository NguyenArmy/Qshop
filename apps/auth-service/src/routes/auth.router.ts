import express, { Router } from "express";
import { loginUser, userRegister, verifyUser } from "../controller/auth.controller";

const router: Router = express.Router();

router.post("/user-registration", userRegister);
router.post("/verify-registration", verifyUser);
router.post("/login", loginUser);



export default router;
