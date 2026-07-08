import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    participantNames: [String],
    lastMessage: String,
    lastMessageTime: Date,
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: String,
    groupImage: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Chat', chatSchema)
