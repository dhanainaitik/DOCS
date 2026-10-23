# Read — Professional Document Editor

Read is a polished, professional, responsive frontend document editor inspired by Google Docs, built with React, Vite, TypeScript, Tailwind CSS, and TipTap (ProseMirror).

![Read Document Editor](public/favicon.svg)

## Features

- **Immediate Editing Experience**: Starts ready to type instantly on a simulated A4 document sheet with authentic margins and typography.
- **Document Outline Sidebar**: Collapsible navigation sidebar that dynamically extracts `H1`, `H2`, and `H3` headings in real-time, with smooth-scrolling to headings when clicked.
- **Rich-Text Formatting Toolbar**:
  - History controls (Undo / Redo)
  - Zoom scaling (50% – 200%)
  - Paragraph & Heading level selectors (Normal, Heading 1, Heading 2, Heading 3)
  - Font family (Inter, Roboto, Merriweather, Playfair Display, JetBrains Mono, Arial, Georgia, Times New Roman)
  - Font size selector (increment, decrement, and custom sizing)
  - Text formatting (Bold, Italic, Underline, Strikethrough)
  - Text color & highlighter palette
  - Text alignment (Left, Center, Right, Justify)
  - Line & paragraph spacing
  - Bulleted and Numbered lists
  - Indentation controls (Indent, Outdent)
  - Blockquote, Code block, and Horizontal rules
  - Insert Link and Image (via URL or local file upload)
  - Clear formatting
- **Inline Title Renaming**: Click the document title in the header to rename with immediate synchronization.
- **Local Persistence**: Debounced synchronization to browser `localStorage` ensuring all content, title, and favorites persist across page reloads.
- **Live Word & Character Count**: Dynamic statistics in the bottom status bar and full breakdown modal.
- **Keyboard Shortcuts**: Full support for standard shortcuts (<kbd>Ctrl+B</kbd>, <kbd>Ctrl+I</kbd>, <kbd>Ctrl+U</kbd>, <kbd>Ctrl+Z</kbd>, <kbd>Ctrl+Y</kbd>, <kbd>Ctrl+K</kbd>, <kbd>Ctrl+P</kbd>, <kbd>Ctrl+/</kbd>).

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v3
- **Rich-Text Engine**: TipTap 2/3 (ProseMirror)
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
