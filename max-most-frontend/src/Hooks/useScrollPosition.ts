import { useState, useEffect } from "react";
/**
 * Interface for scroll position.
 */
type ScrollPosition = {
  x: number;
  y: number;
};

/**
 * Custom hook to get the scroll position.
 * @param {HTMLElement | null} target - The target element to get the scroll position from.
 * @returns {ScrollPosition} - The scroll position.
 */
const useScrollPosition = (target?: HTMLElement | null): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (target) {
        setScrollPosition({
          x: target.scrollLeft,
          y: target.scrollTop
        });
      } else {
        setScrollPosition({
          x: window.pageXOffset || document.documentElement.scrollLeft,
          y: window.pageYOffset || document.documentElement.scrollTop
        });
      }
    };

    if (target) {
      target.addEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }

    handleScroll();

    return () => {
      if (target) {
        target.removeEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [target]);

  return scrollPosition;
};

export default useScrollPosition;
