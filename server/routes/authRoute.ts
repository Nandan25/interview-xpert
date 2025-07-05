import express from "express";
import bodyParser from "body-parser";
import { registerUser, loginUser, getUserProfile } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware"

const router = express();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.get("/profile", protect, getUserProfile);
router.post("/login", loginUser);
router.post("/register", registerUser);




export default router;