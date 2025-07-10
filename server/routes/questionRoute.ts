import express from "express";
import bodyParser from "body-parser";
import { togglePinQuestion, updateQuestionNote, generateMoreQuestions } from "../controllers/questionController";
import { limitGeminiUsage } from "../middlewares/authMiddleware";


const router = express();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.post("/pin/:id", togglePinQuestion);
router.post("/note/:id", updateQuestionNote);
router.post("/generate-more/:id", limitGeminiUsage, generateMoreQuestions);




export default router;