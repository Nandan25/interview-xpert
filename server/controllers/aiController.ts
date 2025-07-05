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
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const prompt: any = conceptExplanationPrompt(question);

        const data = await generateAIResponse(prompt);

        res.status(200).json({ data })
    } catch (error: any) {
        res.status(500).json({ message: "Failed to generate concept explanation", error: error.message })
    }
}