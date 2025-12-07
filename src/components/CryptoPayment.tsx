
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CopyIcon, LoaderCircle, Bitcoin, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CryptoPaymentProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const CryptoPayment: React.FC<CryptoPaymentProps> = ({ 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [cryptoAmount, setCryptoAmount] = useState({ btc: 0, eth: 0, usdt: 0 });
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 minutes in seconds
  
  // Wallet addresses for different cryptocurrencies
  const walletAddresses = {
    btc: "bc1q8z4ej3m6xddzwnp0yx7m32qym2r4z45h20y6tt",
    eth: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    usdt: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" // Same as ETH for this demo
  };
  
  useEffect(() => {
    // Simulate API call to get crypto conversion rates
    setTimeout(() => {
      // Mock conversion rates (in a real app, these would come from an API)
      setCryptoAmount({
        btc: amount / 52000, // Example BTC rate
        eth: amount / 2800,  // Example ETH rate
        usdt: amount         // USDT is 1:1 with USD
      });
      setIsLoading(false);
    }, 1500);
  }, [amount]);
  
  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !verifying && !isLoading) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !verifying && !isLoading) {
      toast.error('Crypto payment expired', {
        description: 'The exchange rate has expired. Please refresh to get an updated rate.'
      });
    }
  }, [countdown, verifying, isLoading]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleCopyAddress = (address: string, type: string) => {
    navigator.clipboard.writeText(address);
    toast.success(`${type} address copied`, {
      description: 'Address copied to clipboard'
    });
  };
  
  const refreshRates = () => {
    setIsLoading(true);
    setCountdown(900); // Reset countdown
    
    // Simulate API call to refresh rates
    setTimeout(() => {
      // Small random variation in rates
      setCryptoAmount({
        btc: amount / (52000 + (Math.random() * 1000 - 500)),
        eth: amount / (2800 + (Math.random() * 100 - 50)),
        usdt: amount
      });
      setIsLoading(false);
      
      toast.success('Rates updated', {
        description: 'Cryptocurrency rates have been refreshed'
      });
    }, 1500);
  };
  
  const checkPaymentStatus = () => {
    setVerifying(true);
    
    toast.info('Verifying payment', {
      description: 'This may take a few moments to confirm on the blockchain'
    });
    
    // In a real app, this would check the blockchain for the transaction
    setTimeout(() => {
      // Simulate successful payment (80% chance)
      const isSuccessful = Math.random() > 0.2;
      
      if (isSuccessful) {
        toast.success('Payment verified', {
          description: 'Your crypto payment has been confirmed on the blockchain'
        });
        onSuccess();
      } else {
        setVerifying(false);
        toast.error('Payment not found', {
          description: 'We couldn\'t verify your crypto transaction. It may still be pending, or you can try again.'
        });
      }
    }, 3000);
  };
  
  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
        <p>Getting current exchange rates...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-lg p-4 text-sm">
        <p className="mb-1">Send the exact amount to the corresponding wallet address. The payment window will expire in <span className="font-medium">{formatTime(countdown)}</span>.</p>
        <p>After sending, click "I've Paid" to verify your transaction.</p>
      </div>
      
      <Tabs defaultValue="btc">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="btc">Bitcoin</TabsTrigger>
          <TabsTrigger value="eth">Ethereum</TabsTrigger>
          <TabsTrigger value="usdt">USDT</TabsTrigger>
        </TabsList>
        
        <TabsContent value="btc" className="space-y-4">
          <div className="flex items-center gap-2">
            <Bitcoin className="h-6 w-6 text-amber-500" />
            <span className="font-bold text-lg">{cryptoAmount.btc.toFixed(8)} BTC</span>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-muted-foreground">Send to this address:</label>
            <div className="flex items-center">
              <div className="bg-muted p-3 rounded-lg border text-xs font-mono truncate flex-1">
                {walletAddresses.btc}
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="ml-2"
                onClick={() => handleCopyAddress(walletAddresses.btc, 'Bitcoin')}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="eth" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs">Ξ</div>
            <span className="font-bold text-lg">{cryptoAmount.eth.toFixed(6)} ETH</span>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-muted-foreground">Send to this address:</label>
            <div className="flex items-center">
              <div className="bg-muted p-3 rounded-lg border text-xs font-mono truncate flex-1">
                {walletAddresses.eth}
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="ml-2"
                onClick={() => handleCopyAddress(walletAddresses.eth, 'Ethereum')}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="usdt" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xs">$</div>
            <span className="font-bold text-lg">{cryptoAmount.usdt.toFixed(2)} USDT</span>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-muted-foreground">Send to this address (ERC-20):</label>
            <div className="flex items-center">
              <div className="bg-muted p-3 rounded-lg border text-xs font-mono truncate flex-1">
                {walletAddresses.usdt}
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="ml-2"
                onClick={() => handleCopyAddress(walletAddresses.usdt, 'USDT')}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={refreshRates}
          disabled={verifying}
          className="text-xs"
        >
          Refresh Rates
        </Button>
      </div>
      
      <div className="w-full border-t pt-4">
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
    </div>
  );
};

export default CryptoPayment;
