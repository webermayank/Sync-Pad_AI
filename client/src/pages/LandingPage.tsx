import LandingHero from "../components/LandingHero";
import LandingFeatures from "../components/LandingFeatures";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-blackBackground w-full bg-gray-900 flex flex-col">
      <LandingHero />
      <LandingFeatures />
    </div>
  );
};

export default Landing;
