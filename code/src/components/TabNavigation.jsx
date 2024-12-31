// TabNavigation.jsx
import React from "react";
// import { LucideIcon } from "lucide-react";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: "Bookmarks", icon: "bookmark" },
    { name: "TaskManager", icon: "check-square" },
    { name: "NotesSnippets", icon: "edit-3" },
  ];

  return (
    <div className="flex justify-around bg-opacity-90 bg-gray-800 py-3">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            activeTab === tab.name
              ? "bg-blue-600 text-white"
              : "bg-transparent text-gray-400"
          }`}
        >
          {/* <LucideIcon name={tab.icon} size={16} /> */}
          {tab.name}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
