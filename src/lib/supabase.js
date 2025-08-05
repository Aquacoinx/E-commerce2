import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations
export const db = {
  // Products
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getProductsByCategory(category) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getProduct(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createProduct(product) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateProduct(id, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Sellers
  async getSeller(walletAddress) {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async createSeller(seller) {
    const { data, error } = await supabase
      .from('sellers')
      .insert([seller])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateSeller(walletAddress, updates) {
    const { data, error } = await supabase
      .from('sellers')
      .update(updates)
      .eq('wallet_address', walletAddress)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Orders (for tracking purposes)
  async createOrder(order) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getSellerOrders(sellerWallet) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        products (
          name,
          image_url,
          price
        )
      `)
      .eq('seller_wallet', sellerWallet)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Storage operations
export const storage = {
  async uploadImage(file, path) {
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(path, file)
    
    if (error) throw error
    return data
  },

  async getImageUrl(path) {
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  async deleteImage(path) {
    const { error } = await supabase.storage
      .from('product-images')
      .remove([path])
    
    if (error) throw error
  }
}