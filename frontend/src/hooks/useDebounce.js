import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook personalizado para debouncing
 * @param {Function} callback - Función a ejecutar
 * @param {number} delay - Retraso en milisegundos
 * @returns {Function} - Función con debounce
 */
export const useDebounce = (callback, delay = 500) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Hook para valor con debounce
 * @param {any} value - Valor a debounce
 * @param {number} delay - Retraso en ms
 * @returns {any} - Valor con debounce
 */
export const useDebouncedValue = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
