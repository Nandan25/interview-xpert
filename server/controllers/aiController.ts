import { Question } from "../models/Question";
import { generateAIResponse } from "../utils/aiHelper";
import { conceptExplanationPrompt, questionAnswerPrompt } from "../utils/prompts";


export const generateInterviewQuestions = async (req: any, res: any) => {
    try {

        const { role, experience, focusTopics, description = "", numberOfQuestions } = req.body;

        if (!role || !experience || !focusTopics || !numberOfQuestions) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const prompt: any = questionAnswerPrompt(role, experience, focusTopics, description, numberOfQuestions);

        const data = await generateAIResponse(prompt);

        res.status(200).json({ data })

    } catch (error: any) {
        res.status(500).json({ message: "Failed to generate questions", error: error.message })
    }

}

export const generateConceptExplanation = async (req: any, res: any) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const question: any = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // If explanation already exists, return it
        if (question.explanation && question.explanation.content) {
            return res.status(200).json({
                title: question.explanation.title,
                explanation: question.explanation.content
            });
        }

        // Generate explanation using AI
        const prompt = conceptExplanationPrompt(question.question);
        const data: any = await generateAIResponse(prompt);

        const title = data?.title || "Concept Explanation";
        const content = data?.explanation || "No explanation available.";

        // Save it to DB
        question.explanation = { title, content };
        await question.save();

        // Return the new explanation
        res.status(200).json({ title, explanation: content });

    } catch (error: any) {
        res.status(500).json({
            message: "Failed to generate concept explanation",
            error: error.message
        });
    }
};
