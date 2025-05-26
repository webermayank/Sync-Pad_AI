import { FallingText } from "../animations/FallingText";
import { useNavigate } from "react-router-dom";

const LandingHero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-black p-4 flex flex-col items-center justify-center min-h-screen">
      <section className="flex flex-col items-center  justify-center gap-4 pt-10 pb-8">
        <FallingText text="SYNC-PAD" />
        <div className="text-2xl text-white font-hachi mb-2">
          Docs. But Rude
        </div>
        
        <button
          onClick={() => navigate("/editor")}
          className="px-6 py-2 bg-gray-100 text-gray-900 rounded-full font-bold shadow hover:bg-gray-200 bg-blue-500 transition mb-2"
        >
          Let's goooo
        </button>
        <div className="text-red-400 text-sm font-semibold">
          Warning- read the below before processing
        </div>
      </section>
    </div>
  );
};

export default LandingHero;
