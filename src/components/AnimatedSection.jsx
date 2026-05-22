import React, { useState, useEffect, useRef } from 'react';

export const AnimatedSection = ({ children, className = "", id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.unobserve(domRef.current);
      }
    }, { threshold: 0.15 });
    
    const { current } = domRef;
    if (current) observer.observe(current);
    
    return () => { if (current) observer.unobserve(current); };
  }, []);

  return (
    <section 
      id={id}
      ref={domRef} 
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} w-full ${className}`}
    >
      {children}
    </section>
  );
};
