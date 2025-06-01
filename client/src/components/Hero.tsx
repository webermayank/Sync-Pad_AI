import React from "react";

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => (
  <section className="hero">
    <h1 className="hero__title">SyncPad AI</h1>
    <p className="hero__subtitle">
      Your intelligent, collaborative text editor powered by AI. Summarize,
      enhance, and explain your notes with a click!
    </p>
    <button onClick={onStart} className="btn btn-primary">
      Let&apos;s go to editor
    </button>
  </section>
);

export default Hero;
