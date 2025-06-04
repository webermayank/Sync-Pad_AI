import LandingHero from "../components/LandingHero";
import LandingFeatures from "../components/EditorSection";

const Landing: React.FC = () => {
  return (
    <div className="landing-page">
      <LandingHero />
      <LandingFeatures />
    </div>
  );
};

export default Landing;
