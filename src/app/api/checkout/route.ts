import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error('Missing STRIPE_SECRET_KEY');
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-12-15.clover',
    });

    const { priceId, coins, userId, mode } = await request.json();

    const checkoutMode: 'payment' | 'subscription' = mode === 'subscription' ? 'subscription' : 'payment';
    const origin = request.headers.get('origin');

    if (!origin) {
      return NextResponse.json({ error: 'Missing Origin header' }, { status: 400 });
    }
    
    const session = await stripe.checkout.sessions.create({
      mode: checkoutMode,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url:
        checkoutMode === 'subscription'
          ? `${origin}/checkout/success?premium=true`
          : `${origin}/checkout/success?coins=${coins}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: { userId, coins: (coins ?? 0).toString() },
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
