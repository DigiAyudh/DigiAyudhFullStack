import mongoose from 'mongoose'

const otpVerificationSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, index: true },
    countryCode: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String, sparse: true, unique: true },
  },
  { timestamps: true }
)

export default mongoose.model('OtpVerification', otpVerificationSchema)
