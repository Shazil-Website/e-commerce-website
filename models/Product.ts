import mongoose from 'mongoose'

export interface IProduct extends mongoose.Document {
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Please provide a product image'],
    default: 'https://images.pexels.com/photos/441372/pexels-photo-441372.jpeg'
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    enum: ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)