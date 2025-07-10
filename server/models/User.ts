import mongoose from 'mongoose';

const geminiUsageSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
    lastReset: { type: Date, default: new Date() },
});

const UserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    picture: { type: String, },

    geminiUsage: {
        type: geminiUsageSchema,
        default: () => ({ count: 0, lastReset: new Date() }),
    },


}, { timestamps: true });



export const User = mongoose.model('User', UserSchema);
