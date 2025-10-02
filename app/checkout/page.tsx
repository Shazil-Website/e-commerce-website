'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, CreditCard, MapPin, Package } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/hooks/use-toast'
import LoginDialog from '@/components/LoginDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

interface ShippingAddress {
  fullName: string
  address: string
  city: string
  postalCode: string
  country: string
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { toast } = useToast()
  
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States'
  })

  useEffect(() => {
    // If cart is empty, redirect to products page
    if (items.length === 0) {
      router.push('/products')
      return
    }

    // If user is not authenticated, show login dialog
    if (status === 'loading') return // Still loading session
    
    if (!session) {
      setShowLoginDialog(true)
    }
  }, [session, status, items.length, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleCreateOrder = async () => {
    if (!session) {
      setShowLoginDialog(true)
      return
    }

    setLoading(true)
    
    try {
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            product: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          shippingAddress,
          totalPrice
        })
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const order = await orderResponse.json()
      
      // Create payment intent
      setProcessingPayment(true)
      const paymentResponse = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice,
          currency: 'usd'
        })
      })

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret } = await paymentResponse.json()
      
      // For demo purposes, simulate successful payment
      // In a real app, you would integrate with Stripe Elements here
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        variant: "success",
        title: "Order Placed Successfully!",
        description: `Your order #${order._id.slice(-8)} has been placed and payment processed.`
      })
      
      clearCart()
      router.push('/')
      
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: error.message || "An error occurred during checkout. Please try again."
      })
    } finally {
      setLoading(false)
      setProcessingPayment(false)
    }
  }

  const handleLoginSuccess = () => {
    toast({
      variant: "success",
      title: "Login Successful",
      description: "You can now proceed with your checkout."
    })
  }

  const isFormValid = () => {
    return Object.values(shippingAddress).every(value => value.trim() !== '')
  }

  if (items.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-2">Complete your order below</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(totalPrice * 0.08).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${(totalPrice * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Information */}
        <div className="lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    placeholder="United States"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Demo Mode:</strong> This is a demonstration checkout. No real payment will be processed.
                </p>
              </div>
              
              <Button
                onClick={handleCreateOrder}
                disabled={!session || !isFormValid() || loading || processingPayment}
                size="lg"
                className="w-full"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Order...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Complete Order (${(totalPrice * 1.08).toFixed(2)})
                  </>
                )}
              </Button>
              
              {!session && (
                <p className="text-sm text-gray-600 text-center mt-2">
                  Please sign in to complete your order
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSuccess={handleLoginSuccess}
      />
    </div>
  )
}
