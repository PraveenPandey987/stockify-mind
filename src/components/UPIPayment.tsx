
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle, IndianRupee, CheckCircle, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface UPIPaymentProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const UPIPayment: React.FC<UPIPaymentProps> = ({ 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const [upiId, setUpiId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);
  
  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value);
  };
  
  const validateUpiId = (id: string) => {
    // Basic validation: UPI ID should contain @ and be at least 3 characters
    return id.includes('@') && id.length >= 3;
  };
  
  const handlePayment = () => {
    if (!validateUpiId(upiId)) {
      toast.error('Invalid UPI ID', {
        description: 'Please enter a valid UPI ID (e.g., name@upi)'
      });
      return;
    }
    
    setIsVerifying(true);
    
    // In a real app, this would send a request to your payment gateway
    toast.info('Processing UPI payment', {
      description: 'Sending payment request to your UPI app'
    });
    
    // Simulate processing delay
    setTimeout(() => {
      // Simulate successful payment (80% chance)
      const isSuccessful = Math.random() > 0.2;
      
      if (isSuccessful) {
        toast.success('Payment initiated', {
          description: 'Check your UPI app to approve the payment request'
        });
        
        // Simulate payment approval
        setTimeout(() => {
          setIsVerifying(false);
          onSuccess();
        }, 2000);
      } else {
        setIsVerifying(false);
        toast.error('Payment failed', {
          description: 'We couldn\'t process your UPI payment. Please try again or use a different method.'
        });
      }
    }, 2000);
  };
  
  const generateQRCode = () => {
    setGeneratingQR(true);
    setShowQR(true);
    
    // Simulate QR code generation
    setTimeout(() => {
      setGeneratingQR(false);
    }, 1000);
  };
  
  const checkQRPaymentStatus = () => {
    setIsVerifying(true);
    
    // In a real app, this would poll a backend API to check payment status
    toast.info('Verifying UPI payment', {
      description: 'Checking if your payment has been received'
    });
    
    setTimeout(() => {
      // Simulate successful payment (80% chance)
      const isSuccessful = Math.random() > 0.2;
      
      if (isSuccessful) {
        toast.success('UPI payment verified', {
          description: 'Your payment has been received'
        });
        onSuccess();
      } else {
        setIsVerifying(false);
        toast.error('Payment not found', {
          description: 'We couldn\'t verify your UPI payment. Please try again.'
        });
      }
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      {!showQR ? (
        <>
          <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-md">
            <IndianRupee className="h-5 w-5" />
            <span className="font-semibold">
              {amount.toFixed(2)} INR
            </span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="upi-id">Enter your UPI ID</Label>
            <div className="relative">
              <Input
                id="upi-id"
                placeholder="username@upi"
                value={upiId}
                onChange={handleUpiIdChange}
                className="pr-16"
                disabled={isVerifying}
              />
              <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-3 pointer-events-none text-xs text-muted-foreground">
                @upi
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Enter your UPI ID in the format: username@bank
            </p>
          </div>
          
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={generateQRCode}
              className="w-full mb-4"
              disabled={isVerifying}
            >
              <QrCode className="mr-2 h-4 w-4" />
              Pay via QR Code Instead
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onCancel}
                disabled={isVerifying}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={!validateUpiId(upiId) || isVerifying}
                className="flex-1"
              >
                {isVerifying ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          {generatingQR ? (
            <div className="py-8 flex flex-col items-center">
              <LoaderCircle className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
              <p>Generating UPI QR code...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-2">
                <p className="font-medium">Scan with any UPI app</p>
                <p className="text-sm text-muted-foreground">
                  Amount: ₹{amount.toFixed(2)}
                </p>
              </div>
              
              <div className="border rounded-md p-6 bg-white dark:bg-background mb-4 w-fit mx-auto">
                <img 
                  src="/lovable-uploads/7bd0b95a-9050-455b-8bae-8cf8cc8d6f52.png" 
                  alt="UPI QR Code" 
                  className="w-48 h-48" 
                />
              </div>
              
              <div className="text-center mb-4">
                <p className="text-xs text-muted-foreground">
                  Open any UPI app (Google Pay, PhonePe, Paytm, etc.)
                  and scan this QR code to make your payment
                </p>
              </div>
              
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowQR(false)}
                  className="w-full mb-4"
                  disabled={isVerifying}
                >
                  Enter UPI ID Instead
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={onCancel}
                    disabled={isVerifying}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={checkQRPaymentStatus}
                    disabled={isVerifying}
                    className="flex-1"
                  >
                    {isVerifying ? (
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
        </>
      )}
    </div>
  );
};

export default UPIPayment;
