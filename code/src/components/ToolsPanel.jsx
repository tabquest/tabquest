import {
  Bookmark,
  ListTodo,
  Code,
  X,
  PenTool,
  SquareChevronRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookmarkComponent from "./BookmarkComponent";
import TaskComponent from "./TaskComponent";
import NotesComponent from "./NotesComponent";

const tabDetails = {
  bookmarks: { title: "Bookmarks", icon: <Bookmark size={20} /> },
  todos: { title: "Task Manager", icon: <ListTodo size={20} /> },
  notes: { title: "Notes", icon: <Code size={20} /> }
};

const ToolsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("bookmarks");


  // Handle escape key to close panel
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  return (
    <div>
      {/* Floating Button */}
      <div className="fixed left-6 bottom-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="px-4 h-12 rounded-xl bg-black/20 backdrop-blur-md flex items-center gap-2 group shadow-lg relative"
          aria-label="Open Pro Tools"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <SquareChevronRight className="w-5 h-5 text-white/70 group-hover:text-white/90 transition-colors" />
          <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">Pro Tools</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            // initial={{ opacity: 0, scale: 0.95 }}
            // animate={{ opacity: 1, scale: 1 }}
            // exit={{ opacity: 0, scale: 0.95 }}
            // // transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 text-[18px]"
          >
            {/* Backdrop */}
            <motion.div
              // initial={{ opacity: 0, scale: 0 }}
              // animate={{ opacity: 1, scale: 1 }}
              // exit={{ opacity: 0, scale: 0 }}
              // transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel Container */}
            <motion.div
              className="relative w-[1200px] h-[800px] bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-blue-500/5 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />

              {/* Content Container */}
              <div className="relative h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-xl font-medium text-white/80 flex items-center gap-2 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          duration: 0.3,
                        }}
                        className="flex items-center gap-2"
                      >
                        {React.cloneElement(tabDetails[activeTab].icon, { size: 24 })}
                        <span className="text-xl">{tabDetails[activeTab].title}</span>
                      </motion.div>
                    </AnimatePresence>
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/50 hover:text-white/80 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-white/10 rounded-[4px]">
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
                    {Object.keys(tabDetails).map((tab) => (
                      <TabButton
                        key={tab}
                        icon={tabDetails[tab].icon}
                        isActive={activeTab === tab}
                        onClick={() => setActiveTab(tab)}
                        label={tabDetails[tab].title}
                      />
                    ))}
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
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive
      ? "text-white bg-white/10"
      : "text-white/50 hover:text-white/80"
      }`}
  >
    {React.cloneElement(icon, { size: 22 })}
    <span className="text-base">{label}</span>
  </button>
);

export default ToolsPanel;
