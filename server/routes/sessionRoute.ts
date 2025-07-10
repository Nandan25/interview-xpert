import express from "express";
import bodyParser from "body-parser";
import { createSession, getSessionById, getMySessions, deleteSession } from "../controllers/sessionController";
import { limitGeminiUsage } from "../middlewares/authMiddleware";


const router = express();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.get("/my-sessions", getMySessions);
router.get("/:id", getSessionById);
router.post("/create", limitGeminiUsage, createSession);
router.delete("/:id", deleteSession);




export default router;