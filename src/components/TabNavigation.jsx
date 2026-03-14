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
    <div className="flex justify-around bg-opacity-90 tq-surface-1 py-3">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            activeTab === tab.name
              ? "tq-surface-elevated tq-accent tq-text-primary"
              : "bg-transparent tq-text-muted hover:tq-text-primary"
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
