import LandingHero from "../components/LandingHero";
import LandingFeatures from "../components/EditorSection";
import FeatureCarousel from "../components/FeatureCarousel";
import ContributeSection from "../components/ContributeSection";
import Footer from "../components/Footer";

const Landing: React.FC = () => {
  return (
    <div className="landing-page">
      <LandingHero />
      <LandingFeatures />
      <FeatureCarousel />
      <ContributeSection/>
      <Footer />
    </div>
  );
};

export default Landing;
