import { User } from "../models/User";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";

export const registerUser = async (req: any, res: any) => {
    try {

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

        console.log(user);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error: any) { console.log(error.message); return res.status(400).json({ message: "Server error", error: error.message }); }
};

export const loginUser = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            email
        });
        if (user) {
            bcrypt.compare(password, user.password).then((resp) => {
                res.status(200).json({
                    token: generateToken(user._id),
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                });
            }).catch((e: any) => {
                console.log(e);
                res.status(500).json({ message: "Invalid email or password" })
            })
        }
        else {
            res.status(500).json({ message: "Invalid email or password" })
        }
    }
    catch (error: any) { console.log(error.message); return res.status(400).json({ message: "Server error", error: error.message }); }
};

export const getUserProfile = async (req: any, res: any) => {
    try {

        const user = await User.findById(
            req.user.id
        ).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error: any) {
        console.log(error.message); return res.status(400).json({ message: "Server error", error: error.message });
    }
};


