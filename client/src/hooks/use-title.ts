import { useEffect } from 'react';

/**
 * Hook to set the document title
 * @param title The title to set for the page
 */
export function useTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    
    // Clean up when the component unmounts
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}