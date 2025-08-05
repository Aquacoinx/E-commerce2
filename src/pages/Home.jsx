import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Gift, TrendingUp } from 'lucide-react'
import { db } from '../lib/supabase'
import { categories } from '../lib/utils'
import ProductCard from '../components/UI/ProductCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      const products = await db.getProducts()
      setFeaturedProducts(products.slice(0, 8)) // Show first 8 products
    } catch (error) {
      console.error('Error loading featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Transactions',
      description: 'Direct wallet-to-wallet payments with no intermediaries'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Trustless',
      description: 'Blockchain-powered security ensures safe transactions'
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: 'No Hidden Fees',
      description: 'Transparent pricing with minimal transaction costs'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Shop the Future with{' '}
                <span className="gradient-text">Blockchain</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience seamless decentralized commerce. Connect your wallet, 
                discover amazing products, and trade directly with sellers worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/products" className="btn-primary inline-flex items-center justify-center">
                  Start Shopping
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/seller/register" className="btn-secondary inline-flex items-center justify-center">
                  Become a Seller
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-primary-600">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="animate-float">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-aqua-400 rounded-xl mb-4 mx-auto">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">AquaStore</h3>
                  <p className="text-gray-600 text-center">Decentralized E-commerce Platform</p>
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Products</span>
                      <span className="font-semibold">10,000+</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Active Sellers</span>
                      <span className="font-semibold">500+</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Transactions</span>
                      <span className="font-semibold">50,000+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Discover products across various categories</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="group text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600">Discover trending products from our sellers</p>
            </div>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(product) => {
                    console.log('Add to cart:', product)
                    // Implement cart functionality
                  }}
                  onQuickView={(product) => {
                    console.log('Quick view:', product)
                    // Implement quick view modal
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-aqua-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Decentralized Commerce Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of sellers and buyers who are already experiencing the future of e-commerce
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Shopping
            </Link>
            <Link
              to="/seller/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home