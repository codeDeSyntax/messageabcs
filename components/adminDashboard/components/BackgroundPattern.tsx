import React from "react";

export const BackgroundPattern: React.FC = () => {
  return (
    <>
      {/* Islamic Geometric Pattern Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="islamicPattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <circle
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <path
                d="M50,20 L50,80 M20,50 L80,50 M35,35 L65,65 M65,35 L35,65"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <circle cx="50" cy="50" r="3" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamicPattern)" />
        </svg>
      </div>

      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-amber-100/10 pointer-events-none"></div>
    </>
  );
};
