import { useEffect, useRef, useState } from 'react';

interface IntersectionOptions {
  rootMargin?: string;
  /** When true (default), stop observing after first intersection. */
  once?: boolean;
}

export function useIntersectionObserver(
  threshold = 0.1,
  { rootMargin = '0px', once = true }: IntersectionOptions = {}
) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
