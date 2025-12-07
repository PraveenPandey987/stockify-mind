
// Define common CSS transitions for animations
export const transitions = {
  // Base transition properties
  base: 'transition-all duration-300 ease-in-out',
  
  // Speeds
  fast: 'transition-all duration-150 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
  
  // For page transitions
  page: 'transition-opacity duration-300',
  
  // For modal transitions
  modal: 'transition-all duration-200 ease-out',
  
  // For hover effects
  hover: 'transition-transform duration-200 hover:scale-102',
  
  // For focus effects
  focus: 'transition-shadow duration-200 focus:shadow-md',
};

// Define keyframe animations
export const keyframes = {
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  
  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  
  // Slide animations
  slideIn: 'animate-slide-in',
  slideOut: 'animate-slide-out',
  
  // Utility animations
  shimmer: 'animate-shimmer',
  pulse: 'animate-pulse-gentle',
};

// Animation utilities for DOM elements
export const animateElement = (
  element: HTMLElement,
  animation: string,
  duration: number = 300
): Promise<void> => {
  return new Promise((resolve) => {
    // Add the animation class
    element.classList.add(animation);
    
    // Remove the animation class after duration
    setTimeout(() => {
      element.classList.remove(animation);
      resolve();
    }, duration);
  });
};

// Animation for page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

// Generate CSS for subtle animations
export const subtleAnimation = (type: 'hover' | 'focus' | 'active') => {
  switch (type) {
    case 'hover':
      return 'transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-md';
    case 'focus':
      return 'transition-all duration-200 focus:ring-2 focus:ring-primary/50';
    case 'active':
      return 'transition-all duration-200 active:scale-[0.98]';
    default:
      return '';
  }
};
