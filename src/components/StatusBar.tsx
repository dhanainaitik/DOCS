import React from 'react';
import { PanelLeft, BarChart2 } from 'lucide-react';
import type { ZoomLevel } from '../types/document';

interface StatusBarProps {
  wordCount: number;
  characterCount: number;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  zoom: ZoomLevel;
  onOpenWordCount: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  wordCount,
  characterCount,
  sidebarOpen,
  onToggleSidebar,
  zoom,
  onOpenWordCount,
}) => {
  return (
    <footer 
      className="document-statusbar bg-white border-t border-docs-border px-3 py-1 flex items-center justify-between text-[11px] text-slate-500 select-none z-10 no-print h-7"
      aria-label="Document Status"
    >
      {/* Left: Outline toggle button (helpful when sidebar is collapsed) */}
      <div className="flex items-center gap-2">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-slate-600 hover:text-slate-900 hover:bg-docs-hover transition-colors"
            title="Open document outline"
          >
            <PanelLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Show outline</span>
          </button>
        )}
      </div>

      {/* Right: Word count, character count, zoom */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenWordCount}
          className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-docs-hover text-slate-600 hover:text-slate-900 transition-colors"
          title="Word count statistics"
        >
          <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
          <span>
            <strong className="font-medium text-slate-800">{wordCount}</strong> {wordCount === 1 ? 'word' : 'words'}
          </span>
          <span className="text-slate-300">•</span>
          <span>
            <strong className="font-medium text-slate-800">{characterCount}</strong> {characterCount === 1 ? 'character' : 'characters'}
          </span>
        </button>

        <span className="hidden sm:inline text-slate-300">|</span>

        <span className="hidden sm:inline text-slate-500 font-mono text-[10px]">
          {zoom}%
        </span>
      </div>
    </footer>
  );
};
