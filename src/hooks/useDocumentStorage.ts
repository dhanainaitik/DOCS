import { useState, useEffect, useRef, useCallback } from 'react';
import type { SaveStatus } from '../types/document';

const STORAGE_KEYS = {
  TITLE: 'read_title_v1',
  STARRED: 'read_starred_v1',
  CONTENT: 'read_content_v1',
};

export function useDocumentStorage() {
  const [title, setTitleState] = useState<string>(() => {
    try {
      return (
        localStorage.getItem(STORAGE_KEYS.TITLE) ||
        localStorage.getItem('docs_title_v1') ||
        localStorage.getItem('draftly_title_v1') ||
        'Untitled document'
      );
    } catch {
      return 'Untitled document';
    }
  });

  const [isStarred, setIsStarredState] = useState<boolean>(() => {
    try {
      const val =
        localStorage.getItem(STORAGE_KEYS.STARRED) ??
        localStorage.getItem('docs_starred_v1') ??
        localStorage.getItem('draftly_starred_v1');
      return val === 'true';
    } catch {
      return false;
    }
  });

  const [initialContent] = useState<string>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEYS.CONTENT) ??
        localStorage.getItem('docs_content_v1') ??
        localStorage.getItem('draftly_content_v1');
      if (saved !== null) return saved;
      return '';
    } catch {
      return '';
    }
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const debounceTimerRef = useRef<number | null>(null);

  const saveToStorage = useCallback((newTitle: string, newStarred: boolean, newContent?: string) => {
    setSaveStatus('saving');
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.TITLE, newTitle);
        localStorage.setItem(STORAGE_KEYS.STARRED, String(newStarred));
        if (newContent !== undefined) {
          localStorage.setItem(STORAGE_KEYS.CONTENT, newContent);
        }
        setSaveStatus('saved');
      } catch (err) {
        console.error('Failed to save document to localStorage:', err);
        setSaveStatus('unsaved');
      }
    }, 600);
  }, []);

  const updateTitle = useCallback((newTitle: string) => {
    const trimmed = newTitle.trim() || 'Untitled document';
    setTitleState(trimmed);
    saveToStorage(trimmed, isStarred);
  }, [isStarred, saveToStorage]);

  const toggleStar = useCallback(() => {
    setIsStarredState(prev => {
      const next = !prev;
      saveToStorage(title, next);
      return next;
    });
  }, [title, saveToStorage]);

  const onContentChange = useCallback((htmlContent: string) => {
    saveToStorage(title, isStarred, htmlContent);
  }, [title, isStarred, saveToStorage]);

  const clearDocument = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CONTENT);
      localStorage.setItem(STORAGE_KEYS.TITLE, 'Untitled document');
      localStorage.setItem(STORAGE_KEYS.STARRED, 'false');
      setTitleState('Untitled document');
      setIsStarredState(false);
      setSaveStatus('saved');
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    title,
    updateTitle,
    isStarred,
    toggleStar,
    initialContent,
    saveStatus,
    onContentChange,
    clearDocument,
  };
}
