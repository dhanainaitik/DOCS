import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import {
  RotateCcw,
  RotateCw,
  Printer,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Baseline,
  Highlighter,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  RemoveFormatting,
  ChevronDown,
  Quote,
  Minus,
  Plus
} from 'lucide-react';
import type { ZoomLevel } from '../types/document';

interface FormattingToolbarProps {
  editor: Editor | null;
  zoom: ZoomLevel;
  onSetZoom: (zoom: ZoomLevel) => void;
  onPrint: () => void;
  onOpenLinkModal: () => void;
  onOpenImageModal: () => void;
}

const FONT_FAMILIES = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Merriweather', value: 'Merriweather, serif' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
];

const FONT_SIZES = [
  '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px'
];

const TEXT_COLORS = [
  '#000000', '#202124', '#5f6368', '#1a73e8', '#188038', '#d93025', '#f29900', '#a142f4',
  '#ffffff', '#495057', '#9aa0a6', '#4285f4', '#34a853', '#ea4335', '#fbbc04', '#af5cf7',
];

const HIGHLIGHT_COLORS = [
  { name: 'None', color: '' },
  { name: 'Yellow', color: '#fef08a' },
  { name: 'Green', color: '#bbf7d0' },
  { name: 'Cyan', color: '#bae6fd' },
  { name: 'Pink', color: '#fbcfe8' },
  { name: 'Orange', color: '#fed7aa' },
  { name: 'Purple', color: '#e9d5ff' },
];

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  editor,
  zoom,
  onSetZoom,
  onPrint,
  onOpenLinkModal,
  onOpenImageModal,
}) => {
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showHighlightDropdown, setShowHighlightDropdown] = useState(false);
  const [showAlignDropdown, setShowAlignDropdown] = useState(false);
  const [showLineHeightDropdown, setShowLineHeightDropdown] = useState(false);
  const [showZoomDropdown, setShowZoomDropdown] = useState(false);

  const toolbarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowStyleDropdown(false);
        setShowFontDropdown(false);
        setShowSizeDropdown(false);
        setShowColorDropdown(false);
        setShowHighlightDropdown(false);
        setShowAlignDropdown(false);
        setShowLineHeightDropdown(false);
        setShowZoomDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) {
    return (
      <div className="bg-[#f0f4f9] border-b border-docs-border px-3 py-1.5 h-10 flex items-center" />
    );
  }

  // Active styles detection
  const getCurrentStyleLabel = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
    return 'Normal text';
  };

  const getCurrentFontFamily = () => {
    const current = editor.getAttributes('textStyle').fontFamily;
    if (!current) return 'Inter';
    const found = FONT_FAMILIES.find(f => f.value.toLowerCase().includes(current.toLowerCase()) || current.toLowerCase().includes(f.label.toLowerCase()));
    return found ? found.label : 'Inter';
  };

  const getCurrentFontSize = () => {
    const current = editor.getAttributes('textStyle').fontSize;
    if (!current) return '14px';
    return current;
  };

  const handleFontSizeChange = (delta: number) => {
    const currentStr = getCurrentFontSize();
    const currentNum = parseInt(currentStr, 10) || 14;
    const newNum = Math.max(6, Math.min(72, currentNum + delta));
    editor.chain().focus().setFontSize(`${newNum}px`).run();
  };

  const handleStyleSelect = (type: 'p' | 'h1' | 'h2' | 'h3') => {
    if (type === 'p') {
      editor.chain().focus().setParagraph().run();
    } else if (type === 'h1') {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (type === 'h2') {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (type === 'h3') {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    }
    setShowStyleDropdown(false);
  };

  const handleIndent = () => {
    if (editor.can().sinkListItem('listItem')) {
      editor.chain().focus().sinkListItem('listItem').run();
    } else {
      // Fallback indent for regular blocks
      const currentIndent = parseInt(editor.getAttributes('paragraph').indent || '0', 10);
      editor.chain().focus().updateAttributes('paragraph', { indent: String(currentIndent + 1) }).run();
    }
  };

  const handleOutdent = () => {
    if (editor.can().liftListItem('listItem')) {
      editor.chain().focus().liftListItem('listItem').run();
    } else {
      const currentIndent = parseInt(editor.getAttributes('paragraph').indent || '0', 10);
      if (currentIndent > 0) {
        editor.chain().focus().updateAttributes('paragraph', { indent: String(currentIndent - 1) }).run();
      }
    }
  };

  return (
    <div 
      ref={toolbarRef}
      className="formatting-toolbar bg-[#edf2fa] border-b border-docs-border px-3 py-1 flex items-center gap-0.5 overflow-x-auto text-docs-text select-none text-xs shadow-inner h-10 no-print scrollbar-none"
    >
      {/* Undo & Redo */}
      <button
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
        className="p-1.5 rounded hover:bg-docs-hover active:bg-docs-active text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
        className="p-1.5 rounded hover:bg-docs-hover active:bg-docs-active text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        title="Redo (Ctrl+Y)"
        aria-label="Redo"
      >
        <RotateCw className="w-4 h-4" />
      </button>

      {/* Print */}
      <button
        onClick={onPrint}
        className="p-1.5 rounded hover:bg-docs-hover active:bg-docs-active text-slate-700 transition-colors"
        title="Print (Ctrl+P)"
        aria-label="Print"
      >
        <Printer className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-5 bg-docs-border mx-1" />

      {/* Zoom Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowZoomDropdown(!showZoomDropdown)}
          className="h-7 px-2 rounded hover:bg-docs-hover flex items-center gap-1 text-xs text-slate-700 font-medium transition-colors"
          title="Zoom"
        >
          <span>{zoom}%</span>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>
        {showZoomDropdown && (
          <div className="absolute top-full left-0 mt-1 w-24 bg-white rounded-md shadow-dropdown border border-docs-border py-1 z-40 animate-in fade-in duration-75">
            {([50, 75, 90, 100, 125, 150, 200] as ZoomLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => { onSetZoom(level); setShowZoomDropdown(false); }}
                className={`w-full px-3 py-1 text-left text-xs hover:bg-docs-hover flex items-center justify-between ${
                  zoom === level ? 'bg-docs-active text-blue-700 font-medium' : 'text-slate-700'
                }`}
              >
                {level}%
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-[1px] h-5 bg-docs-border mx-1" />

      {/* Paragraph Style Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowStyleDropdown(!showStyleDropdown)}
          className="h-7 px-2 rounded hover:bg-docs-hover flex items-center gap-1 text-xs text-slate-700 font-medium min-w-[95px] justify-between transition-colors"
          title="Paragraph styles"
        >
          <span className="truncate">{getCurrentStyleLabel()}</span>
          <ChevronDown className="w-3 h-3 text-slate-500 flex-shrink-0" />
        </button>
        {showStyleDropdown && (
          <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-md shadow-dropdown border border-docs-border py-1 z-40">
            <button
              onClick={() => handleStyleSelect('p')}
              className={`w-full px-3 py-1.5 text-left text-xs hover:bg-docs-hover ${
                editor.isActive('paragraph') ? 'bg-docs-active text-blue-700 font-semibold' : 'text-slate-700'
              }`}
            >
              Normal text
            </button>
            <button
              onClick={() => handleStyleSelect('h1')}
              className={`w-full px-3 py-1.5 text-left text-lg font-bold hover:bg-docs-hover ${
                editor.isActive('heading', { level: 1 }) ? 'bg-docs-active text-blue-700' : 'text-slate-800'
              }`}
            >
              Heading 1
            </button>
            <button
              onClick={() => handleStyleSelect('h2')}
              className={`w-full px-3 py-1.5 text-left text-base font-semibold hover:bg-docs-hover ${
                editor.isActive('heading', { level: 2 }) ? 'bg-docs-active text-blue-700' : 'text-slate-800'
              }`}
            >
              Heading 2
            </button>
            <button
              onClick={() => handleStyleSelect('h3')}
              className={`w-full px-3 py-1.5 text-left text-sm font-semibold hover:bg-docs-hover ${
                editor.isActive('heading', { level: 3 }) ? 'bg-docs-active text-blue-700' : 'text-slate-800'
              }`}
            >
              Heading 3
            </button>
          </div>
        )}
      </div>

      <div className="w-[1px] h-5 bg-docs-border mx-1" />

      {/* Font Family Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowFontDropdown(!showFontDropdown)}
          className="h-7 px-2 rounded hover:bg-docs-hover flex items-center gap-1 text-xs text-slate-700 font-medium min-w-[110px] justify-between transition-colors"
          title="Font family"
        >
          <span className="truncate">{getCurrentFontFamily()}</span>
          <ChevronDown className="w-3 h-3 text-slate-500 flex-shrink-0" />
        </button>
        {showFontDropdown && (
          <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-md shadow-dropdown border border-docs-border py-1 z-40">
            {FONT_FAMILIES.map((font) => (
              <button
                key={font.label}
                onClick={() => {
                  editor.chain().focus().setFontFamily(font.value).run();
                  setShowFontDropdown(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-xs hover:bg-docs-hover ${
                  getCurrentFontFamily() === font.label ? 'bg-docs-active text-blue-700 font-medium' : 'text-slate-700'
                }`}
                style={{ fontFamily: font.value }}
              >
                {font.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-[1px] h-5 bg-docs-border mx-1" />

      {/* Font Size Selector */}
      <div className="flex items-center">
        <button
          onClick={() => handleFontSizeChange(-1)}
          className="p-1 rounded hover:bg-docs-hover text-slate-600 transition-colors"
          title="Decrease font size"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowSizeDropdown(!showSizeDropdown)}
            className="h-7 px-1.5 rounded hover:bg-docs-hover text-xs font-medium text-slate-700 flex items-center gap-0.5 min-w-[36px] justify-center transition-colors"
            title="Font size"
          >
            {parseInt(getCurrentFontSize(), 10) || 14}
          </button>
          {showSizeDropdown && (
            <div className="absolute top-full left-0 mt-1 w-20 max-h-48 overflow-y-auto bg-white rounded-md shadow-dropdown border border-docs-border py-1 z-40">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    editor.chain().focus().setFontSize(size).run();
                    setShowSizeDropdown(false);
                  }}
                  className={`w-full px-2 py-1 text-center text-xs hover:bg-docs-hover ${
                    getCurrentFontSize() === size ? 'bg-docs-active text-blue-700 font-medium' : 'text-slate-700'
                  }`}
                >
                  {parseInt(size, 10)}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => handleFontSizeChange(1)}
          className="p-1 rounded hover:bg-docs-hover text-slate-600 transition-colors"
          title="Increase font size"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-[1px] h-5 bg-docs-border mx-1" />

      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('bold')
            ? 'bg-blue-100 text-blue-700 font-bold'
            : 'hover:bg-docs-hover text-slate-700'
        }`}
        title="Bold (Ctrl+B)"
        aria-label="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('italic')
            ? 'bg-blue-100 text-blue-700'
            : 'hover:bg-docs-hover text-slate-700'
        }`}
        title="Italic (Ctrl+I)"
        aria-label="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>

      {/* Underline */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('underline')
            ? 'bg-blue-100 text-blue-700'
            : 'hover:bg-docs-hover text-slate-700'
        }`}
        title="Underline (Ctrl+U)"
        aria-label="Underline"
      >
        <Underline className="w-4 h-4" />
      </button>

      {/* Strikethrough */}
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('strike')
            ? 'bg-blue-100 text-blue-700'
            : 'hover:bg-docs-hover text-slate-700'
        }`}
        title="Strikethrough"
        aria-label="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      {/* Text Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorDropdown(!showColorDropdown)}
          className="p-1.5 rounded hover:bg-docs-hover flex flex-col items-center justify-center transition-colors relative"
          title="Text color"
        >
          <Baseline className="w-4 h-4 text-slate-700" />
          <div
            className="w-3.5 h-[3px] rounded-full mt-[1px]"
            style={{ backgroundColor: editor.getAttributes('textStyle').color || '#202124' }}
          />
        </button>
        {showColorDropdown && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-md shadow-dropdown border border-docs-border z-40 w-44">
            <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Color</div>
            <div className="grid grid-cols-4 gap-1.5">
              {TEXT_COLORS.map((hex) => (
                <button
                  key={hex}
                  onClick={() => {
                    editor.chain().focus().setColor(hex).run();
                    setShowColorDropdown(false);
                  }}
                  className="w-6 h-6 rounded-full border border-slate-300 hover:scale-110 transition-transform shadow-xs flex items-center justify-center"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
            <button
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setShowColorDropdown(false);
              }}
              className="mt-2 w-full text-center text-xs text-slate-600 hover:text-slate-900 py-1 rounded hover:bg-docs-hover border-t border-docs-border-light pt-1.5"
            >
              Reset to default
            </button>
          </div>
        )}
      </div>

      {/* Highlight Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowHighlightDropdown(!showHighlightDropdown)}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('highlight')
              ? 'bg-amber-100 text-amber-800'
              : 'hover:bg-docs-hover text-slate-700'
          }`}
          title="Highlight color"
        >
          <Highlighter className="w-4 h-4" />
        </button>
        {showHighlightDropdown && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-md shadow-dropdown border border-docs-border z-40 w-48">
            <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Highlight</div>
            <div className="grid grid-cols-4 gap-1.5">
              {HIGHLIGHT_COLORS.map((h) => (
                <button
                  key={h.name}
                  onClick={() => {
                    if (h.color) {
                      editor.chain().focus().toggleHighlight({ color: h.color }).run();
                    } else {
                      editor.chain().focus().unsetHighlight().run();
                    }
                    setShowHighlightDropdown(false);
                  }}
                  className="w-7 h-7 rounded border border-slate-300 hover:scale-105 transition-transform flex items-center justify-center text-[10px]"
                  style={{ backgroundColor: h.color || '#ffffff' }}
                  title={h.name}
                >
                  {!h.color && 'None'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-[1px] h-5 bg-docs-border mx-1" />

      {/* Insert Link */}
      <button
        onClick={onOpenLinkModal}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('link')
            ? 'bg-blue-100 text-blue-700'
            : 'hover:bg-docs-hover text-slate-700'
        }`}
        title="Insert link (Ctrl+K)"
        aria-label="Insert link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>

      {/* Insert Image */}
      <button
        onClick={onOpenImageModal}
        className="p-1.5 rounded hover:bg-docs-hover text-slate-700 transition-colors"
        title="Insert image"
        aria-label="Insert image"
      >
        <ImageIcon className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-5 bg-docs-border mx-1" />

      {/* Text Alignment Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowAlignDropdown(!showAlignDropdown)}
          className="p-1.5 rounded hover:bg-docs-hover flex items-center gap-0.5 text-slate-700 transition-colors"
          title="Align"
        >
          {editor.isActive({ textAlign: 'center' }) ? (
            <AlignCenter className="w-4 h-4" />
          ) : editor.isActive({ textAlign: 'right' }) ? (
            <AlignRight className="w-4 h-4" />
          ) : editor.isActive({ textAlign: 'justify' }) ? (
            <AlignJustify className="w-4 h-4" />
          ) : (
            <AlignLeft className="w-4 h-4" />
          )}
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>
        {showAlignDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-dropdown border border-docs-border p-1 z-40 flex items-center gap-0.5">
            <button
              onClick={() => { editor.chain().focus().setTextAlign('left').run(); setShowAlignDropdown(false); }}
              className={`p-1.5 rounded hover:bg-docs-hover ${editor.isActive({ textAlign: 'left' }) ? 'bg-docs-active text-blue-700' : 'text-slate-700'}`}
              title="Left align"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => { editor.chain().focus().setTextAlign('center').run(); setShowAlignDropdown(false); }}
              className={`p-1.5 rounded hover:bg-docs-hover ${editor.isActive({ textAlign: 'center' }) ? 'bg-docs-active text-blue-700' : 'text-slate-700'}`}
              title="Center align"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => { editor.chain().focus().setTextAlign('right').run(); setShowAlignDropdown(false); }}
              className={`p-1.5 rounded hover:bg-docs-hover ${editor.isActive({ textAlign: 'right' }) ? 'bg-docs-active text-blue-700' : 'text-slate-700'}`}
              title="Right align"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { editor.chain().focus().setTextAlign('justify').run(); setShowAlignDropdown(false); }}
              className={`p-1.5 rounded hover:bg-docs-hover ${editor.isActive({ textAlign: 'justify' }) ? 'bg-docs-active text-blue-700' : 'text-slate-700'}`}
              title="Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Line Spacing */}
      <div className="relative">
        <button
          onClick={() => setShowLineHeightDropdown(!showLineHeightDropdown)}
          className="h-7 px-1.5 rounded hover:bg-docs-hover flex items-center gap-0.5 text-xs text-slate-700 transition-colors"
          title="Line & paragraph spacing"
        >
          <span className="font-medium text-[11px]">1.5</span>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>
        {showLineHeightDropdown && (
          <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-md shadow-dropdown border border-docs-border py-1 z-40">
            {[
              { label: 'Single', value: '1.15' },
              { label: '1.15', value: '1.25' },
              { label: '1.5', value: '1.6' },
              { label: 'Double', value: '2.0' },
            ].map(spacing => (
              <button
                key={spacing.label}
                onClick={() => {
                  editor.chain().focus().setLineHeight(spacing.value).run();
                  setShowLineHeightDropdown(false);
                }}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-docs-hover text-slate-700"
              >
                {spacing.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-[1px] h-5 bg-docs-border mx-1" />

      {/* Bulleted List */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('bulletList')
            ? 'bg-blue-100 text-blue-700'
            : 'hover:bg-docs-hover text-slate-700'
        }`}
        title="Bulleted list"
        aria-label="Bulleted list"
      >
        <List className="w-4 h-4" />
      </button>

      {/* Numbered List */}
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('orderedList')
            ? 'bg-blue-100 text-blue-700'
            : 'hover:bg-docs-hover text-slate-700'
        }`}
        title="Numbered list"
        aria-label="Numbered list"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      {/* Indent & Outdent */}
      <button
        onClick={handleOutdent}
        className="p-1.5 rounded hover:bg-docs-hover text-slate-700 transition-colors"
        title="Decrease indent"
        aria-label="Decrease indent"
      >
        <Outdent className="w-4 h-4" />
      </button>

      <button
        onClick={handleIndent}
        className="p-1.5 rounded hover:bg-docs-hover text-slate-700 transition-colors"
        title="Increase indent"
        aria-label="Increase indent"
      >
        <Indent className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-5 bg-docs-border mx-1" />

      {/* Blockquote */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('blockquote')
            ? 'bg-blue-100 text-blue-700'
            : 'hover:bg-docs-hover text-slate-700'
        }`}
        title="Blockquote"
        aria-label="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>

      {/* Clear Formatting */}
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        className="p-1.5 rounded hover:bg-docs-hover text-slate-700 transition-colors"
        title="Clear formatting (Ctrl+\)"
        aria-label="Clear formatting"
      >
        <RemoveFormatting className="w-4 h-4" />
      </button>
    </div>
  );
};
