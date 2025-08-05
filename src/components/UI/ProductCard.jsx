import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react'
import { formatPrice, web3Utils } from '../../lib/utils'
import { useAuth } from '../../contexts/AuthContext'

const ProductCard = ({ product, onAddToCart, onQuickView }) => {
  const { isSeller } = useAuth()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onQuickView) {
      onQuickView(product)
    }
  }

  return (
    <div className="card group overflow-hidden">
      <Link to={`/products/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          )}
          <img
            src={product.image_url}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
            <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleWishlist}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleQuickView}
                className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm transition-colors"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < (product.rating || 4)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              ({product.reviews_count || 0})
            </span>
          </div>

          {/* Price and Seller */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              <p className="text-xs text-gray-500">
                by {web3Utils.formatAddress(product.seller_wallet)}
              </p>
            </div>
          </div>

          {/* Add to Cart Button (only for buyers) */}
          {!isSeller && (
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-2 text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </Link>
    </div>
  )
}

export default ProductCard