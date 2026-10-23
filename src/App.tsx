import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

import { FontSize } from './extensions/fontSize';
import { LineHeight } from './extensions/lineHeight';
import { useDocumentStorage } from './hooks/useDocumentStorage';
import type { HeadingItem, ZoomLevel } from './types/document';
import { SAMPLE_DOCUMENT_HTML } from './utils/sampleDocument';

import { AppHeader } from './components/AppHeader';
import { MenuBar } from './components/MenuBar';
import { FormattingToolbar } from './components/FormattingToolbar';
import { DocumentSidebar } from './components/DocumentSidebar';
import { DocumentCanvas } from './components/DocumentCanvas';
import { StatusBar } from './components/StatusBar';
import { LinkModal, ImageModal, WordCountModal, ShortcutsModal } from './components/Modals';

export const App: React.FC = () => {
  const {
    title,
    updateTitle,
    isStarred,
    toggleStar,
    initialContent,
    saveStatus,
    onContentChange,
    clearDocument,
  } = useDocumentStorage();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState<ZoomLevel>(100);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  // Modals state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isWordCountModalOpen, setIsWordCountModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Update browser document title
  useEffect(() => {
    document.title = `${title || 'Untitled document'} — Docs`;
  }, [title]);

  const extractHeadings = useCallback((editorInstance: Editor): HeadingItem[] => {
    const items: HeadingItem[] = [];
    editorInstance.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        const text = node.textContent.trim();
        if (text) {
          items.push({
            id: `heading-${pos}`,
            text,
            level: node.attrs.level || 1,
            pos,
          });
        }
      }
    });
    return items;
  }, []);

  const updateStatsAndOutline = useCallback((editorInstance: Editor) => {
    setHeadings(extractHeadings(editorInstance));
    const words = editorInstance.storage.characterCount?.words() || 0;
    const chars = editorInstance.storage.characterCount?.characters() || 0;
    setWordCount(words);
    setCharacterCount(chars);
  }, [extractHeadings]);

  // TipTap Editor instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily,
      FontSize,
      LineHeight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your document...',
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount,
    ],
    content: initialContent || '',
    autofocus: 'end',
    onCreate({ editor: e }) {
      updateStatsAndOutline(e);
    },
    onUpdate({ editor: e }) {
      updateStatsAndOutline(e);
      onContentChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[850px] leading-relaxed',
      },
    },
  });

  // Handle heading click in outline to jump to position
  const handleHeadingClick = useCallback((heading: HeadingItem) => {
    if (!editor) return;
    editor.chain().focus().setTextSelection(heading.pos + 1).run();

    // Scroll element smoothly into center view
    setTimeout(() => {
      const headingElements = Array.from(
        document.querySelectorAll('.ProseMirror h1, .ProseMirror h2, .ProseMirror h3')
      );
      const target = headingElements.find(
        (el) => el.textContent?.trim() === heading.text
      );
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  }, [editor]);

  // Handle new blank document
  const handleNewDocument = useCallback(() => {
    if (editor) {
      editor.commands.setContent('');
      editor.commands.focus();
    }
    clearDocument();
    setHeadings([]);
    setWordCount(0);
    setCharacterCount(0);
  }, [editor, clearDocument]);

  // Handle load sample document
  const handleLoadSample = useCallback(() => {
    if (editor) {
      editor.commands.setContent(SAMPLE_DOCUMENT_HTML);
      editor.commands.focus();
      updateStatsAndOutline(editor);
      updateTitle('Project Requirements: Project Docs');
    }
  }, [editor, updateStatsAndOutline, updateTitle]);

  // Handle print
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Insert Link action
  const handleInsertLink = (url: string, text?: string) => {
    if (!editor) return;
    if (text && editor.state.selection.empty) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}">${text}</a>`)
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  // Insert Image action
  const handleInsertImage = (src: string, alt?: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src, alt: alt || '' }).run();
  };

  // Keyboard shortcut listeners (Ctrl+P, Ctrl+K, Ctrl+/, Ctrl+Shift+C)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsLinkModalOpen(true);
      } else if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setIsWordCountModalOpen(true);
      } else if (cmdOrCtrl && e.key === '/') {
        e.preventDefault();
        setIsShortcutsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handlePrint]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-docs-bg text-docs-text">
      {/* 1. Top Header */}
      <AppHeader
        title={title}
        onRename={updateTitle}
        isStarred={isStarred}
        onToggleStar={toggleStar}
        saveStatus={saveStatus}
        onPrint={handlePrint}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      {/* 2. Menu Bar */}
      <MenuBar
        editor={editor}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        zoom={zoom}
        onSetZoom={setZoom}
        onPrint={handlePrint}
        onNewDocument={handleNewDocument}
        onInsertLink={() => setIsLinkModalOpen(true)}
        onInsertImage={() => setIsImageModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onOpenWordCount={() => setIsWordCountModalOpen(true)}
        onLoadSample={handleLoadSample}
      />

      {/* 3. Formatting Toolbar */}
      <FormattingToolbar
        editor={editor}
        zoom={zoom}
        onSetZoom={setZoom}
        onPrint={handlePrint}
        onOpenLinkModal={() => setIsLinkModalOpen(true)}
        onOpenImageModal={() => setIsImageModalOpen(true)}
      />

      {/* 4. Middle Workspace (Sidebar + Canvas) */}
      <main className="flex-1 flex overflow-hidden relative">
        <DocumentSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(false)}
          headings={headings}
          onHeadingClick={handleHeadingClick}
        />

        <DocumentCanvas
          editor={editor}
          zoom={zoom}
        />
      </main>

      {/* 5. Bottom Status Bar */}
      <StatusBar
        wordCount={wordCount}
        characterCount={characterCount}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        zoom={zoom}
        onOpenWordCount={() => setIsWordCountModalOpen(true)}
      />

      {/* Modals */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSubmit={handleInsertLink}
      />

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSubmit={handleInsertImage}
      />

      <WordCountModal
        isOpen={isWordCountModalOpen}
        onClose={() => setIsWordCountModalOpen(false)}
        wordCount={wordCount}
        characterCount={characterCount}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
};

export default App;
