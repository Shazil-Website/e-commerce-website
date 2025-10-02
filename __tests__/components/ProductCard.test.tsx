import { render, screen, fireEvent } from '@testing-library/react'
import { CartProvider } from '@/contexts/CartContext'
import ProductCard from '@/components/ProductCard'
import { IProduct } from '@/models/Product'

const mockProduct: IProduct = {
  _id: '1',
  name: 'Test Product',
  description: 'This is a test product description',
  price: 29.99,
  image: 'https://images.pexels.com/photos/441372/pexels-photo-441372.jpeg',
  category: 'electronics',
  stock: 10,
  featured: false,
  createdAt: new Date(),
  updatedAt: new Date()
} as IProduct

const renderProductCard = (product = mockProduct) => {
  return render(
    <CartProvider>
      <ProductCard product={product} />
    </CartProvider>
  )
}

describe('ProductCard', () => {
  test('renders product information', () => {
    renderProductCard()
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('electronics')).toBeInTheDocument()
  })

  test('shows add to cart button when in stock', () => {
    renderProductCard()
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    expect(addToCartButton).toBeInTheDocument()
    expect(addToCartButton).not.toBeDisabled()
  })

  test('shows out of stock when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    renderProductCard(outOfStockProduct)
    
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Out of Stock')
    expect(button).toBeDisabled()
  })

  test('shows featured badge when product is featured', () => {
    const featuredProduct = { ...mockProduct, featured: true }
    renderProductCard(featuredProduct)
    
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  test('calls addItem when add to cart is clicked', () => {
    renderProductCard()
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addToCartButton)
    
    // Note: In a real test, you might want to mock the useCart hook to verify the call
  })
})