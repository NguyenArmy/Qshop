import express, { Router } from "express";
import { userRegister } from "@/controller/auth.controller";

const router: Router = express.Router();

router.post("/user-registration", userRegister);



export default router;
