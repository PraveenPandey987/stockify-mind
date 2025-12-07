
import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

// Replace with your own publishable key from the Stripe dashboard
// For demo purposes, using a test publishable key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

interface StripeProviderProps {
  children: React.ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const [stripeError, setStripeError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Stripe loaded successfully
    stripePromise.then(
      (stripe) => {
        if (!stripe) {
          setStripeError('Failed to load Stripe. Please refresh the page and try again.');
        }
      }
    );
  }, []);

  useEffect(() => {
    if (stripeError) {
      toast.error('Stripe Error', {
        description: stripeError,
      });
    }
  }, [stripeError]);

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
