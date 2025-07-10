import { Question } from "../models/Question";
import { Session } from "../models/Session";
import { generateAIResponse } from "../utils/aiHelper";
import { AppLogger } from "../utils/logger";
import { addMoreQuestionPrompt } from "../utils/prompts";


export const togglePinQuestion = async (req: any, res: any) => {
    try {
        AppLogger.info("Entering Toggle Pin question controller");

        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" })
        }

        question.isPinned = !question.isPinned;

        await question.save()

        res.status(200).json({
            success: true, question
        });

    } catch (error: any) {
        AppLogger.error(`Error in Toggle Pin question controller:${error.message}`);
        console.log(error.message); return res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateQuestionNote = async (req: any, res: any) => {
    try {
        AppLogger.info("Entering Update question note controller");

        const { note } = req.body;
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        question.note = note || "";
        await question.save();

        res.status(200).json({ success: true, question });

    }
    catch (error: any) {
        AppLogger.error(`Error in Update question note controller:${error.message}`);
        console.log(error.message); return res.status(500).json({ message: "Server error", success: false });
    }
};

export const generateMoreQuestions = async (req: any, res: any) => {
    try {
        AppLogger.info("Entering Generate more Questions controller");
        const sessionId = req.params.id;
        let previouslyGeneratedQuestionStrings = [];

        // Validate input
        if (!sessionId) {
            return res.status(400).json({ message: "Session details missing", success: false });
        }

        const sessionData: any = await Session.findById(
            sessionId
        ).populate({ path: "questions" }).exec()

        if (sessionData && sessionData.questions.length > 0) {
            if (sessionData.questions.length < 30) {
                previouslyGeneratedQuestionStrings = sessionData.questions.map((q: any) => q.question);
            } else {

                return res.status(400).json({
                    message: "You cannot generate more than 30 questions per session.", success: false
                });
            }
        }

        const prompt = addMoreQuestionPrompt(
            sessionData.role,
            sessionData.experience,
            sessionData.focusTopics,
            3,
            previouslyGeneratedQuestionStrings
        );

        const aiData = await generateAIResponse(prompt);

        if (!aiData || !Array.isArray(aiData)) {
            return res.status(500).json({ message: "Failed to generate questions", success: false });
        }

        if (aiData.length > 0) {
            const questionDocs = await Promise.all(
                aiData.map(async (q: any) => {
                    const question = await Question.create({
                        session: sessionId,
                        question: q.question,
                        answer: q.answer,
                    });
                    return question._id;
                })
            );

            sessionData.questions.push(...questionDocs);
        }

        await sessionData.save();

        res.status(201).json({ success: true, sessionData });

    } catch (error: any) {
        AppLogger.error(`Error in Generate more Questions controller:${error.message}`);
        return res.status(500).json({ message: "Server error", success: false });
    }
};






