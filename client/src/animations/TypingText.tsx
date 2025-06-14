import React, { useState, useEffect } from 'react';
import '../styles/TypingText.css';

interface TypingTextProps {
    text: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
}

const TypingText: React.FC<TypingTextProps> = ({
    text,
    typingSpeed = 90,
    deletingSpeed = 60,
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentText = text[currentIndex];
        let timeout: NodeJS.Timeout;

        if (isDeleting) {
            timeout = setTimeout(() => {
                setDisplayedText((prev) => prev.slice(0, -1));
                if (displayedText === '') {
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % text.length);
                }
            }, deletingSpeed);
        } else {
            timeout = setTimeout(() => {
                setDisplayedText((prev) => currentText.slice(0, prev.length + 1));
                if (displayedText === currentText) {
                    setIsDeleting(true);
                }
            }, typingSpeed);
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, currentIndex, text, typingSpeed, deletingSpeed]);

    return <span className="typing-text">{displayedText}|</span>;
};

export default TypingText;