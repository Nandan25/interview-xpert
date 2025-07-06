import passport from "passport"
import { User } from "../models/User";
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const API_BASE_URL = process.env.API_BASE_URL;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${API_BASE_URL}/api/auth/google/callback`
        },
        async function (accessToken: any, refreshToken: any, profile: any, done: any) {
            try {

                const user = await User.findOneAndUpdate({ googleId: profile.id }, {
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    picture: profile.photos[0].value
                }, { upsert: true, new: true });


                return done(null, user);

            } catch (e) {
                return done(e, null);
            }
        }
    )
);

passport.serializeUser(function (user: any, done: any) {
    done(null, user);
});
passport.deserializeUser(function (user: any, done: any) {
    done(null, user);
});

module.exports = passport;
