// types/Product.ts
export interface ProductType {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  featured: boolean
  createdAt?: string
  updatedAt?: string
}
