import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    messages: [
        {
            role: { type: String, enum: ['user', 'bot'], required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true })

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
