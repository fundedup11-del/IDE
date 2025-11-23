"use client"

import React from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  // Split text into words for more granular control
  const words = text.split(' ');

  return (
    <div className={className}>
      {words.map((word, index) => {
        // Calculate opacity based on position in text (darker at start, lighter at end)
        const progress = index / (words.length - 1);
        const opacity = Math.max(0.3, 1 - (progress * 0.7)); // Start at 1, fade to 0.3
        
        return (
          <span
            key={index}
            className="text-gray-700 transition-all duration-300 ease-in-out"
            style={{
              opacity: opacity,
              color: `rgb(${55 + progress * 100}, ${65 + progress * 100}, ${81 + progress * 100})` // Gradual fade from dark to light grey
            }}
          >
            {word}
            {index < words.length - 1 && ' '}
          </span>
        );
      })}
    </div>
  );
}
