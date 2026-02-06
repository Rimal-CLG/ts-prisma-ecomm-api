import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
  apiVersion: "2026-01-28.clover",
});

export const stripePayments = async () => {
  // Stripe payment logic to be implemented
};

export const createCustomerService = async (data: any) => {
  const name = data.name;
  const email = data.email;
  const customer = await stripe.customers.create({
    name: name,
    email: email,
  });
  return customer;
};

export const addCardService = async (data: any) => {
  const {
    customerId,
    card_name,
    card_ExpYear,
    card_ExpMonth,
    card_Number,
    card_CVC,
  } = data;
  const card_tocken = await stripe.tokens.create({
    card: {
      name: card_name,
      number: card_Number,
      exp_year: card_ExpYear,
      exp_month: card_ExpMonth,
      cvc: card_CVC,
    },
  });

  const card = await stripe.customers.createSource(customerId, {
    source: `${card_tocken.id}`,
  });
  return { card: card.id };
};
