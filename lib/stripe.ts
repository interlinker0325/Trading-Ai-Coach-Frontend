import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = async (): Promise<Stripe | null> => {
  if (!stripePromise) {
    try {
      // Fetch Stripe config from backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stripe/config`
      );
      const config = await response.json();

      stripePromise = loadStripe(config.publishable_key);
    } catch (error) {
      console.error("Error loading Stripe config:", error);
      return null;
    }
  }

  return stripePromise;
};

export const createCheckoutSession = async (
  priceId: string,
  userId: number,
  planName: string
) => {
  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
        userId,
        planName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create checkout session");
    }

    return data;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};

export const createPortalSession = async (customerId: string) => {
  try {
    const response = await fetch("/api/create-portal-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create portal session");
    }

    return data;
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw error;
  }
};
