import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function HorizontalScroll({ children, className = "" }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const scrollInterval = useRef<number | null>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Use logical threshold to avoid flickering
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    
    // ResizeObserver is better for dynamic content
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    
    // Also observe the children to react to data changes
    const childrenContainer = el.firstElementChild;
    if (childrenContainer) {
      observer.observe(childrenContainer);
    }

    return () => observer.disconnect();
  }, []);

  const startScrolling = (direction: 'left' | 'right') => {
    if (scrollInterval.current) return;
    
    scrollInterval.current = window.setInterval(() => {
      if (scrollRef.current) {
        // Light movement as requested (direction: -8px per frame is gentle)
        scrollRef.current.scrollBy({
          left: direction === 'left' ? -8 : 8,
          behavior: 'auto'
        });
        checkScroll();
      }
    }, 16); 
  };

  const stopScrolling = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  return (
    <div className={`relative group/scroll-container ${className}`}>
      {/* Left Arrow Zone */}
      {showLeft && (
        <div 
          onMouseEnter={() => startScrolling('left')}
          onMouseLeave={stopScrolling}
          className="absolute left-0 top-0 bottom-0 w-16 z-20 flex items-center justify-start pl-4 bg-gradient-to-r from-white via-white/40 to-transparent cursor-pointer opacity-0 group-hover/scroll-container:opacity-100 transition-opacity duration-300"
        >
          <div className="w-10 h-10 rounded-full bg-slate-900 shadow-xl flex items-center justify-center text-white transform active:scale-95 transition-transform">
            <ChevronLeft size={20} />
          </div>
        </div>
      )}

      {/* Right Arrow Zone */}
      {showRight && (
        <div 
          onMouseEnter={() => startScrolling('right')}
          onMouseLeave={stopScrolling}
          className="absolute right-0 top-0 bottom-0 w-16 z-20 flex items-center justify-end pr-4 bg-gradient-to-l from-white via-white/40 to-transparent cursor-pointer opacity-0 group-hover/scroll-container:opacity-100 transition-opacity duration-300"
        >
          <div className="w-10 h-10 rounded-full bg-slate-900 shadow-xl flex items-center justify-center text-white transform active:scale-95 transition-transform">
            <ChevronRight size={20} />
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="overflow-x-auto custom-scrollbar"
      >
        {children}
      </div>
    </div>
  );
}
