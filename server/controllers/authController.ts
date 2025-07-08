import { User } from "../models/User";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import { AppLogger } from "../utils/logger";

export const registerUser = async (req: any, res: any) => {
    try {
        AppLogger.info("Entering Register user controller");

        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        //Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: name,
            email: email,
            password: passwordHash,
        });


        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error: any) {
        AppLogger.error(`Error in Register user controller:${error.message}`);
        console.log(error.message); return res.status(400).json({ message: "Server error", error: error.message });
    }
};



export const getUserProfile = async (req: any, res: any) => {
    try {
        AppLogger.info("Entering Get user profile controller");

        const user = await User.findById(
            req.user.id
        ).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error: any) {
        AppLogger.error(`Error in Get user profile controller:${error.message}`);
        console.log(error.message); return res.status(400).json({ message: "Server error", error: error.message });
    }
};


