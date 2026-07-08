import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    salary: Number,
    joiningDate: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: String,
    city: String,
    country: String,
    emergencyContact: String,
    emergencyPhone: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Employee', employeeSchema)
