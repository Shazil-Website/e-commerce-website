import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongoose'
import Order from '@/models/Order'
import Product from '@/models/Product'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()
    
    const orders = await Order.find({ user: session.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()
    
    const { items, shippingAddress, totalPrice } = await request.json()

    // Validate stock availability
    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.name} not found` },
          { status: 400 }
        )
      }
      
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name}` },
          { status: 400 }
        )
      }
    }

    // Create order
    const order = new Order({
      user: session.user.id,
      items,
      shippingAddress,
      totalPrice,
      paymentMethod: 'stripe'
    })

    await order.save()

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      )
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}