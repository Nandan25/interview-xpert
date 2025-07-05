import { Question } from "../models/Question";
import { Session } from "../models/Session";


export const togglePinQuestion = async (req: any, res: any) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" })
        }

        question.isPinned = !question.isPinned;

        await question.save()

        res.status(200).json({
            success: true, question
        });

    } catch (error: any) { console.log(error.message); return res.status(500).json({ message: "Server error", success: false }); }
};

export const updateQuestionNote = async (req: any, res: any) => {
    try {
        const { note } = req.body;
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        question.note = note || "";
        await question.save();

        res.status(200).json({ success: true, question });

    }
    catch (error: any) { console.log(error.message); return res.status(500).json({ message: "Server error", success: false }); }
};

export const addQuestionToSession = async (req: any, res: any) => {
    try {
        const { sessionId, questions } = req.body;

        if (!sessionId || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: "Invalid input data" })
        }

        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: "Session not found" })
        }
        console.log(questions)
        const questionDocs = await Promise.all(
            questions.map(async (q: any) => {
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer
                });
                return question._id;
            })
        )

        session.questions.push(...questionDocs.map((q) => q._id));
        await session.save()

        res.status(201).json({
            success: true, questionDocs
        });

    }
    catch (error: any) { console.log(error.message); return res.status(500).json({ message: "Server error", success: false }); }
};






