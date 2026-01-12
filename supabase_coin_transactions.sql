-- Create coin_transactions table for tracking purchases
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'gift_sent', 'gift_received', 'boost', 'refund')),
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for coin_transactions
CREATE POLICY "Users can read their own transactions"
  ON coin_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX idx_coin_transactions_created_at ON coin_transactions(created_at DESC);
CREATE INDEX idx_coin_transactions_type ON coin_transactions(type);
CREATE INDEX idx_coin_transactions_stripe_session_id ON coin_transactions(stripe_session_id);
