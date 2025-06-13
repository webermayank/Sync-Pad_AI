import React from 'react';
import '../styles/ContributeSection.css'; // make sure to create and include this CSS file
import angryGit from '../assets/Angry Oh Brother Sticker by GitHub.gif';
import loveGit from '../assets/In Love Hearts Sticker by GitHub.gif';
import confetti from 'canvas-confetti';

const GitHubContribute: React.FC = () => {
  const handleCheer = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    confetti({
      particleCount: 50,
      spread: 120,
      decay: 0.9,
      scalar: 1.2,
      origin: { x: 0.3, y: 0.5 },
      colors: ['#bb0000', '#ffffff'],
    });
    confetti({
      particleCount: 50,
      spread: 120,
      decay: 0.9,
      scalar: 1.2,
      origin: { x: 0.7, y: 0.5 },
      colors: ['#00bb00', '#ffffff'],
    });
  }
  return (
    <section className="github-contribute-section">
      <div className="gif-wrapper">
        <img
          src={angryGit}
          alt="Angry GitHub"
          className="github-gif"
          onClick={handleCheer}
          onMouseOver={(e) => (e.currentTarget.src = loveGit)}
          onMouseOut={(e) => (e.currentTarget.src = angryGit)}
        />
      </div>
      <p className="github-message">
        Got complaints? Contribute on GitHub instead of whining... or both, we won't stop you.
      </p>
    
      <a href="https://github.com/webermayank/Sync-Pad_AI" target="_blank" className="star-button">   
           ⭐ Star & Contribute on GitHub
      </a>
    </section>
  );
};

export default GitHubContribute;
