import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { db } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      loadSeller()
    } else {
      setSeller(null)
    }
  }, [isConnected, address])

  const loadSeller = async () => {
    if (!address) return
    
    setLoading(true)
    try {
      const sellerData = await db.getSeller(address)
      setSeller(sellerData)
    } catch (error) {
      console.error('Error loading seller:', error)
      setSeller(null)
    } finally {
      setLoading(false)
    }
  }

  const registerSeller = async (sellerInfo) => {
    if (!address) throw new Error('Wallet not connected')
    
    setLoading(true)
    try {
      const newSeller = await db.createSeller({
        wallet_address: address,
        ...sellerInfo,
        created_at: new Date().toISOString()
      })
      setSeller(newSeller)
      return newSeller
    } catch (error) {
      console.error('Error registering seller:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateSellerProfile = async (updates) => {
    if (!address || !seller) throw new Error('Not authenticated as seller')
    
    setLoading(true)
    try {
      const updatedSeller = await db.updateSeller(address, updates)
      setSeller(updatedSeller)
      return updatedSeller
    } catch (error) {
      console.error('Error updating seller profile:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    disconnect()
    setSeller(null)
  }

  const value = {
    // Wallet connection
    address,
    isConnected,
    
    // Seller data
    seller,
    isSeller: !!seller,
    
    // Loading states
    loading,
    
    // Actions
    registerSeller,
    updateSellerProfile,
    logout,
    refreshSeller: loadSeller
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}