import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    company: String,
    source: {
      type: String,
      enum: ['website', 'referral', 'email', 'social', 'other'],
      default: 'website',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal', 'closed'],
      default: 'new',
    },
    budget: Number,
    notes: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Lead', leadSchema)
