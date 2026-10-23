import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { 
  FileText, 
  Printer, 
  Download, 
  RotateCcw, 
  RotateCw, 
  Check, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Minus,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  HelpCircle,
  Keyboard,
  BarChart2,
  Maximize2,
  FileCode,
  Sparkles
} from 'lucide-react';
import type { ZoomLevel } from '../types/document';

interface MenuBarProps {
  editor: Editor | null;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  zoom: ZoomLevel;
  onSetZoom: (zoom: ZoomLevel) => void;
  onPrint: () => void;
  onNewDocument: () => void;
  onInsertLink: () => void;
  onInsertImage: () => void;
  onOpenShortcuts: () => void;
  onOpenWordCount: () => void;
  onLoadSample: () => void;
}

type MenuKey = 'file' | 'edit' | 'view' | 'insert' | 'format' | 'tools' | 'help' | null;

export const MenuBar: React.FC<MenuBarProps> = ({
  editor,
  sidebarOpen,
  onToggleSidebar,
  zoom,
  onSetZoom,
  onPrint,
  onNewDocument,
  onInsertLink,
  onInsertImage,
  onOpenShortcuts,
  onOpenWordCount,
  onLoadSample,
}) => {
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menu: MenuKey) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuHover = (menu: MenuKey) => {
    if (activeMenu !== null) {
      setActiveMenu(menu);
    }
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
    closeMenu();
  };

  const handleDownloadHTML = () => {
    if (!editor) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Document</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;line-height:1.6;padding:0 20px;}</style></head><body>${editor.getHTML()}</body></html>`;
    downloadFile(html, 'document.html', 'text/html');
  };

  const handleDownloadText = () => {
    if (!editor) return;
    downloadFile(editor.getText(), 'document.txt', 'text/plain');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
    closeMenu();
  };

  return (
    <div 
      ref={menuBarRef}
      className="bg-white border-b border-docs-border px-3 py-0.5 flex items-center text-xs select-none relative z-10"
    >
      {/* File Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('file')}
          onMouseEnter={() => handleMenuHover('file')}
          className={`px-2 py-1 rounded text-slate-700 hover:bg-docs-hover transition-colors ${
            activeMenu === 'file' ? 'bg-docs-active text-blue-700' : ''
          }`}
        >
          File
        </button>
        {activeMenu === 'file' && (
          <div className="absolute top-full left-0 mt-0.5 w-52 bg-white rounded-md shadow-dropdown border border-docs-border py-1 z-30 animate-in fade-in duration-75">
            <button
              onClick={() => { onNewDocument(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                New document
              </span>
            </button>
            <button
              onClick={() => { onLoadSample(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Load sample document
              </span>
            </button>
            <div className="my-1 border-t border-docs-border-light" />
            <button
              onClick={handleDownloadHTML}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-slate-500" />
                Download as HTML
              </span>
            </button>
            <button
              onClick={handleDownloadText}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Download Plain Text
              </span>
            </button>
            <div className="my-1 border-t border-docs-border-light" />
            <button
              onClick={() => { onPrint(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                Print
              </span>
              <span className="text-slate-400 text-[10px]">Ctrl+P</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('edit')}
          onMouseEnter={() => handleMenuHover('edit')}
          className={`px-2 py-1 rounded text-slate-700 hover:bg-docs-hover transition-colors ${
            activeMenu === 'edit' ? 'bg-docs-active text-blue-700' : ''
          }`}
        >
          Edit
        </button>
        {activeMenu === 'edit' && (
          <div className="absolute top-full left-0 mt-0.5 w-48 bg-white rounded-md shadow-dropdown border border-docs-border py-1 z-30">
            <button
              disabled={!editor?.can().undo()}
              onClick={() => { editor?.chain().focus().undo().run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Undo
              </span>
              <span className="text-slate-400 text-[10px]">Ctrl+Z</span>
            </button>
            <button
              disabled={!editor?.can().redo()}
              onClick={() => { editor?.chain().focus().redo().run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <span className="flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                Redo
              </span>
              <span className="text-slate-400 text-[10px]">Ctrl+Y</span>
            </button>
            <div className="my-1 border-t border-docs-border-light" />
            <button
              onClick={() => { editor?.chain().focus().selectAll().run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span>Select all</span>
              <span className="text-slate-400 text-[10px]">Ctrl+A</span>
            </button>
            <button
              onClick={() => { 
                editor?.chain().focus().unsetAllMarks().clearNodes().run(); 
                closeMenu(); 
              }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span>Clear formatting</span>
              <span className="text-slate-400 text-[10px]">Ctrl+\</span>
            </button>
          </div>
        )}
      </div>

      {/* View Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('view')}
          onMouseEnter={() => handleMenuHover('view')}
          className={`px-2 py-1 rounded text-slate-700 hover:bg-docs-hover transition-colors ${
            activeMenu === 'view' ? 'bg-docs-active text-blue-700' : ''
          }`}
        >
          View
        </button>
        {activeMenu === 'view' && (
          <div className="absolute top-full left-0 mt-0.5 w-48 bg-white rounded-md shadow-dropdown border border-docs-border py-1 z-30">
            <button
              onClick={() => { onToggleSidebar(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span>Show document outline</span>
              {sidebarOpen && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
            <div className="my-1 border-t border-docs-border-light" />
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Zoom
            </div>
            {([50, 75, 100, 125, 150] as ZoomLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => { onSetZoom(level); closeMenu(); }}
                className="w-full px-3 py-1 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
              >
                <span>{level}%</span>
                {zoom === level && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            ))}
            <div className="my-1 border-t border-docs-border-light" />
            <button
              onClick={toggleFullscreen}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                Fullscreen
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Insert Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('insert')}
          onMouseEnter={() => handleMenuHover('insert')}
          className={`px-2 py-1 rounded text-slate-700 hover:bg-docs-hover transition-colors ${
            activeMenu === 'insert' ? 'bg-docs-active text-blue-700' : ''
          }`}
        >
          Insert
        </button>
        {activeMenu === 'insert' && (
          <div className="absolute top-full left-0 mt-0.5 w-48 bg-white rounded-md shadow-dropdown border border-docs-border py-1 z-30">
            <button
              onClick={() => { onInsertImage(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center gap-2"
            >
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              Image
            </button>
            <button
              onClick={() => { onInsertLink(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                Link
              </span>
              <span className="text-slate-400 text-[10px]">Ctrl+K</span>
            </button>
            <div className="my-1 border-t border-docs-border-light" />
            <button
              onClick={() => { editor?.chain().focus().setHorizontalRule().run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center gap-2"
            >
              <Minus className="w-3.5 h-3.5 text-slate-500" />
              Horizontal line
            </button>
            <button
              onClick={() => { editor?.chain().focus().toggleBlockquote().run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center gap-2"
            >
              <Quote className="w-3.5 h-3.5 text-slate-500" />
              Blockquote
            </button>
            <button
              onClick={() => { editor?.chain().focus().toggleCodeBlock().run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center gap-2"
            >
              <Code className="w-3.5 h-3.5 text-slate-500" />
              Code block
            </button>
          </div>
        )}
      </div>

      {/* Format Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('format')}
          onMouseEnter={() => handleMenuHover('format')}
          className={`px-2 py-1 rounded text-slate-700 hover:bg-docs-hover transition-colors ${
            activeMenu === 'format' ? 'bg-docs-active text-blue-700' : ''
          }`}
        >
          Format
        </button>
        {activeMenu === 'format' && (
          <div className="absolute top-full left-0 mt-0.5 w-52 bg-white rounded-md shadow-dropdown border border-docs-border py-1 z-30">
            <button
              onClick={() => { editor?.chain().focus().toggleBold().run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span className="flex items-center gap-2 font-bold">
                <Bold className="w-3.5 h-3.5" /> Bold
              </span>
              <span className="text-slate-400 text-[10px]">Ctrl+B</span>
            </button>
            <button
              onClick={() => { editor?.chain().focus().toggleItalic().run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span className="flex items-center gap-2 italic">
                <Italic className="w-3.5 h-3.5" /> Italic
              </span>
              <span className="text-slate-400 text-[10px]">Ctrl+I</span>
            </button>
            <button
              onClick={() => { editor?.chain().focus().toggleUnderline().run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span className="flex items-center gap-2 underline">
                <Underline className="w-3.5 h-3.5" /> Underline
              </span>
              <span className="text-slate-400 text-[10px]">Ctrl+U</span>
            </button>
            <button
              onClick={() => { editor?.chain().focus().toggleStrike().run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span className="flex items-center gap-2 line-through">
                <Strikethrough className="w-3.5 h-3.5" /> Strikethrough
              </span>
            </button>
            <div className="my-1 border-t border-docs-border-light" />
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Alignment
            </div>
            <button
              onClick={() => { editor?.chain().focus().setTextAlign('left').run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center gap-2"
            >
              <AlignLeft className="w-3.5 h-3.5" /> Left align
            </button>
            <button
              onClick={() => { editor?.chain().focus().setTextAlign('center').run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center gap-2"
            >
              <AlignCenter className="w-3.5 h-3.5" /> Center align
            </button>
            <button
              onClick={() => { editor?.chain().focus().setTextAlign('right').run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center gap-2"
            >
              <AlignRight className="w-3.5 h-3.5" /> Right align
            </button>
            <button
              onClick={() => { editor?.chain().focus().setTextAlign('justify').run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center gap-2"
            >
              <AlignJustify className="w-3.5 h-3.5" /> Justify
            </button>
            <div className="my-1 border-t border-docs-border-light" />
            <button
              onClick={() => { editor?.chain().focus().toggleBulletList().run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center gap-2"
            >
              <List className="w-3.5 h-3.5" /> Bulleted list
            </button>
            <button
              onClick={() => { editor?.chain().focus().toggleOrderedList().run(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center gap-2"
            >
              <ListOrdered className="w-3.5 h-3.5" /> Numbered list
            </button>
          </div>
        )}
      </div>

      {/* Tools Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('tools')}
          onMouseEnter={() => handleMenuHover('tools')}
          className={`px-2 py-1 rounded text-slate-700 hover:bg-docs-hover transition-colors ${
            activeMenu === 'tools' ? 'bg-docs-active text-blue-700' : ''
          }`}
        >
          Tools
        </button>
        {activeMenu === 'tools' && (
          <div className="absolute top-full left-0 mt-0.5 w-48 bg-white rounded-md shadow-dropdown border border-docs-border py-1 z-30">
            <button
              onClick={() => { onOpenWordCount(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
                Word count
              </span>
              <span className="text-slate-400 text-[10px]">Ctrl+Shift+C</span>
            </button>
          </div>
        )}
      </div>

      {/* Help Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('help')}
          onMouseEnter={() => handleMenuHover('help')}
          className={`px-2 py-1 rounded text-slate-700 hover:bg-docs-hover transition-colors ${
            activeMenu === 'help' ? 'bg-docs-active text-blue-700' : ''
          }`}
        >
          Help
        </button>
        {activeMenu === 'help' && (
          <div className="absolute top-full left-0 mt-0.5 w-52 bg-white rounded-md shadow-dropdown border border-docs-border py-1 z-30">
            <button
              onClick={() => { onOpenShortcuts(); closeMenu(); }}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-docs-hover flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Keyboard className="w-3.5 h-3.5 text-slate-500" />
                Keyboard shortcuts
              </span>
              <span className="text-slate-400 text-[10px]">Ctrl+/</span>
            </button>
            <div className="my-1 border-t border-docs-border-light" />
            <div className="px-3 py-2 text-[11px] text-slate-500 flex flex-col gap-1">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                Docs Editor v1.0
              </span>
              <span>Fast, responsive frontend document processor built with React & TipTap.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
