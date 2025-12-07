
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PaymentCheckout from "@/components/PaymentCheckout";
import QRCodePayment from "@/components/QRCodePayment";
import CryptoPayment from "@/components/CryptoPayment";
import UPIPayment from "@/components/UPIPayment";
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface PaymentPageProps {}

const Payment: React.FC<PaymentPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  
  // Get payment details from location state or use default values
  const paymentDetails = location.state?.paymentDetails || {
    amount: 0,
    stockSymbol: '',
    quantity: 0,
    price: 0
  };
  
  const handlePaymentSuccess = () => {
    setIsPaymentCompleted(true);
    // Navigate to payment confirmation page with purchase details
    navigate('/payment-confirmation', { 
      state: { 
        purchaseDetails: {
          ...paymentDetails,
          transactionId: `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toISOString(),
          status: 'completed'
        } 
      }
    });
  };
  
  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };
  
  return (
    <div className="container max-w-4xl py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Checkout</CardTitle>
          <CardDescription>
            Complete your purchase of {paymentDetails.quantity} shares of {paymentDetails.stockSymbol} for ${paymentDetails.amount.toFixed(2)}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="border rounded-md p-4 mb-6 bg-muted/50">
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Stock:</span>
                <span className="font-medium">{paymentDetails.stockSymbol}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per share:</span>
                <span className="font-medium">${paymentDetails.price?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-medium">{paymentDetails.quantity}</span>
              </div>
              <div className="flex justify-between border-t pt-1 mt-1">
                <span>Total:</span>
                <span className="font-bold">${paymentDetails.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <ShieldCheck className="h-4 w-4" />
            <span>Your payment is secure and encrypted</span>
          </div>
          
          <Tabs defaultValue="card" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="card">Credit Card</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
              <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
              <TabsTrigger value="upi">UPI</TabsTrigger>
            </TabsList>
            
            <TabsContent value="card">
              <PaymentCheckout 
                amount={paymentDetails.amount}
                onSuccess={handlePaymentSuccess}
                onCancel={handleCancel}
              />
            </TabsContent>
            
            <TabsContent value="qr">
              <QRCodePayment 
                amount={paymentDetails.amount}
                onSuccess={handlePaymentSuccess}
                onCancel={handleCancel}
              />
            </TabsContent>
            
            <TabsContent value="crypto">
              <CryptoPayment 
                amount={paymentDetails.amount}
                onSuccess={handlePaymentSuccess}
                onCancel={handleCancel}
              />
            </TabsContent>
            
            <TabsContent value="upi">
              <UPIPayment 
                amount={paymentDetails.amount}
                onSuccess={handlePaymentSuccess}
                onCancel={handleCancel}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
