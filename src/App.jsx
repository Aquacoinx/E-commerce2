import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './lib/web3'
import { AuthProvider } from './contexts/AuthContext'

// Layout Components
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import SellerRegister from './pages/seller/SellerRegister'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/seller/register" element={<SellerRegister />} />
                  {/* Add more routes as needed */}
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}

export default App