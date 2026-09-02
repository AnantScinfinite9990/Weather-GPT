import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    role: { type: String, enum: ['user', 'model', 'assistant', 'ai', 'system'], required: true },
    content: { type: String, required: true },
    id: String,
    persona: String,
    lang: String,
    timestamp: { type: String }
  }],
  updatedAt: { type: Date, default: Date.now }
});

export const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
