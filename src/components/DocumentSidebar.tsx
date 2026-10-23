import React from 'react';
import { PanelLeftClose, ListFilter, FileText } from 'lucide-react';
import type { HeadingItem } from '../types/document';

interface DocumentSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  headings: HeadingItem[];
  onHeadingClick: (heading: HeadingItem) => void;
}

export const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  isOpen,
  onToggle,
  headings,
  onHeadingClick,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <aside 
      className="document-sidebar w-64 md:w-72 bg-[#f9fbfd] border-r border-docs-border flex flex-col flex-shrink-0 select-none z-10 transition-all duration-200 ease-in-out h-full overflow-hidden no-print"
      aria-label="Document Navigation Outline"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-docs-border-light flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 font-medium text-xs">
          <ListFilter className="w-4 h-4 text-slate-500" />
          <span className="uppercase tracking-wider font-semibold text-[11px] text-slate-500">
            Document outline
          </span>
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-docs-hover transition-colors"
          title="Close outline"
          aria-label="Close outline"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Headings List or Empty State */}
      <div className="flex-1 overflow-y-auto p-3 text-xs">
        {headings.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 text-slate-400 h-64">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
              <FileText className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-xs font-medium text-slate-600 mb-1">
              No headings yet
            </p>
            <p className="text-[11px] text-slate-400 max-w-[190px] leading-relaxed">
              Your document outline will appear here as you add headings.
            </p>
          </div>
        ) : (
          <nav className="flex flex-col gap-0.5" aria-label="Headings Outline">
            {headings.map((item) => {
              const paddingLeft =
                item.level === 1
                  ? 'pl-2'
                  : item.level === 2
                  ? 'pl-5'
                  : 'pl-8';

              return (
                <button
                  key={item.id}
                  onClick={() => onHeadingClick(item)}
                  className={`w-full text-left py-1.5 pr-2 rounded-md transition-colors truncate flex items-center gap-1.5 hover:bg-slate-200/60 text-slate-700 hover:text-blue-700 group ${paddingLeft}`}
                  title={item.text}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                      item.level === 1
                        ? 'bg-blue-600'
                        : item.level === 2
                        ? 'bg-slate-400 group-hover:bg-blue-500'
                        : 'bg-slate-300 group-hover:bg-blue-400'
                    }`}
                  />
                  <span
                    className={`truncate ${
                      item.level === 1
                        ? 'font-semibold text-slate-900 text-xs'
                        : item.level === 2
                        ? 'font-medium text-slate-700 text-xs'
                        : 'font-normal text-slate-600 text-[11px]'
                    }`}
                  >
                    {item.text}
                  </span>
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Subtle outline footer tip */}
      {headings.length > 0 && (
        <div className="p-3 border-t border-docs-border-light text-[10px] text-slate-400 text-center">
          {headings.length} heading{headings.length > 1 ? 's' : ''} in document
        </div>
      )}
    </aside>
  );
};
