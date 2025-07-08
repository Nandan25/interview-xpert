import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { error } from "console";
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