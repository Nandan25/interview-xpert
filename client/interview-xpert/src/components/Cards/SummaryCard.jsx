import React from "react";

const SummaryCard = ({
  onSelect,
  colors,
  role,
  focusTopics,
  onDelete,
  experience,
  questions,
  description,
  lastUpdated,
}) => {
  return (
    <>
      <div
        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative group cursor-pointer"
        onClick={onSelect}
      >
        {/* Top Section: Role and Delete */}
        <div
          className="rounded-lg p-4 mb-4"
          style={{ background: colors.bgcolor }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center text-lg font-bold text-gray-800 shadow-sm">
                GU
              </div> */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{role}</h2>
                <p className="text-sm text-gray-600">{focusTopics}</p>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="hidden group-hover:flex text-sm text-red-500 font-medium hover:underline cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-gray-100 text-[12px] text-gray-800 px-3 py-1 rounded-full font-medium">
            Experience: {experience} {experience === 1 ? "Year" : "Years"}
          </span>
          {/* <span className="bg-gray-100 text-[12px] text-gray-800 px-3 py-1 rounded-full font-medium">
            {questions} Q&A
          </span> */}
          <span className="bg-gray-100 text-[12px] text-gray-800 px-3 py-1 rounded-full font-medium">
            Updated: {lastUpdated}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </>
  );
};

export default SummaryCard;
