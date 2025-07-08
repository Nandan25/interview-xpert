import express from "express";
import bodyParser from "body-parser";
import { togglePinQuestion, updateQuestionNote, generateMoreQuestions } from "../controllers/questionController";


const router = express();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.post("/pin/:id", togglePinQuestion);
router.post("/note/:id", updateQuestionNote);
router.post("/generate-more/:id", generateMoreQuestions);




export default router;