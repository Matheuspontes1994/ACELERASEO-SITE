import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export default function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-slate-200";
  
  const variantClasses = {
    text: "h-3 w-full rounded",
    rectangular: "h-full w-full rounded-2xl",
    circular: "h-full w-full rounded-full"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-[20px] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="rectangular" className="h-4 w-24" />
        <Skeleton variant="rectangular" className="h-4 w-16" />
      </div>
      <Skeleton variant="rectangular" className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-5/6" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton variant="rectangular" className="h-8 w-20" />
        <Skeleton variant="rectangular" className="h-8 w-20" />
      </div>
    </div>
  );
}

export function SkeletonMetric() {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 space-y-3">
      <Skeleton variant="rectangular" className="h-4 w-20" />
      <Skeleton variant="rectangular" className="h-10 w-16" />
      <Skeleton variant="text" className="w-24" />
    </div>
  );
}
