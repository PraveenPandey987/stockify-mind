
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { LoaderCircle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentCheckoutProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({ 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const validateForm = () => {
    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      return false;
    }

    if (!cardComplete) {
      setError('Please fill in all card details.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, you would:
      // 1. Create a payment intent on your server
      // 2. Pass the client secret to confirmCardPayment
      // 3. Handle the payment result
      
      // For this demo, we'll simulate a payment process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly simulate success/failure for demo purposes
      const isSuccessful = Math.random() > 0.2; // 80% success rate
      
      if (isSuccessful) {
        // Payment success
        toast.success('Payment successful', {
          description: `$${amount.toFixed(2)} has been charged to your card`,
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        });
        setIsLoading(false);
        onSuccess();
      } else {
        // Payment failure
        throw new Error('Your card was declined. Please try a different payment method.');
      }
    } catch (error: any) {
      setError(error.message || 'Payment processing failed. Please try again.');
      toast.error('Payment failed', {
        description: error.message || 'Please check your card details and try again',
        icon: <XCircle className="h-4 w-4 text-red-500" />,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Card Details
          </label>
          <div className="p-3 border rounded-md bg-background">
            <CardElement 
              onChange={handleCardChange}
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            For testing, use card number: 4242 4242 4242 4242, any future date, any CVC
          </p>
        </div>
        
        {error && (
          <div className="mb-4 text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!stripe || isLoading || !cardComplete}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentCheckout;
