export interface HeadingItem {
  id: string;
  text: string;
  level: number;
  pos: number;
}

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

export interface DocumentMetadata {
  title: string;
  isStarred: boolean;
  lastModified: number;
  content: string;
}

export type ZoomLevel = 50 | 75 | 90 | 100 | 125 | 150 | 200;

export interface ActiveBlockStyle {
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'title' | 'subtitle';
  label: string;
}
