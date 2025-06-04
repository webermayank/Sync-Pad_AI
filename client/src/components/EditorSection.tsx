import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import '../styles/EditorSection.css'; 
import editorImage from '../assets/editorImage.png'; 

const EditorSection: React.FC = () => {
  // Reference to the section to detect when it comes into view
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  // Animation controls for text and image
  const textControls = useAnimation();
  const imageControls = useAnimation();

  // Animation variants for the text content (fade-in)
  const textVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: 'easeInOut' } },
  };

  // Animation variants for the image (slide-in from right)
  const imageVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 1, ease: 'easeInOut' } },
  };

  // Trigger animations when the section comes into view
  useEffect(() => {
    if (isInView) {
      textControls.start('visible');
      imageControls.start('visible');
    }
  }, [isInView, textControls, imageControls]);

  return (
    <section className="editor-section" ref={ref}>
      <motion.div
        className="text-content"
        variants={textVariants}
        initial="hidden"
        animate={textControls}
      >
        <h1>
          Its a Text editor... <span>kinda</span>
        </h1>
        <h2>with emotional damage included.</h2>
        <p>Edit your text with quick and easy navigations</p>
        <p className="blah-text">BLAH BLAH BLAH...</p>
      </motion.div>
      <div className="image-content">
        <motion.img
          src={editorImage}
          alt="Text Editor Screenshot"
          variants={imageVariants}
          initial="hidden"
          animate={imageControls}
          className='glow-img'
        />
      </div>
    </section>
  );
};

export default EditorSection;