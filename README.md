# E-Commerce Platform

A full-stack e-commerce platform built with Next.js 14, React, Stripe, and MongoDB.

## Features

- 🛍️ **Product Catalog**: Browse and search products with filtering and sorting
- 🛒 **Shopping Cart**: Add items to cart with persistent state
- 💳 **Secure Payments**: Stripe integration for secure payment processing
- 👤 **User Authentication**: Sign up, sign in, and user profiles with NextAuth.js
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 🔐 **Admin Dashboard**: Manage products and orders (admin access required)
- 📋 **Order Management**: View order history and track orders
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **UI Components**: shadcn/ui, Radix UI
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
JWT_SECRET=your_jwt_secret
```

4. Seed the database with sample data:
```bash
npm run seed:all
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Demo Accounts

After seeding the database, you can use these demo accounts:

**Admin Account:**
- Email: admin@example.com
- Password: password

**User Account:**
- Email: user@example.com
- Password: password

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── products/          # Product pages
│   └── ...
├── components/            # Reusable React components
├── contexts/             # React contexts (Cart, etc.)
├── lib/                  # Utility libraries
├── models/               # MongoDB models
├── scripts/              # Database seeding scripts
├── __tests__/            # Test files
└── ...
```

## API Routes

- `GET /api/products` - Get products with filtering/pagination
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `POST /api/stripe/create-payment-intent` - Create Stripe payment intent
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Deployment

The application is configured for static export and can be deployed to various platforms:

1. Build the application:
```bash
npm run build
```

2. Deploy the `out` directory to your hosting platform.

For Stripe webhooks in production, configure the webhook endpoint URL in your Stripe dashboard.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

MIT License - see LICENSE file for details.