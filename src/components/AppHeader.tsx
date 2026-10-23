import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Star, 
  CloudCheck, 
  CloudUpload, 
  Lock, 
  Printer,
  Info
} from 'lucide-react';
import type { SaveStatus } from '../types/document';

interface AppHeaderProps {
  title: string;
  onRename: (newTitle: string) => void;
  isStarred: boolean;
  onToggleStar: () => void;
  saveStatus: SaveStatus;
  onPrint: () => void;
  onOpenShortcuts: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  onRename,
  isStarred,
  onToggleStar,
  saveStatus,
  onPrint,
  onOpenShortcuts,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [showShareToast, setShowShareToast] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEditing = () => {
    setEditValue(title);
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    if (editValue.trim() && editValue !== title) {
      onRename(editValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFinishEditing();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const triggerShareNotification = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3500);
  };

  return (
    <header className="bg-white border-b border-docs-border px-3 py-2 flex items-center justify-between select-none relative z-20">
      {/* Left: Brand, Title, and Save Status */}
      <div className="flex items-center gap-2 min-w-0 flex-1 mr-4">
        {/* App Logo */}
        <div 
          className="flex items-center gap-1.5 p-1 rounded hover:bg-docs-hover cursor-pointer transition-colors"
          title="Read Document Editor"
        >
          <div className="w-8 h-9 bg-blue-600 rounded-sm flex items-center justify-center shadow-sm relative overflow-hidden group">
            <FileText className="w-5 h-5 text-white" strokeWidth={2.2} />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-300 rounded-bl-sm opacity-90" />
          </div>
          <span className="font-semibold text-lg text-slate-800 tracking-tight hidden sm:inline ml-0.5">
            Read
          </span>
        </div>

        {/* Title and Controls */}
        <div className="flex flex-col ml-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleFinishEditing}
                onKeyDown={handleKeyDown}
                className="text-base font-medium text-slate-800 bg-white border border-blue-500 rounded px-1.5 py-0.5 outline-none shadow-sm min-w-[140px] max-w-[280px] sm:max-w-[420px]"
                maxLength={60}
              />
            ) : (
              <h1
                onClick={handleStartEditing}
                className="text-base font-medium text-slate-800 hover:bg-docs-hover px-1.5 py-0.5 rounded cursor-pointer border border-transparent hover:border-docs-border truncate max-w-[240px] sm:max-w-[380px] transition-colors"
                title="Click to rename document"
              >
                {title || 'Untitled document'}
              </h1>
            )}

            {/* Favorite / Star Icon */}
            <button
              onClick={onToggleStar}
              className={`p-1 rounded-full hover:bg-docs-hover transition-colors ${
                isStarred ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
              }`}
              title={isStarred ? 'Remove from favorites' : 'Mark as favorite'}
              aria-label="Favorite document"
            >
              <Star
                className="w-4 h-4"
                fill={isStarred ? 'currentColor' : 'none'}
                strokeWidth={2}
              />
            </button>

            {/* Save Status Indicator */}
            <div
              className="flex items-center gap-1 text-xs text-slate-500 px-1.5 py-0.5 rounded hover:bg-docs-hover cursor-help transition-colors"
              title={
                saveStatus === 'saved'
                  ? 'All changes saved locally in browser'
                  : saveStatus === 'saving'
                  ? 'Saving changes...'
                  : 'Unsaved changes'
              }
            >
              {saveStatus === 'saving' ? (
                <>
                  <CloudUpload className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                  <span className="hidden md:inline text-blue-600">Saving...</span>
                </>
              ) : (
                <>
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden md:inline text-slate-500">Saved to browser</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Actions, Share, Profile */}
      <div className="flex items-center gap-2">
        {/* Quick Print */}
        <button
          onClick={onPrint}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-docs-hover rounded-full transition-colors hidden sm:flex items-center justify-center"
          title="Print document (Ctrl+P)"
          aria-label="Print"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* Shortcuts */}
        <button
          onClick={onOpenShortcuts}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-docs-hover rounded-full transition-colors hidden sm:flex items-center justify-center"
          title="Keyboard shortcuts"
          aria-label="Keyboard shortcuts"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Share Button (Appearance only per spec) */}
        <button
          onClick={triggerShareNotification}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-xs sm:text-sm rounded-full transition-all border border-blue-200 active:scale-95 shadow-sm"
          title="Document sharing"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>

        {/* User Profile Avatar */}
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-semibold text-xs flex items-center justify-center shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all select-none ml-1"
          title="Local Workspace User"
        >
          U
        </div>
      </div>

      {/* Share Toast Notification */}
      {showShareToast && (
        <div className="absolute top-14 right-4 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>Frontend-only mode: Sharing is available in future phases.</span>
        </div>
      )}
    </header>
  );
};
