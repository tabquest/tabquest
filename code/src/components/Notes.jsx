import React from "react";

const Notes = () => {
  return (
    <div>
      <h2 className="text-lg font-bold">Notes</h2>
      <textarea
        rows="4"
        placeholder="Write your notes here..."
        className="w-full mt-4 p-2 bg-gray-700 rounded-lg"
      ></textarea>
    </div>
  );
};

export default Notes;
