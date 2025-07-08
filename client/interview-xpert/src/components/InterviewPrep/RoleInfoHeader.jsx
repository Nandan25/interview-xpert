import React from "react";

const RoleInfoHeader = ({
  role,
  focusTopics,
  experience,
  questions,
  lastUpdated,
}) => {
  return (
    <div className="relative bg-white px-6 md:px-10 py-10 overflow-hidden rounded-xl shadow-sm">
      {/* Animated blobs background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[-50px] right-[100px] w-40 h-40 bg-lime-400 blur-[80px] opacity-30 animate-blob1"></div>
        <div className="absolute top-[20px] right-[10px] w-40 h-40 bg-cyan-300 blur-[80px] opacity-30 animate-blob2"></div>
        <div className="absolute bottom-[-30px] right-[120px] w-40 h-40 bg-fuchsia-200 blur-[80px] opacity-30 animate-blob3"></div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{role}</h1>

        {focusTopics && (
          <p className="mt-2 text-sm md:text-base text-gray-600 font-medium">
            {focusTopics}
          </p>
        )}

        <div className="flex flex-wrap gap-3 mt-5">
          <span className="text-xs font-medium text-white bg-gray-900 px-4 py-1.5 rounded-full">
            Experience: {experience} {experience == 1 ? "Year" : "Years"}
          </span>
          <span className="text-xs font-medium text-white bg-gray-900 px-4 py-1.5 rounded-full">
            {questions} Q&A
          </span>
          <span className="text-xs font-medium text-white bg-gray-900 px-4 py-1.5 rounded-full">
            Last Updated: {lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;
