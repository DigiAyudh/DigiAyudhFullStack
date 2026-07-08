import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    countryCode: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'employee', 'client'],
      required: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    companyType: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    termsAccepted: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: String,
    department: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

userSchema.index({ phone: 1, countryCode: 1 }, { unique: true, sparse: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.comparePassword = async function (passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password)
}

export default mongoose.model('User', userSchema)
