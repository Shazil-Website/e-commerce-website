'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { ProductType } from '@/types/Product'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export default function ProductDetailsPage() {
  const params = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState<ProductType | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          console.error('Product not found')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product)
      }
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link href="/products" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.featured && (
              <Badge className="absolute top-4 left-4 bg-orange-500">
                Featured
              </Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="destructive" className="absolute top-4 right-4">
                Only {product.stock} left!
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary" className="absolute top-4 right-4">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 uppercase tracking-wide">{product.category}</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">(4.0) • 127 reviews</span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Availability:</span>
            {product.stock > 0 ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2"
                disabled={product.stock === 0}
              >
                {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              size="lg"
              className="w-full sm:w-auto"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>

          {/* Features */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Product Details</h3>
          <div className="prose max-w-none">
            <p>{product.description}</p>
            <p className="mt-4">
              This high-quality {product.category} item is perfect for your needs. 
              Made with premium materials and backed by our satisfaction guarantee.
            </p>
            <ul className="mt-4 space-y-2">
              <li>• Premium quality construction</li>
              <li>• Fast and reliable shipping</li>
              <li>• 30-day return policy</li>
              <li>• Customer support available 24/7</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}