import LandingHero from "../components/LandingHero";
import LandingFeatures from "../components/EditorSection";
import FeatureCarousel from "../components/FeatureCarousel";
import ContributeSection from "../components/ContributeSection";
import Footer from "../components/Footer";
import WorkflowSection from "../components/WorkflowSection";
import FeatureCards from "../components/FeatureSection";
const Landing: React.FC = () => {
  return (
    <div className="landing-page">
      <LandingHero />
      <LandingFeatures />
      <FeatureCarousel />
      <WorkflowSection />
      <FeatureCards />
      
      {/* Contribute Section */}
      <ContributeSection/>
      
      <Footer />
    </div>
  );
};

export default Landing;
