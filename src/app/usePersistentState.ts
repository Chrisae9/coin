"use client";

import { useState, useEffect } from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

function usePersistentState<T>(key: string, initialState: T): [T, SetValue<T>] {
  const isClient = typeof window !== 'undefined';

  const [state, setState] = useState<T>(() => {
    if (isClient) {
      try {
        const storedValue = window.localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialState;
      } catch (error) {
        console.error('Error reading from localStorage', error);
        return initialState;
      }
    }
    return initialState;
  });

  useEffect(() => {
    if (isClient) {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error('Error writing to localStorage', error);
      }
    }
  }, [key, state, isClient]);

  const setValue: SetValue<T> = (value) => {
    setState(value);
  };

  return [state, setValue];
}

export default usePersistentState;
