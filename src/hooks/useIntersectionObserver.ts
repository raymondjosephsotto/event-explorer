import { useEffect, useRef, useCallback } from 'react';

export const useIntersectionObserver = (
  onIntersect: () => void,
  { threshold = 0.1, rootMargin = '200px' }: IntersectionObserverInit = {}
) => {
  // Keep a stable ref to the callback so the observer doesn't need to be
  // re-created every time the parent re-renders with a new function reference.
  const callbackRef = useRef(onIntersect);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    callbackRef.current = onIntersect;
  }, [onIntersect]);

  // Callback ref: fires whenever the sentinel element is added to or removed
  // from the DOM. This is the key difference from useRef — a plain useRef +
  // useEffect won't re-run when the sentinel conditionally mounts after the
  // first render (e.g. once hasMore becomes true).
  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) callbackRef.current();
        },
        { threshold, rootMargin }
      );

      observerRef.current.observe(node);
    },
    [threshold, rootMargin]
  );

  return ref;
};
