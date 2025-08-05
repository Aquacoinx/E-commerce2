import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export const generateProductId = () => {
  return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const categories = [
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'fashion', name: 'Fashion', icon: '👕' },
  { id: 'home', name: 'Home & Garden', icon: '🏠' },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽' },
  { id: 'books', name: 'Books & Media', icon: '📚' },
  { id: 'food', name: 'Food & Beverages', icon: '🍕' },
  { id: 'beauty', name: 'Beauty & Health', icon: '💄' },
  { id: 'automotive', name: 'Automotive', icon: '🚗' },
]

export const showToast = (message, type = 'success') => {
  // Simple toast implementation - you can replace with a proper toast library
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`
  toast.textContent = message
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.remove()
  }, 3000)
}

export const validateProduct = (product) => {
  const errors = {}
  
  if (!product.name?.trim()) {
    errors.name = 'Product name is required'
  }
  
  if (!product.description?.trim()) {
    errors.description = 'Product description is required'
  }
  
  if (!product.price || product.price <= 0) {
    errors.price = 'Valid price is required'
  }
  
  if (!product.category) {
    errors.category = 'Category is required'
  }
  
  if (!product.image_url) {
    errors.image = 'Product image is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}