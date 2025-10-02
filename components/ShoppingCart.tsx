'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import LoginDialog from '@/components/LoginDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ShoppingCart() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, totalPrice, updateQuantity, removeItem } = useCart()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!session) {
      setShowLoginDialog(true)
      return
    }
    
    setLoading(true)
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    router.push('/checkout')
    setLoading(false)
  }

  const handleLoginSuccess = () => {
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart to get started</p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shopping Cart ({items.length} items)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex items-center space-x-4 p-4 border rounded-lg overflow-auto">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              
              <div className="flex-grow">
                <Link href={`/products/${item._id}`}>
                  <h3 className="font-medium hover:text-indigo-600 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                <p className="font-semibold text-indigo-600">${item.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="font-semibold min-w-[80px] text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-2xl font-bold text-indigo-600">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex space-x-4">
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Button 
              onClick={handleCheckout}
              disabled={loading}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proceed to Checkout
            </Button>
          </div>
        </CardContent>
      </Card>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSuccess={handleLoginSuccess}
      />
    </div>
  )
}