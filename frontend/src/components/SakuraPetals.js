import React, { useEffect, useRef } from 'react';

const SakuraPetals = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating sakura petals
    const createSakuraPetal = () => {
      const petal = document.createElement('div');
      petal.style.cssText = `
        position: absolute;
        width: 12px;
        height: 12px;
        background: #FFB7C5;
        border-radius: 50% 0 50% 0;
        transform: rotate(45deg);
        animation: sakura-fall 5s linear infinite;
        opacity: 0.7;
        pointer-events: none;
        z-index: 1;
      `;
      
      // Random starting position
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
      petal.style.animationDelay = Math.random() * 2 + 's';
      
      // Slight size variation
      const size = Math.random() * 6 + 8;
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      
      // Color variation
      const colors = ['#FFB7C5', '#FF91A4', '#FFA8B8', '#FFCCCB'];
      petal.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      container.appendChild(petal);
      
      // Remove petal after animation
      setTimeout(() => {
        if (petal.parentNode) {
          petal.remove();
        }
      }, 5000);
    };

    // Create petals periodically
    const interval = setInterval(createSakuraPetal, 800);

    // Add some immediate petals
    for (let i = 0; i < 5; i++) {
      setTimeout(createSakuraPetal, i * 200);
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default SakuraPetals;
