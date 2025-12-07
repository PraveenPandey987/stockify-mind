
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  previousValue?: number;
  precision?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  previousValue,
  precision = 2,
  className,
  prefix = '',
  suffix = '',
  duration = 500
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  
  useEffect(() => {
    if (previousValue !== undefined && previousValue !== value) {
      setDirection(value > previousValue ? 'up' : 'down');
      
      // Animate the number
      const start = previousValue;
      const end = value;
      const startTime = Date.now();
      
      const animateNumber = () => {
        const now = Date.now();
        const elapsedTime = now - startTime;
        
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          // Easing function for smoother animation
          const easeOutQuad = (t: number) => t * (2 - t);
          const easedProgress = easeOutQuad(progress);
          
          const currentValue = start + (end - start) * easedProgress;
          setDisplayValue(currentValue);
          requestAnimationFrame(animateNumber);
        } else {
          setDisplayValue(end);
          setTimeout(() => setDirection(null), 300); // Reset direction after animation
        }
      };
      
      requestAnimationFrame(animateNumber);
    } else {
      setDisplayValue(value);
    }
  }, [value, previousValue, duration]);
  
  return (
    <span 
      className={cn(
        'transition-colors duration-300',
        direction === 'up' && 'text-success',
        direction === 'down' && 'text-destructive',
        className
      )}
    >
      {prefix}{displayValue.toFixed(precision)}{suffix}
    </span>
  );
};

export default AnimatedNumber;
