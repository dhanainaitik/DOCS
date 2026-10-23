import React, { useRef } from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import type { ZoomLevel } from '../types/document';
import { DocumentRuler } from './DocumentRuler';

interface DocumentCanvasProps {
  editor: Editor | null;
  zoom: ZoomLevel;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  editor,
  zoom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePageClick = (e: React.MouseEvent) => {
    // If user clicks on the page padding or around the text, focus the editor at the end
    if (editor && e.target === e.currentTarget) {
      editor.chain().focus('end').run();
    }
  };

  const scale = zoom / 100;

  return (
    <div className="flex-1 flex flex-col bg-[#f0f4f9] overflow-hidden relative">
      {/* Optional Top Ruler */}
      <DocumentRuler />

      {/* Workspace Scroll Area */}
      <div 
        ref={containerRef}
        className="workspace-scroll-area flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 flex justify-center items-start scroll-smooth"
      >
        <div 
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            transition: 'transform 0.12s ease-out',
            marginBottom: scale > 1 ? `${(scale - 1) * 800}px` : '40px',
          }}
          className="pb-16"
        >
          {/* A4 Sheet */}
          <div 
            onClick={handlePageClick}
            className="document-page relative transition-shadow hover:shadow-lg"
          >
            <EditorContent 
              editor={editor} 
              className="outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
