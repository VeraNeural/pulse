import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, coins } = session.metadata || {};

      if (userId && coins) {
        const coinsToAdd = parseInt(coins, 10);

        // Update user's coins in Supabase
        const { data: currentUser, error: fetchError } = await supabase
          .from('users')
          .select('coins')
          .eq('id', userId)
          .single<{ coins: number }>();

        if (fetchError || !currentUser) {
          console.error('Error fetching user:', fetchError);
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const newCoinsBalance = currentUser.coins + coinsToAdd;

        const { error: updateError } = await supabase
          .from('users')
          .update({ coins: newCoinsBalance })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating coins:', updateError);
          return NextResponse.json({ error: 'Failed to update coins' }, { status: 500 });
        }

        // Insert transaction record (optional - requires coin_transactions table)
        try {
          await supabase.from('coin_transactions').insert({
            user_id: userId,
            amount: coinsToAdd,
            type: 'purchase',
            stripe_session_id: session.id,
            created_at: new Date().toISOString(),
          });
        } catch (err) {
          // Transaction table might not exist yet, just log the error
          console.log('Transaction logging skipped:', err);
        }

        console.log(`Added ${coinsToAdd} coins to user ${userId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
