import React from "react";

const DotCircleSpinner = () => {
  const dots = Array.from({ length: 8 });

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="relative w-20 h-20">
        {dots.map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-blue-600 rounded-full opacity-30 animate-dot"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 45}deg) translate(36px)`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DotCircleSpinner;
