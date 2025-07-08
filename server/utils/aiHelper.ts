import { GoogleGenAI } from "@google/genai";
import { AppLogger } from "./logger";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateAIResponse = async (prompt: any): Promise<string> => {
    AppLogger.info("Entering Generate AI Response controller");
    return ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    }).then((response: any) => {
        if (response && response.text) {
            let rawText = response.text;

            /*Clean it: Remove `` json and `` from beginning and end*/

            const cleanedText: any = rawText?.replace(/^```json\s*/, "").replace(/```$/, "").trim();

            const data = JSON.parse(cleanedText);

            return data;
        }

    }).catch((error) => {
        console.error(error);
        return "Error generating response.";
    });
};

