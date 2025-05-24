import editorImage from "../assets/editorImage.png";

const LandingFeatures: React.FC = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center flex-1 w-full max-w-5xl mx-auto px-4 py-10 gap-8">
      {/* Left: Text */}
      <div className="flex-1 text-white space-y-4 text-lg md:text-left text-center">
        <div className="font-bold text-xl md:text-2xl">
          Its a Text editor... kinda
        </div>
        <div className="font-bold text-lg">with emotional damage included.</div>
        <div>Edit your text with quick and easy navigation</div>
        <div>Blah Blah Blah...</div>
      </div>
      {/* Right: Editor image placeholder */}
      <div className="flex-1 flex items-center justify-center min-h-[250px] md:min-h-[350px]">
        <div className="w-[300px] h-[200px] md:w-[400px] md:h-[300px] bg-gray-800 border-2 border-dashed border-gray-400  text-gray-400">
          {/* Place your image here */}
          <img src= {editorImage}/>
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
