import {
  Bookmark,
  ListTodo,
  Code,
  X,
  PenTool,
  SquareChevronRight,
} from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookmarkComponent from "./BookmarkComponent";
import TaskComponent from "./TaskComponent ";

const ToolsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("bookmarks");

  return (
    <div>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed left-6 bottom-6 w-12 h-12 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center group shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <SquareChevronRight className="w-5 h-5 text-white/70 group-hover:text-white/90 transition-colors" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel Container */}
            <motion.div
              className="relative w-[800px] h-[600px] bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-blue-500/5 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />

              {/* Content Container */}
              <div className="relative h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-lg font-medium text-white/80">
                    Professional Tools
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/50 hover:text-white/80 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-white/10 rounded-[4px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeTab === "bookmarks" && <BookmarkComponent />}
                      {activeTab === "todos" && <TaskComponent />}
                      {activeTab === "notes" && <NotesComponent />}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer Navigation */}
                <div className="border-t border-white/10 p-4">
                  <div className="flex justify-center space-x-8">
                    <TabButton
                      icon={<Bookmark size={20} />}
                      isActive={activeTab === "bookmarks"}
                      onClick={() => setActiveTab("bookmarks")}
                      label="Bookmarks"
                    />
                    <TabButton
                      icon={<ListTodo size={20} />}
                      isActive={activeTab === "todos"}
                      onClick={() => setActiveTab("todos")}
                      label="Tasks"
                    />
                    <TabButton
                      icon={<Code size={20} />}
                      isActive={activeTab === "notes"}
                      onClick={() => setActiveTab("notes")}
                      label="Notes"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TabButton = ({ icon, isActive, onClick, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? "text-white bg-white/10"
        : "text-white/50 hover:text-white/80"
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

// const TaskComponent = () => (
//   <div className="text-white/80"></div>
// );

const NotesComponent = () => (
  <div className="text-white/80">This is the Notes tab content.</div>
);

export default ToolsPanel;
