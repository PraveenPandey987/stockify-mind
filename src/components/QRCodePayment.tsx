
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle, QrCode, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodePaymentProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const QRCodePayment: React.FC<QRCodePaymentProps> = ({ 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [verifying, setVerifying] = useState(false);

  // Initialize with QR code loaded
  useEffect(() => {
    // Just set loading to false since we're using a static image
    setIsLoading(false);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !verifying) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !verifying) {
      toast.error('QR code expired', {
        description: 'Please generate a new QR code to continue'
      });
    }
  }, [countdown, verifying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const refreshQRCode = () => {
    setIsLoading(true);
    
    // Simulate refreshing
    setTimeout(() => {
      setIsLoading(false);
      setCountdown(300); // Reset countdown
      
      toast.success('QR code refreshed', {
        description: 'A new QR code has been generated'
      });
    }, 1000);
  };

  const checkPaymentStatus = () => {
    setVerifying(true);
    
    // In a real app, this would poll a backend API to check payment status
    toast.info('Verifying payment', {
      description: 'Checking if your payment has been received'
    });
    
    setTimeout(() => {
      // Simulate successful payment (80% chance)
      const isSuccessful = Math.random() > 0.2;
      
      if (isSuccessful) {
        toast.success('Payment verified', {
          description: 'Your payment has been received'
        });
        onSuccess();
      } else {
        setVerifying(false);
        toast.error('Payment not found', {
          description: 'We couldn\'t verify your payment. Please try again or choose a different payment method.'
        });
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center">
      {isLoading ? (
        <div className="py-8 flex flex-col items-center">
          <LoaderCircle className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
          <p>Refreshing QR code...</p>
        </div>
      ) : (
        <>
          <div className="border rounded-md p-6 bg-white dark:bg-background mb-4 w-fit mx-auto">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb0ijC0BqkNvS1WfNm4FDBhNp1pf6WbwnI4Q&s" 
              alt="Payment QR Code" 
              className="w-48 h-48" 
            />
          </div>
          
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              Scan this QR code with your banking app or payment app to pay
            </p>
            <p className="font-medium">Amount: ${amount.toFixed(2)}</p>
            <p className="text-xs mt-1">
              QR code expires in <span className="font-medium">{formatTime(countdown)}</span>
            </p>
          </div>
          
          <div className="flex gap-2 justify-center mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshQRCode}
              disabled={verifying}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh QR
            </Button>
          </div>
          
          <div className="w-full border-t pt-4">
            <p className="text-sm text-center mb-3">Already made the payment?</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onCancel}
                disabled={verifying}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={checkPaymentStatus}
                disabled={verifying}
                className="flex-1"
              >
                {verifying ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    I've Paid
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QRCodePayment;
