const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true })

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

async function createAdmin() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set')
      process.exit(1)
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const User = mongoose.model('User', UserSchema)

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' })
    
    if (existingAdmin) {
      console.log('Admin user already exists')
      await mongoose.disconnect()
      return
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin'
    })

    await adminUser.save()
    console.log('Admin user created successfully')
    console.log('Email: admin@example.com')
    console.log('Password: password')

    // Create regular test user
    const testUser = new User({
      name: 'Test User',
      email: 'user@example.com',
      password: 'password',
      role: 'user'
    })

    await testUser.save()
    console.log('Test user created successfully')
    console.log('Email: user@example.com')
    console.log('Password: password')

    await mongoose.disconnect()
    console.log('Database connection closed')
  } catch (error) {
    console.error('Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()