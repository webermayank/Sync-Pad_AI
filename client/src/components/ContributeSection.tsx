import React from 'react';
import '../styles/ContributeSection.css'; // make sure to create and include this CSS file
import angryGit from '../assets/Angry Oh Brother Sticker by GitHub.gif';
import loveGit from '../assets/In Love Hearts Sticker by GitHub.gif';

const GitHubContribute: React.FC = () => {
  return (
    <section className="github-contribute-section">
      <div className="gif-wrapper">
        <img
          src={angryGit}
          alt="Angry GitHub"
          className="github-gif"
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
