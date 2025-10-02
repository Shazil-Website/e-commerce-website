const mongoose = require('mongoose')

// Simple product model for seeding
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true })

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-canceling wireless headphones with 30-hour battery life and crystal-clear sound quality.",
    price: 199.99,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
    category: "electronics",
    stock: 50,
    featured: true
  },
  {
    name: "Smart Fitness Watch",
    description: "Track your health and fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, and sleep tracking.",
    price: 299.99,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    category: "electronics",
    stock: 30,
    featured: true
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors and sizes.",
    price: 24.99,
    image: "https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg",
    category: "clothing",
    stock: 100,
    featured: false
  },
  {
    name: "Professional Camera",
    description: "High-resolution digital camera perfect for photography enthusiasts and professionals.",
    price: 899.99,
    image: "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg",
    category: "electronics",
    stock: 15,
    featured: true
  },
  {
    name: "Best-Selling Novel",
    description: "An engaging and thought-provoking novel that has captivated readers worldwide.",
    price: 14.99,
    image: "https://images.pexels.com/photos/1261180/pexels-photo-1261180.jpeg",
    category: "books",
    stock: 200,
    featured: false
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat made from eco-friendly materials, perfect for all types of yoga practice.",
    price: 49.99,
    image: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg",
    category: "sports",
    stock: 75,
    featured: false
  },
  {
    name: "Smart Home Speaker",
    description: "Voice-controlled smart speaker with premium sound quality and built-in virtual assistant.",
    price: 129.99,
    image: "https://images.pexels.com/photos/4790263/pexels-photo-4790263.jpeg",
    category: "electronics",
    stock: 40,
    featured: true
  },
  {
    name: "Skincare Gift Set",
    description: "Luxurious skincare set with cleanser, toner, serum, and moisturizer for all skin types.",
    price: 79.99,
    image: "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg",
    category: "beauty",
    stock: 60,
    featured: false
  },
  {
    name: "Indoor Plant Collection",
    description: "Beautiful collection of low-maintenance indoor plants perfect for home or office decoration.",
    price: 39.99,
    image: "https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg",
    category: "home",
    stock: 85,
    featured: false
  },
  {
    name: "Educational Building Blocks",
    description: "Creative building blocks set that promotes STEM learning and develops problem-solving skills.",
    price: 34.99,
    image: "https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg",
    category: "toys",
    stock: 120,
    featured: true
  }
]

async function seedProducts() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set')
      process.exit(1)
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const Product = mongoose.model('Product', ProductSchema)

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Insert sample products
    const result = await Product.insertMany(sampleProducts)
    console.log(`Successfully seeded ${result.length} products`)

    await mongoose.disconnect()
    console.log('Database connection closed')
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()