"use client";

import { useState, useEffect } from 'react';

function usePersistentState<T>(key: string, defaultValue: T): [T, (value: T | ((prevState: T) => T)) => void] {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) {
      try {
        setState(JSON.parse(storedValue));
      } catch (error) {
        console.error("Error parsing JSON from localStorage", error);
      }
    }
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default usePersistentState;
