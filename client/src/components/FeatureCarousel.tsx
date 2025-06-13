import React, { useState, useEffect, useRef } from 'react';
import '../styles/FeatureCarousel.css';

interface Feature {
  title: string;
  description: string;
  image: string; // Add image property
}

const features: Feature[] = [
  {
    title: 'Focused Explanation',
    description: "Don't get stuck just ask AI to explain your text in a simple way, so you can focus on writing.",
    image: '/assets/insights.png', 
  },
  {
    title: 'Smart Enhancement',
    description: 'AI-powered suggestions that elevate your writing while preserving your unique voice and style.',
    image: '/assets/enhancement.png',
  },
  {
    title: 'Creative Boost',
    description: 'Unlock your potential with intelligent suggestions that inspire and improve your writing flow.',
    image: '/assets/boost.png', 
  },
  {
    title: 'Gentle Guidance',
    description: 'Thoughtful explanations and tips that help you learn and grow as a writer with confidence.',
    image: '/assets/guidance.png', 
  },
];

const FeatureCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const prevIndex = () => {
    setCurrentIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  const nextIndex = () => {
    setCurrentIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAutoplay = () => {
    stopAutoplay();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
    }, 3000);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div
      className="carousel-container"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      <button className="nav-button left" onClick={prevIndex}>&lt;</button>
      <div className="carousel-cards">
        {features.map((feature, index) => {
          const offset = index - currentIndex;
          let classNames = 'card';
          if (offset === 0) {
            classNames += ' active';
          } else if (offset === -1 || (currentIndex === 0 && index === features.length - 1)) {
            classNames += ' prev';
          } else if (offset === 1 || (currentIndex === features.length - 1 && index === 0)) {
            classNames += ' next';
          } else {
            classNames += ' hidden';
          }

          return (
            <div key={index} className={classNames}>
              <img src={feature.image} alt={feature.title} className="card-image" />
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-desc">{feature.description}</p>
            </div>
          );
        })}
      </div>
      <button className="nav-button right" onClick={nextIndex}>&gt;</button>
    </div>
  );
};

export default FeatureCarousel;
