import express from "express";
import bodyParser from "body-parser";
import { togglePinQuestion, updateQuestionNote, addQuestionToSession } from "../controllers/questionController";


const router = express();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.post("/pin/:id", togglePinQuestion);
router.post("/note/:id", updateQuestionNote);
router.post("/add", addQuestionToSession);




export default router;