import { useEffect, useRef, useCallback } from "react";

interface DebounceOptions {
  delay?: number;
  leading?: boolean;
  trailing?: boolean;
}

export function useDebounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay = 300,
  { leading = false, trailing = true }: DebounceOptions = {},
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leadingCalledRef = useRef(false);

  const debouncedCallback = useCallback(
    (...args: T) => {
      const callLeading = leading && !leadingCalledRef.current;

      if (callLeading) {
        callback(...args);
        leadingCalledRef.current = true;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          callback(...args);
          leadingCalledRef.current = false;
        }, delay);
      } else {
        leadingCalledRef.current = false;
      }
    },
    [callback, delay, leading, trailing],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}
