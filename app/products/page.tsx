'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductType } from '@/types/Product'

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'books', label: 'Books' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'toys', label: 'Toys' }
]

const sortOptions = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' }
]

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    search: searchParams.get('search') || '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      })

      const response = await fetch(`/api/products?${queryParams}`)
      const data = await response.json()
      
      setProducts(data.products || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters, pagination.page])

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.get('category') || 'all',
      search: searchParams.get('search') || ''
    }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [searchParams])

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    setFilters(prev => ({ ...prev, sortBy, sortOrder }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {filters.search ? `Search Results for "${filters.search}"` : 'All Products'}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Showing ${products.length} of ${pagination.total} products`}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filters.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              
              <div className="flex space-x-1">
                {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                  const pageNumber = pagination.page <= 3 
                    ? i + 1 
                    : pagination.page + i - 2
                  
                  if (pageNumber > pagination.pages) return null
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: pageNumber }))}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">
            {filters.search ? 'No products found matching your search.' : 'No products found.'}
          </p>
          {filters.search && (
            <Button onClick={() => {
              setFilters(prev => ({ ...prev, search: '', category: 'all' }))
              window.history.pushState({}, '', '/products')
            }}>
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}