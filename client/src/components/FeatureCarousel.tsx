import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import '../styles/FeatureCarousel.css';

interface Feature {
  title: string;
  description: string;
  icon: string;
  delay: number;
}

const features: Feature[] = [
  {
    title: 'Creative Boost ',
    description: 'Unlock your potential with intelligent suggestions that inspire and improve your writing flow',
    icon: '🔧',
    delay: 0
  },
  {
    title: 'Smart Enhancement',

    description: 'AI- powered suggestions that elevate your writing while preserving your unique voice and style.',
    icon: '💬',
    delay: 0.2
  },
  {
    title: 'Single click Summarization',
    description: 'Quickly condense your notes into concise summaries, making it easy to review and share key insights.',
    icon: '🔒',
    delay: 0.4
  }
];

const FeatureCards: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [inView, controls]);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.6 } }
  };
  const card = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section className="feature-section" ref={ref}>
      {/* particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}

      <div className="feature-gradient-orb-1" />
      <div className="feature-gradient-orb-2" />

      <div className="feature-cards-container">
        <motion.div
          className="feature-section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
        >
          <h2 className="feature-section-title">
            Powerful Features for Modern Writing
          </h2>
          <p className="feature-section-subtitle">
            Transform your writing experience with AI-powered tools that adapt to your style and enhance your creativity
          </p>
        </motion.div>

        <motion.div
          className="feature-cards-grid"
          variants={container}
          initial="hidden"
          animate={controls}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              variants={card}
              whileHover={{ scale: 1.05, y: -10, transition: { duration: 0.3 } }}
            >
              <div className="card-gradient-bg"></div>
              <div className="card-content">
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-description">{f.description}</div>
                </div>
                <div className="ping-dot" />
                <div className="accent-line" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCards;
