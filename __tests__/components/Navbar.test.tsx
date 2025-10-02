import { render, screen } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/contexts/CartContext'
import Navbar from '@/components/Navbar'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

const renderNavbar = (session = null) => {
  return render(
    <SessionProvider session={session}>
      <CartProvider>
        <Navbar />
      </CartProvider>
    </SessionProvider>
  )
}

describe('Navbar', () => {
  test('renders logo and navigation links', () => {
    renderNavbar()
    
    expect(screen.getByText('ECommerce')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument()
  })

  test('shows sign in/sign up buttons when not authenticated', () => {
    renderNavbar()
    
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  test('shows user menu when authenticated', () => {
    const mockSession = {
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com'
      },
      expires: '2024-01-01'
    }
    
    renderNavbar(mockSession)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  test('renders search input', () => {
    renderNavbar()
    
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument()
  })
})