import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AppLogger } from "../utils/logger";

// Middleware to protect routes

export const protect = async (req: any, res: any, next: any) => {
    try {
        AppLogger.info(`Entering in protect middleware`);

        let token = req.headers.authorization;

        const secret = process.env.JWT_SECRET ?? 'test-secret';

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded: any = jwt.verify(token, secret);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }
        else {
            res.status(401).json({ message: "Not authorized, no token" })
        }

    } catch (e: any) {
        console.log(e);
        AppLogger.error(`Error in protect middleware:${e.message}`);
        res.status(401).json({ message: "Token failed", error: e.message })
    }
}

export const limitGeminiUsage = async (req: any, res: any, next: any) => {
    try {
        const user = req.user; // Already populated by protect middleware
        const now = new Date();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (!user.geminiUsage) {
            user.geminiUsage = { count: 0, lastReset: now };
        }

        const lastReset = user.geminiUsage.lastReset || new Date(0);
        const timeSinceReset = now.getTime() - new Date(lastReset).getTime();

        if (timeSinceReset > twentyFourHours) {
            user.geminiUsage.count = 1;
            user.geminiUsage.lastReset = now;
        } else {
            if (user.geminiUsage.count >= 10) {
                return res.status(429).json({
                    error: "Daily Gemini API limit (10) reached. Try again after 24 hours.",
                });
            }
            user.geminiUsage.count += 1;
        }

        await user.save(); // Save updated usage
        res.set("X-Gemini-Remaining", (10 - user.geminiUsage.count).toString());
        next();
    } catch (error) {
        console.error("Error in limitGeminiUsage middleware:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};