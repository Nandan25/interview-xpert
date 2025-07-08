import { Question } from "../models/Question";
import { Session } from "../models/Session";
import { generateAIResponse } from "../utils/aiHelper";
import { AppLogger } from "../utils/logger";
import { questionAnswerPrompt } from "../utils/prompts";

export const getMySessions = async (req: any, res: any) => {
    try {
        AppLogger.info("Entering Get user sessions controller");

        const userId = req.user.id;
        const sessions = await Session.find(
            { user: userId }
        ).sort({ createdAt: -1 }).populate("questions")
        if (!sessions) {
            return res.status(404).json({ message: "Sessions not found" });
        }
        res.status(200).json({ success: true, sessions });

    }
    catch (error: any) {
        AppLogger.error(`Error in Get user sessions controller:${error.message}`);
        console.log(error.message); return res.status(500).json({ message: "Server error", success: false });
    }
};

export const getSessionById = async (req: any, res: any) => {
    try {
        AppLogger.info("Entering Get session by id controller");

        const sessionId = req.params.id;
        const session = await Session.findById(
            sessionId
        ).populate({ path: "questions", options: { sort: { isPinned: -1, createdAt: 1 } } }).exec()
        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }
        res.status(200).json({ success: true, session });

    }
    catch (error: any) {
        AppLogger.error(`Error in Get session by id controller:${error.message}`);
        console.log(error.message); return res.status(500).json({ message: "Server error", success: false });
    }
};

export const deleteSession = async (req: any, res: any) => {
    try {
        AppLogger.info("Entering Delete session controller");

        const sessionId = req.params.id;
        const session = await Session.findById(sessionId)
        if (session?.user?.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to delete this session" })
        }
        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }
        //First delete all questions linked to this session
        await Question.deleteMany({ session: session._id });

        //Delete the session
        await session.deleteOne();


        res.status(200).json({ success: true, message: "Session deleted successfully" });

    }
    catch (error: any) {
        AppLogger.error(`Error in Delete session controller:${error.message}`);
        console.log(error.message); return res.status(500).json({ message: "Server error", success: false });
    }
};

export const createSession = async (req: any, res: any) => {
    try {
        AppLogger.info("Entering Create session controller");

        const { role, experience, focusTopics, description = "", numberOfQuestions = 20 } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!role || !experience || !focusTopics) {
            return res.status(400).json({ message: "Missing required fields", success: false });
        }

        // Step 1: Generate Questions Internally
        const prompt = questionAnswerPrompt(role, experience, focusTopics, description, numberOfQuestions);
        const aiData = await generateAIResponse(prompt);

        if (!aiData || !Array.isArray(aiData)) {
            return res.status(500).json({ message: "Failed to generate questions", success: false });
        }

        // Step 2: Create the session
        const session: any = await Session.create({
            user: userId,
            role,
            experience,
            focusTopics,
            description,
        });

        // Step 3: Save generated questions to DB
        if (aiData.length > 0) {
            const questionDocs = await Promise.all(
                aiData.map(async (q: any) => {
                    const question = await Question.create({
                        session: session._id,
                        question: q.question,
                        answer: q.answer,
                    });
                    return question._id;
                })
            );

            session.questions = questionDocs;
        }

        await session.save();

        res.status(201).json({ success: true, session });
    } catch (error: any) {
        AppLogger.error(`Error in Create session controller:${error.message}`);
        return res.status(500).json({ message: "Server error", success: false });
    }
};


