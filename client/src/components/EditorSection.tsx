import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import '../styles/EditorSection.css';
import editorImage from '../assets/editorImage.png';
import TypingText from '../animations/TypingText';

const EditorSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  const textControls = useAnimation();
  const imageControls = useAnimation();

  const textVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: 'easeInOut' } },
  };

  const imageVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 1, ease: 'easeInOut' } },
  };

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
          <TypingText text={['It\'s a Text editor...', 'kinda']} />
        </h1>
        <h2>
          <TypingText text={['with magic of Artificial Intelligence.']} />
        </h2>
        <p>
          <TypingText text={['Ease in writing Long stuff']} />
        </p>
      </motion.div>
      <div className="image-content">
        <motion.img
          src={editorImage}
          alt="Text Editor Screenshot"
          variants={imageVariants}
          initial="hidden"
          animate={imageControls}
          className="glow-img"
        />
      </div>
    </section>
  );
};

export default EditorSection;