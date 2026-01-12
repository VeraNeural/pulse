import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const PRICE_ID_VERA_PREMIUM = 'price_1SXmdPF8aJ0BDqA38uLdCp4f';
const PRICE_ID_PULSE_PLUS = 'price_1SohlCF8aJ0BDqA3Oj0bwCsb';

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

    const subscriptionSuccessUrl =
      priceId === PRICE_ID_VERA_PREMIUM
        ? `${origin}/checkout/success?premium=true`
        : priceId === PRICE_ID_PULSE_PLUS
          ? `${origin}/checkout/success?pulseplus=true`
          : `${origin}/checkout/success`;
    
    const session = await stripe.checkout.sessions.create({
      mode: checkoutMode,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url:
        checkoutMode === 'subscription'
          ? subscriptionSuccessUrl
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
