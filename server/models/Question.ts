import mongoose, { Mongoose } from 'mongoose';


const QuestionSchema = new mongoose.Schema({
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    question: { type: String, },
    answer: { type: String, },
    note: { type: String, },
    isPinned: { type: Boolean, default: false },
    explanation: {
        title: String,
        content: String
    },

}, { timestamps: true });



export const Question = mongoose.model('Question', QuestionSchema);
