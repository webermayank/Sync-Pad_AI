import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import '../styles/landing.css';
import { useNavigate } from 'react-router-dom';

const EditorSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  const textControls = useAnimation();
  const imageControls = useAnimation();
  const navigate = useNavigate();

  // Track mouse movement for interactive background
  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
      document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2
      }
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const imageVariants = {
    hidden: { x: '100%', opacity: 0, scale: 0.8 },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: 'easeOut',
        type: 'spring',
        damping: 20
      }
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  useEffect(() => {
    if (isInView) {
      textControls.start('visible');
      imageControls.start('visible');
    }
  }, [isInView, textControls, imageControls]);

  return (
    <section
      className="editor-section"
      ref={ref}
    >
      {/* Animated background particles */}
      <div className="background-particles">
        {[...Array(20)].map((_, i) => (
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
      </div>

      {/* Gradient orbs */}
      <div className="gradient-orb-1"></div>
      <div className="gradient-orb-2"></div>

      <motion.div
        className="text-content"
        variants={textVariants}
        initial="hidden"
        animate={textControls}
      >
        <motion.div variants={childVariants}>
          <h1>
            It's a Text editor
            <motion.span
              className="kinda-text"
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              ...kinda
            </motion.span>
          </h1>
        </motion.div>

        <motion.div variants={childVariants}>
          <h2>
            with magic of{' '}
            <span className="ai-text">
              Artificial Intelligence
            </span>
          </h2>
        </motion.div>

        <motion.div variants={childVariants}>
          <p>
            Ease in writing Long stuff
          </p>
        </motion.div>

        <motion.div
          variants={childVariants}
          className="cta-buttons"
        >
          <motion.button
            className="btn-primary"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(139, 69, 255, 0.3)'
            }}
            whileTap={{ scale: 0.98 }}

            onClick={()=> navigate('/editor')}
          >
            Try It Now
          </motion.button>
          <motion.button
            className="btn-secondary"
            whileHover={{
              scale: 1.05,
              backgroundColor: 'rgba(139, 69, 255, 0.1)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="image-content">
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate={imageControls}
        >
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="editor-mockup"
          >
            {/* Editor header */}
            <div className="editor-header">
              <div className="window-controls">
                <div className="window-control control-red"></div>
                <div className="window-control control-yellow"></div>
                <div className="window-control control-green"></div>
              </div>
              <div className="editor-title">AI Editor</div>
            </div>

            {/* Editor toolbar */}
            <div className="editor-toolbar">
              <div className="toolbar-group">
                <div className="toolbar-button"></div>
                <div className="toolbar-button"></div>
                <div className="toolbar-button"></div>
              </div>
              <div className="toolbar-divider"></div>
              <div className="toolbar-group">
                <div className="toolbar-button toolbar-ai"></div>
                <div className="toolbar-button toolbar-smart"></div>
              </div>
            </div>

            {/* Editor content */}
            <div className="editor-content">
              <div className="content-line line-1"></div>
              <div className="content-line line-2"></div>
              <div className="content-line line-3"></div>
              <div className="ai-typing">
                <motion.div
                  className="typing-indicator"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="typing-text">AI is typing...</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
};

export default EditorSection;
