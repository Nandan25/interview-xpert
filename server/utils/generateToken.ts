import jwt from "jsonwebtoken";

//Generate JWT
export const generateToken = (userId: any) => {
    const secret = process.env.JWT_SECRET ?? 'test-secret';
    return jwt.sign({ id: userId }, secret, { expiresIn: "7d" })
}