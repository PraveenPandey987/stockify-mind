
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Download, Home } from 'lucide-react';
import { toast } from 'sonner';
import { generateReceipt } from '@/utils/receiptUtils';

interface PurchaseDetails {
  stockSymbol: string;
  quantity: number;
  price: number;
  amount: number;
  transactionId: string;
  timestamp: string;
  status: string;
}

const PaymentConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const purchaseDetails = location.state?.purchaseDetails as PurchaseDetails;
  
  useEffect(() => {
    // If no purchase details are provided, redirect to home
    if (!purchaseDetails) {
      toast.error('No transaction details found');
      navigate('/');
    } else {
      // Show success toast
      toast.success('Payment successful!', {
        description: `Your purchase of ${purchaseDetails.quantity} shares of ${purchaseDetails.stockSymbol} is complete.`,
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      });
    }
  }, [purchaseDetails, navigate]);
  
  if (!purchaseDetails) {
    return null;
  }
  
  const formattedDate = new Date(purchaseDetails.timestamp).toLocaleString();
  
  const handleDownloadReceipt = () => {
    try {
      generateReceipt(purchaseDetails);
      toast.success('Receipt downloaded', {
        description: 'Your receipt has been downloaded successfully',
      });
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Failed to download receipt', {
        description: 'Please try again later',
      });
    }
  };
  
  return (
    <div className="container max-w-2xl py-12">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="flex justify-center items-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground">Your transaction has been completed successfully</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Purchase Details</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-medium">{purchaseDetails.transactionId}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Date & Time</span>
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                {purchaseDetails.status}
              </span>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stock</span>
                <span className="font-medium">{purchaseDetails.stockSymbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quantity</span>
                <span className="font-medium">{purchaseDetails.quantity} shares</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Price per share</span>
                <span className="font-medium">${purchaseDetails.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold">${purchaseDetails.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={handleDownloadReceipt}
            variant="outline" 
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button 
              onClick={() => navigate('/portfolio')}
              variant="default"
            >
              View Portfolio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="secondary"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentConfirmation;
