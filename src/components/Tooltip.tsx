import { ReactNode } from 'react';

export const Tooltip = ({ term, definition }: { term: string | ReactNode, definition: string }) => {
  return (
    <span className="group/tooltip relative inline cursor-help underline decoration-dashed decoration-slate-400/50 hover:decoration-brand-500 underline-offset-2 transition-all">
      <span className="font-medium text-inherit group-hover/tooltip:text-brand-600 transition-colors">{term}</span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[280px] p-4 bg-slate-900 text-white text-[13px] font-medium rounded-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 shadow-xl z-50 text-center leading-relaxed pointer-events-none">
        {definition}
        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></span>
      </span>
    </span>
  );
};
