import { FallingText } from "../animations/FallingText";
import { useNavigate } from "react-router-dom";

const LandingHero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-hero">
      <section className="landing-hero__section">
        <FallingText text="SYNC-PAD" />
        <div className="landing-hero__subtitle">Docs. But Rude</div>

        <button
          onClick={() => navigate("/editor")}
          className="landing-hero__button"
        >
          Let's goooo
        </button>
        <div className="landing-hero__warning">
          Warning- read the below before processing
        </div>
      </section>
    </div>
  );
};

export default LandingHero;
