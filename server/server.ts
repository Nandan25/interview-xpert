import 'dotenv/config';
import express from "express";
import cors from 'cors';
import * as path from 'path';
import { connect } from './config/db';
import authRoutes from "./routes/authRoute"
import sessionRoutes from "./routes/sessionRoute"
import questionRoutes from "./routes/questionRoute"
import { protect } from './middlewares/authMiddleware';
import { generateConceptExplanation, generateInterviewQuestions } from './controllers/aiController';

const app = express();

app.use(express.json());
app.use(cors());

connect();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", protect, sessionRoutes);
app.use("/api/questions", protect, questionRoutes);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);

app.get('/ping', (req, res) => {
    res.send('OK');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })
