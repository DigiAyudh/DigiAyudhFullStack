import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Company from '../models/Company.js'

dotenv.config()

const seedAdmin = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/digiayudh'
  await mongoose.connect(mongoUri)

  const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@digiayudh.com'
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123456'
  const adminName = process.env.SUPER_ADMIN_NAME || 'Super Admin'

  const existing = await User.findOne({ email: adminEmail })
  if (existing) {
    console.log(`Super Admin already exists: ${adminEmail}`)
    await mongoose.disconnect()
    return
  }

  const admin = await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    isActive: true,
    termsAccepted: true,
  })

  const company = await Company.create({
    name: 'DigiAyudh',
    email: adminEmail,
    adminId: admin._id,
  })

  admin.company = company._id
  await admin.save()

  console.log('Super Admin created successfully')
  console.log(`  Email:    ${adminEmail}`)
  console.log(`  Password: ${adminPassword}`)
  console.log('  Change the password after first login in production.')

  await mongoose.disconnect()
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
