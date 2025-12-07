
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StockData } from './StockCard';
import AnimatedNumber from './AnimatedNumber';
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';

interface TradeModalProps {
  stock: StockData | null;
  type: 'buy' | 'sell';
  balance: number;
  owned: number;
  isOpen: boolean;
  onClose: () => void;
  onTrade: (stockId: string, amount: number, totalPrice: number) => void;
}

const TradeModal: React.FC<TradeModalProps> = ({
  stock,
  type,
  balance,
  owned,
  isOpen,
  onClose,
  onTrade
}) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState<string>('1');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  
  useEffect(() => {
    if (isOpen && stock) {
      setQuantity('1');
      setTotalPrice(stock.price);
      setError(null);
      setPaymentStatus('idle');
    }
  }, [isOpen, stock]);
  
  useEffect(() => {
    if (stock) {
      const parsedQuantity = parseInt(quantity) || 0;
      setTotalPrice(parsedQuantity * stock.price);
      
      // Validate input
      if (parsedQuantity <= 0) {
        setError('Quantity must be greater than 0');
      } else if (type === 'buy' && totalPrice > balance) {
        setError('Insufficient funds');
      } else if (type === 'sell' && parsedQuantity > owned) {
        setError('You don\'t own enough shares');
      } else {
        setError(null);
      }
    }
  }, [quantity, stock, type, balance, owned, totalPrice]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setQuantity(value);
  };
  
  const handleProceedToPayment = () => {
    if (!stock || error) return;
    
    const parsedQuantity = parseInt(quantity) || 0;
    
    if (parsedQuantity <= 0) {
      toast.error('Invalid quantity', {
        description: 'Please enter a valid quantity',
        icon: <XCircle className="h-4 w-4" />,
      });
      return;
    }
    
    // For sell operations, no payment is needed
    if (type === 'sell') {
      setPaymentStatus('processing');
      setTimeout(() => {
        processTrade();
        setPaymentStatus('success');
      }, 800);
      return;
    }
    
    // For buy operations, navigate to payment page
    onClose();
    navigate('/payment', {
      state: {
        paymentDetails: {
          stockSymbol: stock.symbol,
          stockId: stock.id,
          quantity: parsedQuantity,
          price: stock.price,
          amount: totalPrice
        }
      }
    });
  };
  
  const processTrade = () => {
    if (!stock || error) return;
    
    const parsedQuantity = parseInt(quantity) || 0;
    
    // Process the trade (positive for buy, negative for sell)
    const amount = type === 'buy' ? parsedQuantity : -parsedQuantity;
    onTrade(stock.id, amount, totalPrice);
    
    // Show success message
    toast.success(
      `${type === 'buy' ? 'Purchase' : 'Sale'} completed`,
      {
        description: `${parsedQuantity} shares of ${stock.symbol} ${type === 'buy' ? 'bought' : 'sold'} for $${totalPrice.toFixed(2)}`,
        icon: <CheckCircle className="h-4 w-4" />,
      }
    );
    
    onClose();
  };
  
  if (!stock) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {type === 'buy' ? 'Buy' : 'Sell'} {stock.symbol}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Price:</span>
            <span className="font-medium">${stock.price.toFixed(2)}</span>
          </div>
          
          {type === 'buy' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Available Balance:</span>
              <span className="font-medium">${balance.toFixed(2)}</span>
            </div>
          )}
          
          {type === 'sell' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Shares Owned:</span>
              <span className="font-medium">{owned}</span>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              className="col-span-3"
              disabled={paymentStatus === 'processing'}
            />
          </div>
          
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm font-medium">Total:</span>
            <AnimatedNumber 
              value={totalPrice} 
              prefix="$" 
              className="text-lg font-bold"
            />
          </div>
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={paymentStatus === 'processing'}>
            Cancel
          </Button>
          <Button
            onClick={handleProceedToPayment}
            disabled={!!error || totalPrice <= 0 || paymentStatus === 'processing'}
            variant={type === 'buy' ? 'default' : 'destructive'}
          >
            {type === 'buy' ? 'Proceed to Payment' : 'Sell Shares'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TradeModal;
