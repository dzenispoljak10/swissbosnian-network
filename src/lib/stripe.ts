import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder')

export const STRIPE_PRICES = {
  GOENNER: process.env.STRIPE_PRICE_GOENNER ?? '',
  PARTNER: process.env.STRIPE_PRICE_PARTNER ?? '',
}
