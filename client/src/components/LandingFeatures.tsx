import editorImage from "../assets/editorImage.png";

const LandingFeatures: React.FC = () => {
  return (
    <section className="landing-features">
      {/* Left: Text */}
      <div className="landing-features__text">
        <div className="landing-features__title">
          Its a Text editor... kinda
        </div>
        <div className="landing-features__subtitle">
          with emotional damage included.
        </div>
        <div>Edit your text with quick and easy navigation</div>
        <div>Blah Blah Blah...</div>
      </div>
      {/* Right: Editor image placeholder */}
      <div className="landing-features__image-container">
        <div className="landing-features__image">
          <img src={editorImage} alt="Editor Preview" />
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
