import { motion } from "framer-motion";

type FallingTextProps = {
  text: string;
};

export const FallingText: React.FC<FallingTextProps> = ({ text }) => {
  return (
      <div className="flex justify-center items-center space-x-2">
        {text.split("").map((char, index) => (
          <motion.div
            key={index}
            initial={{ y: -200, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 120,
              damping: 10,
            }}
            className="text-[100px] font-['Hachi_Maru_Pop'] text-indigo-600"
          >
            {char}
          </motion.div>
        ))}
      </div>
  );
};
