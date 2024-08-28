import express from 'express';
import {
    registerUsers
} from "../controllers/authenticationControllers.js";

const router = express.Router();

router.route("/register").post(registerUsers);

export default router;