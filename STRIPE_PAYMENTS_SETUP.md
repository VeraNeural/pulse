# 💳 Stripe Payments Setup for Pulse

Stripe payment integration has been successfully added to Pulse for coin purchases!

## ✅ What Was Implemented

### Core Payment Files
1. **src/lib/stripe.ts** - Stripe client initialization
2. **src/app/api/checkout/route.ts** - API endpoint for creating checkout sessions
3. **src/app/api/webhook/route.ts** - Webhook handler for payment confirmations
4. **src/app/checkout/success/page.tsx** - Success page after payment
5. **src/app/checkout/cancel/page.tsx** - Cancel page if user cancels

### Updated Files
6. **src/components/CoinsModal.tsx** - Integrated with Stripe checkout flow

### Database
7. **supabase_coin_transactions.sql** - Transaction tracking table

## 🎯 Coin Packages with Stripe Price IDs

```typescript
const COIN_PACKAGES = [
  { coins: 100, price: $0.99, priceId: 'price_1SohiDF8aJ0BDqA3uWEk7DCX' },
  { coins: 500, price: $3.99, priceId: 'price_1SohiXF8aJ0BDqA3VZXAx9GC', popular: true },
  { coins: 1000, price: $6.99, priceId: 'price_1SohiqF8aJ0BDqA3LuHtCLfc', bonus: +50 },
  { coins: 2500, price: $14.99, priceId: 'price_1SohjgF8aJ0BDqA3bZvxRrG7', bonus: +200 },
  { coins: 5000, price: $24.99, priceId: 'price_1SohkAF8aJ0BDqA39VMRfN21', bonus: +500 },
]
```

## 🔧 Setup Instructions

### 1. Run Database Migration

Execute this SQL in your **Supabase SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'gift_sent', 'gift_received', 'boost', 'refund')),
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own transactions"
  ON coin_transactions FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX idx_coin_transactions_created_at ON coin_transactions(created_at DESC);
```

### 2. Configure Stripe Webhook

1. Go to **Stripe Dashboard** → Developers → Webhooks
2. Click **"Add endpoint"**
3. Set endpoint URL to: `https://yourdomain.com/api/webhook`
4. Select event: `checkout.session.completed`
5. Copy the **Signing Secret**
6. Add to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 3. Verify Environment Variables

Your `.env.local` should have:

```env
# Stripe Keys (already configured)
STRIPE_SECRET_KEY=sk_live_51S6LXtF8aJ0BDqA3...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51S6LXtF8aJ0BDqA3...

# Add webhook secret
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://tlonlyssawxjdghaqsgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Test Mode (Optional)

For testing, use **Stripe Test Mode**:

1. Switch to test mode in Stripe Dashboard
2. Use test keys in `.env.local`:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
3. Test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date, any 3-digit CVC

## 💰 Payment Flow

1. **User clicks "Buy Coins"** in the app
2. **Selects a package** in the BuyCoinsModal
3. **Clicks "Purchase"**
   - App calls `/api/checkout` with `priceId`, `coins`, `userId`
   - Server creates Stripe checkout session
   - Returns `sessionId`
4. **User redirects to Stripe checkout page**
   - Secure payment form hosted by Stripe
   - Supports cards, Apple Pay, Google Pay
5. **User completes payment**
   - Stripe sends webhook to `/api/webhook`
   - Server updates user's coins in Supabase
   - Logs transaction in `coin_transactions` table
6. **User redirected to success page**
   - Shows "🎉 Payment Successful!"
   - Displays coins added
   - Auto-refreshes app after 3 seconds

## 🔒 Security Features

- ✅ Webhook signature verification
- ✅ Server-side payment processing
- ✅ No sensitive data in client
- ✅ Row Level Security on transactions
- ✅ Stripe PCI compliance
- ✅ Metadata validation

## 📊 Transaction Tracking

All purchases are logged in `coin_transactions` table:

```sql
SELECT 
  user_id,
  amount,
  type,
  stripe_session_id,
  created_at
FROM coin_transactions
WHERE user_id = 'xxx'
ORDER BY created_at DESC;
```

## 🧪 Testing the Integration

### Test Purchase Flow:

1. **Login** to your account
2. **Click coin balance** in header
3. **Select a package** (e.g., "Basic - 500 coins")
4. **Click "Purchase"**
5. **Complete payment** on Stripe checkout
6. **Verify:**
   - Redirected to success page
   - Coins added to account
   - Transaction in `coin_transactions` table

### Test Webhook Locally:

Use Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhook
stripe trigger checkout.session.completed
```

## 🎨 UI Features

- **BuyCoinsModal**: Shows all coin packages with prices and bonuses
- **Popular badge**: Highlights best value package
- **Bonus badges**: Shows extra coins (e.g., "+50 bonus")
- **Loading state**: Shows "Processing..." during checkout
- **Success page**: Celebratory animation with auto-refresh
- **Cancel page**: Friendly message if payment cancelled

## 📝 Customization

### Add New Coin Package:

1. **Create product in Stripe Dashboard**
2. **Get price ID** (starts with `price_`)
3. **Add to COIN_PACKAGES** in `CoinsModal.tsx`:

```typescript
{ 
  id: 'mega', 
  coins: 10000, 
  price: 49.99, 
  priceId: 'price_xxxxxxxxxxxxx', 
  popular: false, 
  bonus: 1000 
}
```

### Modify Success/Cancel Pages:

Edit files in `src/app/checkout/success/page.tsx` and `cancel/page.tsx` to customize messaging and styling.

## 🚨 Important Notes

1. **Webhook Secret Required**: Without it, webhook verification will fail
2. **HTTPS Required in Production**: Stripe requires HTTPS for webhooks
3. **Test Mode vs Live Mode**: Keep keys separate for testing
4. **Price IDs**: Each price ID is unique to your Stripe account

## 🔗 Useful Links

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Webhooks Docs](https://stripe.com/docs/webhooks)
- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Test Cards](https://stripe.com/docs/testing)

---

**Your payment system is ready!** 💳✨

Users can now purchase coins securely through Stripe, and all transactions are tracked in your database.
