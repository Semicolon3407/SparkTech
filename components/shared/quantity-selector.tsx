'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increase = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
  };

  const textSizeClasses = {
    sm: 'text-sm w-8',
    md: 'text-base w-12',
  };

  return (
    <div className={cn('flex items-center border rounded-lg', className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn('rounded-r-none', sizeClasses[size])}
        onClick={decrease}
        disabled={value <= min}
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      
      <span className={cn(
        'text-center font-medium tabular-nums',
        textSizeClasses[size]
      )}>
        {value}
      </span>
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn('rounded-l-none', sizeClasses[size])}
        onClick={increase}
        disabled={value >= max}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
}
