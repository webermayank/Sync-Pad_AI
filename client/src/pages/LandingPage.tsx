import LandingHero from "../components/LandingHero";
import LandingFeatures from "../components/LandingFeatures";

const Landing: React.FC = () => {
  return (
    <div className="landing-page">
      <LandingHero />
      <LandingFeatures />
    </div>
  );
};

export default Landing;
