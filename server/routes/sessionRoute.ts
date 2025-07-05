import express from "express";
import bodyParser from "body-parser";
import { createSession, getSessionById, getMySessions, deleteSession } from "../controllers/sessionController";


const router = express();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.get("/my-sessions", getMySessions);
router.get("/:id", getSessionById);
router.post("/create", createSession);
router.delete("/:id", deleteSession);




export default router;