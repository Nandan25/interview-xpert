import { generateToken } from "../utils/generateToken";

import passport from "passport";
import express from "express";

const router = express();

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/error",
        session: false
    }),
    function async(req: any, res: any) {
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.UI_URL}success-login?access_token=${token}`)

    }
);


router.get("/google",
    passport.authenticate("google",
        { scope: ['profile', 'email'] }));



export default router;
