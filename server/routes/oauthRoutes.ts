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

// router.get('/user',
//     passport.authenticate('jwt', { session: false }),
//     function async(req: any, res: any) {
//         try {
//             if (!req.user) {
//                 res.status(401).json({ message: 'User not authinticated' })
//             }
//             res.json({
//                 user: req.user
//             })
//         } catch (error) {
//             console.error('Error fetching user details', error)
//             res.status(500).json({ message: 'Internal server error' })
//         }
//     }
// )

export default router;
