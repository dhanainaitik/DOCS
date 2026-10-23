import React, { useState } from 'react';
import { X, Link as LinkIcon, Image as ImageIcon, BarChart2, Keyboard, Upload } from 'lucide-react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, text?: string) => void;
  initialUrl?: string;
  initialText?: string;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = '',
  initialText = '',
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://') && !formattedUrl.startsWith('mailto:')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    onSubmit(formattedUrl, text.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-modal border border-docs-border w-full max-w-md p-5 animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between pb-3 border-b border-docs-border-light mb-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <LinkIcon className="w-4 h-4 text-blue-600" />
            <span>Insert link</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Link URL</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-docs-border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Text (optional)</label>
            <input
              type="text"
              placeholder="Display text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border border-docs-border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-800 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-sm transition-colors"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (src: string, alt?: string) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [tab, setTab] = useState<'upload' | 'url'>('url');
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPreviewSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSrc = tab === 'upload' ? previewSrc : url;
    if (!finalSrc) return;
    onSubmit(finalSrc, alt.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-modal border border-docs-border w-full max-w-md p-5 animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between pb-3 border-b border-docs-border-light mb-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Insert Image</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-docs-border mb-4 text-xs">
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`pb-2 px-3 font-medium transition-colors border-b-2 -mb-px ${
              tab === 'url' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            By URL
          </button>
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`pb-2 px-3 font-medium transition-colors border-b-2 -mb-px ${
              tab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Upload from computer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {tab === 'url' ? (
            <div>
              <label className="block text-slate-600 font-medium mb-1">Image Web Address (URL)</label>
              <input
                type="text"
                required
                placeholder="https://images.unsplash.com/photo-..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-docs-border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-800 text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="block text-slate-600 font-medium mb-1">Select an Image File</label>
              <label className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-slate-50 cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mb-2" />
                <span className="text-xs text-slate-600 font-medium">Click to choose image (PNG, JPG, WebP)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {previewSrc && (
                <div className="mt-3 relative w-full h-32 bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center">
                  <img src={previewSrc} alt="Preview" className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-slate-600 font-medium mb-1">Alt text (description)</label>
            <input
              type="text"
              placeholder="Brief description of the image"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full px-3 py-2 border border-docs-border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-800 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={tab === 'url' ? !url.trim() : !previewSrc}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-sm transition-colors disabled:opacity-40"
            >
              Insert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface WordCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordCount: number;
  characterCount: number;
}

export const WordCountModal: React.FC<WordCountModalProps> = ({
  isOpen,
  onClose,
  wordCount,
  characterCount,
}) => {
  if (!isOpen) return null;

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-modal border border-docs-border w-full max-w-sm p-5 animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between pb-3 border-b border-docs-border-light mb-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <BarChart2 className="w-4 h-4 text-blue-600" />
            <span>Word count statistics</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Words</span>
            <span className="font-semibold text-slate-800">{wordCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Characters</span>
            <span className="font-semibold text-slate-800">{characterCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Estimated reading time</span>
            <span className="font-semibold text-slate-800">~{readingTime} min</span>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { action: 'Bold', keys: 'Ctrl + B' },
    { action: 'Italic', keys: 'Ctrl + I' },
    { action: 'Underline', keys: 'Ctrl + U' },
    { action: 'Undo', keys: 'Ctrl + Z' },
    { action: 'Redo', keys: 'Ctrl + Y / Ctrl + Shift + Z' },
    { action: 'Insert link', keys: 'Ctrl + K' },
    { action: 'Select all', keys: 'Ctrl + A' },
    { action: 'Clear formatting', keys: 'Ctrl + \\' },
    { action: 'Print document', keys: 'Ctrl + P' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-modal border border-docs-border w-full max-w-md p-5 animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between pb-3 border-b border-docs-border-light mb-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Keyboard className="w-4 h-4 text-blue-600" />
            <span>Keyboard shortcuts</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
          {shortcuts.map((sc) => (
            <div key={sc.action} className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">{sc.action}</span>
              <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-700">
                {sc.keys}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
