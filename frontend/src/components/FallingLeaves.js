import React, { useEffect } from 'react';

const FallingLeaves = () => {
  useEffect(() => {
    const createLeaf = () => {
      const leaf = document.createElement('div');
      leaf.classList.add('falling-leaf');
      
      // Random starting position
      leaf.style.left = Math.random() * 100 + '%';
      leaf.style.animationDuration = (Math.random() * 4 + 3) + 's';
      leaf.style.animationDelay = Math.random() * 2 + 's';
      
      // Slight size variation
      const size = Math.random() * 8 + 12;
      leaf.style.width = size + 'px';
      leaf.style.height = size + 'px';
      
      // Color variation for autumn leaves
      const colors = ['#d2691e', '#cd853f', '#daa520', '#b8860b', '#ff8c00'];
      leaf.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      document.body.appendChild(leaf);
      
      // Remove leaf after animation
      setTimeout(() => {
        if (leaf.parentNode) {
          leaf.remove();
        }
      }, 7000);
    };

    // Create leaves periodically
    const interval = setInterval(createLeaf, 1000);

    // Add some immediate leaves
    for (let i = 0; i < 3; i++) {
      setTimeout(createLeaf, i * 300);
    }

    return () => {
      clearInterval(interval);
      // Clean up any remaining leaves
      document.querySelectorAll('.falling-leaf').forEach(leaf => leaf.remove());
    };
  }, []);

  return null;
};

export default FallingLeaves;
