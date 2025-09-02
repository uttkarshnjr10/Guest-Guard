import { useEffect, useState, useRef } from 'react';

export const useIntersectionObserver = (options) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

 useEffect(() => {
  const element = elementRef.current; // <-- 1. Copy the ref value to a variable

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      setIsVisible(true);
      if (element) { // <-- 3. Use the variable here
        observer.unobserve(element);
      }
    }
  }, options);

  if (element) { // <-- 2. Use the variable here
    observer.observe(element);
  }

  return () => {
    if (element) { // <-- 4. And use the variable in the cleanup function
      observer.unobserve(element);
    }
  };
}, [options]); 

  return [elementRef, isVisible];
};