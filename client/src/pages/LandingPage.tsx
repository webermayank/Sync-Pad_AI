import LandingHero from "../components/LandingHero";
import LandingFeatures from "../components/EditorSection";
import FeatureCarousel from "../components/FeatureCarousel";

const Landing: React.FC = () => {
  return (
    <div className="landing-page">
      <LandingHero />
      <LandingFeatures />
      <FeatureCarousel />
    </div>
  );
};

export default Landing;
