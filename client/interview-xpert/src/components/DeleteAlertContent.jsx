import React from "react";
import { IoWarningOutline } from "react-icons/io5";

const DeleteAlertContent = ({ content, onDelete, onCancel }) => {
  return (
    <div className="p-6">
      {/* Warning icon and text */}
      <div className="flex items-start gap-3">
        <IoWarningOutline className="text-3xl text-orange-500 mt-1" />
        <p className="text-[15px] text-gray-700">{content}</p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 text-gray-700 transition"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm rounded-md bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold hover:opacity-90 transition"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlertContent;
