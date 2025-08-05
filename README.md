# AquaStore - Decentralized E-commerce Platform

A modern, decentralized e-commerce platform built with React, Vite, Supabase, and Web3 technologies.

## Features

### For Sellers
- **Wallet-based Registration**: Only sellers need to create accounts using their crypto wallets
- **Product Management**: Create, edit, and manage product listings
- **Direct Payments**: Receive payments directly to your wallet
- **Dashboard**: Track sales, orders, and analytics
- **Image Storage**: Upload product images to Supabase Storage

### For Buyers
- **Stateless Shopping**: No account required, just connect your wallet
- **Direct Payments**: Pay sellers directly through blockchain transactions
- **Product Discovery**: Browse products by category, search, and filter
- **Secure Transactions**: All payments are handled through smart contracts

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Web3**: WalletConnect + Wagmi
- **State Management**: React Context + TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- WalletConnect project ID

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aquastore
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your Supabase and WalletConnect credentials in the `.env` file.

4. Set up Supabase database:

Create the following tables in your Supabase database:

```sql
-- Sellers table
CREATE TABLE sellers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT NOT NULL,
  business_description TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  seller_wallet TEXT NOT NULL REFERENCES sellers(wallet_address),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table (for tracking)
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id),
  buyer_wallet TEXT NOT NULL,
  seller_wallet TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_hash TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Sellers can view own data" ON sellers FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Sellers can update own data" ON sellers FOR UPDATE USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Sellers can manage own products" ON products FOR ALL USING (seller_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Sellers can view own orders" ON orders FOR SELECT USING (seller_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
```

5. Create a storage bucket for product images:
   - Go to Supabase Storage
   - Create a new bucket named `product-images`
   - Make it public

6. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Header, Footer, etc.
│   └── UI/             # ProductCard, Modal, etc.
├── contexts/           # React contexts
├── lib/                # Utilities and configurations
├── pages/              # Page components
│   └── seller/         # Seller-specific pages
└── main.jsx           # App entry point
```

## Key Features Implementation

### Wallet Integration
- Uses WalletConnect for universal wallet support
- Supports MetaMask, Trust Wallet, Coinbase Wallet, etc.
- Automatic wallet connection state management

### Product Management
- Image upload to Supabase Storage
- Category-based organization
- Search and filtering capabilities
- Real-time updates

### Payment Flow
1. Buyer connects wallet
2. Selects products and initiates purchase
3. Payment sent directly to seller's wallet
4. Transaction recorded for tracking

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details