import 'dotenv/config';
import express from "express";
import cors from 'cors';
import * as path from 'path';
import { connect } from './config/db';
import profileRoutes from "./routes/profileRoute"
import sessionRoutes from "./routes/sessionRoute"
import questionRoutes from "./routes/questionRoute"
import authRoutes from "./routes/oauthRoutes"
import { protect } from './middlewares/authMiddleware';
import { generateConceptExplanation, generateInterviewQuestions } from './controllers/aiController';
require("./utils/passportHelper");
import passport from "passport"
import { AppLogger } from "./utils/logger";


const app = express();

app.use(express.json());
app.use(cors());

AppLogger.init(process.env.LOG_LEVEL || "info");

connect();

//Routes
app.use("/api/profile", profileRoutes);
app.use("/api/sessions", protect, sessionRoutes);
app.use("/api/questions", protect, questionRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);

app.use(passport.initialize());

app.get('/ping', (req, res) => {
    res.send('OK');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    AppLogger.info("Server started successfully.");
})
