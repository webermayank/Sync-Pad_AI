import React from 'react';
import '../styles/ContributeSection.css';
import angryGit from '../assets/Angry Oh Brother Sticker by GitHub.gif';
import loveGit from '../assets/In Love Hearts Sticker by GitHub.gif';
import confetti from 'canvas-confetti';

const GitHubContribute: React.FC = () => {
  const handleCheer = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    confetti({ particleCount: 50, spread: 120, decay: 0.9, scalar: 1.2, origin: { x: 0.3, y: 0.5 } });
    confetti({ particleCount: 50, spread: 120, decay: 0.9, scalar: 1.2, origin: { x: 0.7, y: 0.5 } });
  };

  return (
    <section className="github-contribute-section">
      <div className="contribute-card">
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
        <h2 className="github-message">
          Want to make a difference?
          <br />
          Contribute to <span className="highlight">Sync-Pad-AI</span>
        </h2>
        <p className="subtext">
          We appreciate every pull request, issue report, or discussion!
        </p>
        <a
          href="https://github.com/webermayank/Sync-Pad_AI"
          target="_blank"
          rel="noopener noreferrer"
          className="star-button"
        >
          ⭐ Star &amp; Contribute
        </a>
      </div>
    </section>
  );
};

export default GitHubContribute;