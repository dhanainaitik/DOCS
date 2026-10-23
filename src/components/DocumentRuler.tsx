import React from 'react';

export const DocumentRuler: React.FC = () => {
  // 816px total width, 72px left margin, 72px right margin, 672px content width
  // 672px / 96dpi = 7 inches of text area
  return (
    <div 
      className="document-ruler h-4 bg-[#f8f9fa] border-b border-docs-border flex items-center justify-center select-none no-print overflow-hidden"
      aria-hidden="true"
    >
      <div className="w-[816px] h-full relative flex items-end">
        {/* Left margin shaded area */}
        <div className="w-[72px] h-full bg-slate-200/60 border-r border-slate-300 relative">
          <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-blue-500" />
        </div>

        {/* Content ruler ticks */}
        <div className="w-[672px] h-full bg-[#fdfdfd] relative flex items-end">
          {Array.from({ length: 15 }).map((_, i) => {
            const isInch = i % 2 === 0;
            const inchNumber = i / 2;
            return (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{ left: `${(i / 14) * 100}%` }}
              >
                {isInch && inchNumber > 0 && inchNumber < 7 && (
                  <span className="text-[9px] font-mono text-slate-500 leading-none mb-[2px]">
                    {inchNumber}
                  </span>
                )}
                <div
                  className={`w-[1px] bg-slate-300 ${isInch ? 'h-2' : 'h-1'}`}
                />
              </div>
            );
          })}
        </div>

        {/* Right margin shaded area */}
        <div className="w-[72px] h-full bg-slate-200/60 border-l border-slate-300 relative">
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-blue-500" />
        </div>
      </div>
    </div>
  );
};
