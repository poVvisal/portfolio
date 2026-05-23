import React, { useState, useEffect, useRef } from 'react';

export const AnimatedSection = ({ children, className = "", id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.15 });
    
    const { current } = domRef;
    if (current) observer.observe(current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id={id}
      ref={domRef} 
      data-visible={isVisible ? 'true' : 'false'}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} w-full ${className}`}
    >
      {children}
    </section>
  );
};
