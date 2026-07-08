import mongoose from 'mongoose'

const companySchema = new mongoose.Schema(
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
    phone: String,
    industry: String,
    size: String,
    website: String,
    logo: String,
    address: String,
    city: String,
    country: String,
    postalCode: String,
    subscription: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    subscriptionEndDate: Date,
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Company', companySchema)
