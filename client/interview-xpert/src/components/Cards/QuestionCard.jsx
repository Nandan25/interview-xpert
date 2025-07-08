import React, { useState, useRef, useEffect } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from "../InterviewPrep/AIResponsePreview";

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      setContentHeight(contentRef.current.scrollHeight + 10); // Add a little padding
    } else {
      setContentHeight(0);
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg mb-4 overflow-hidden py-4 px-5 shadow-xl shadow-gray-100/70 border border-gray-100/60 group">
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={toggleExpand}
      >
        <h3 className="text-md text-gray-800 font-medium md:text-[14px]">
          {question}
        </h3>
        <div className="flex items-center justify-end ml-4 relative">
          <button
            className="flex items-center gap-2 text-xs text-indigo-800 font-medium bg-indigo-50 px-3 py-1 mr-2 rounded-nowrap border border-indigo-50 hover:border-indigo-200 cursor-pointer md:hidden group-hover:flex"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card expansion
              onTogglePin();
            }}
          >
            {isPinned ? (
              <LuPinOff className="text-xs" />
            ) : (
              <LuPin className="text-xs" />
            )}
          </button>
          <button
            className="flex items-center gap-2 text-xs text-cyan-800 font-medium bg-cyan-50 px-3 py-1 mr-2 rounded-nowrap border border-cyan-50 hover:border-cyan-200 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card expansion
              setIsExpanded(true); // Ensure it's expanded to see the answer
              onLearnMore();
            }}
          >
            <LuSparkles />
            <span className="hidden md:block">View Explanation</span>
          </button>
          <button
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
          >
            <LuChevronDown
              size={20}
              className={`transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: contentHeight + "px" }}
      >
        <div
          ref={contentRef}
          className="mt-4 text-gray-700 bg-gray-50 px-5 py-3 rounded-lg"
        >
          <AIResponsePreview content={answer} />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
