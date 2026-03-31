import { useState, useEffect, useRef } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const hydrated = useRef(false);

  // Load from localStorage AFTER first render (client-side only)
  // Using requestAnimationFrame to avoid synchronous setState warning
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem(key);
        if (stored !== null) {
          setValue(JSON.parse(stored));
        }
      } catch {
        setValue(initialValue);
      }
      hydrated.current = true;
    });
    return () => cancelAnimationFrame(frame);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save to localStorage on change, but only after hydration
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable (private mode, quota exceeded, etc.)
    }
  }, [key, value]);

  return [value, setValue];
}
