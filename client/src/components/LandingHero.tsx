import { FallingText } from "../animations/FallingText";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const LandingHero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-hero h-[1111px] w-[1434px]">
      <section className="landing-hero__section">
        <Navbar />
        <FallingText text="SYNC-PAD" />
        <div className="landing-hero__subtitle">
         Intelligent Docs
        </div>

        <button
          onClick={() => navigate("/editor")}
          className="landing-hero__button"
        >
          Let's goooo
        </button>
        <div className="landing-hero__warning">
          Read the below before proceeding
        </div>
      </section>
    </div>
  );
};

export default LandingHero;
