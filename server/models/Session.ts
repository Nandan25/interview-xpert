import mongoose, { Mongoose } from 'mongoose';


const SessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, required: true },
    experience: { type: String, required: true },
    focusTopics: { type: String, required: true },
    description: { type: String },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],

}, { timestamps: true });



export const Session = mongoose.model('Session', SessionSchema);
