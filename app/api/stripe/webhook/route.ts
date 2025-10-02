import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import dbConnect from '@/lib/mongoose'
import Order from '@/models/Order'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Missing stripe signature or webhook secret' },
        { status: 400 }
      )
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    await dbConnect()

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        
        // Find and update the order
        const order = await Order.findOne({
          totalPrice: paymentIntent.amount / 100,
          user: paymentIntent.metadata.userId,
          isPaid: false
        }).sort({ createdAt: -1 })

        if (order) {
          order.isPaid = true
          order.paidAt = new Date()
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            email_address: paymentIntent.receipt_email || ''
          }
          await order.save()
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}