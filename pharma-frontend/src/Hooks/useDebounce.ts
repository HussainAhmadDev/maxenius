import { useEffect, useState } from "react";

/**
 * This hook allows you to debounce any fast changing value.
 * The debounced value will only reflect the latest value when the useDebounce
 * hook has not been called for the specified time period. With this you can
 * easily ensure that expensive operations like API calls are not executed too frequently
 */
export const useDebounce = <T>(value: T, delay: number): T => {
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
