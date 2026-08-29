import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  className?: string;
}

export function Skeleton({ variant = 'rectangular', className = '' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-slate-200/80';
  
  if (variant === 'circular') {
    return <div className={`${baseClasses} rounded-full ${className}`} />;
  }
  
  if (variant === 'text') {
    return <div className={`${baseClasses} h-3.5 rounded-md ${className}`} />;
  }
  
  return <div className={`${baseClasses} rounded-xl ${className}`} />;
}
