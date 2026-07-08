import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['projects', 'employees', 'tasks', 'finances', 'leads'],
      required: true,
    },
    filters: mongoose.Schema.Types.Mixed,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Report', reportSchema)
