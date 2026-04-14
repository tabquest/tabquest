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
          className="px-4 h-12 rounded-xl backdrop-blur-md flex items-center gap-2 group shadow-lg relative cursor-pointer"
          style={{
            background: 'var(--tq-glass-bg)',
            border: '1px solid var(--tq-glass-border)',
          }}
          aria-label="Open Pro Tools"
          title="Open Pro Tools"
        >
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'var(--tq-gradient-glass)' }}
          />
          <SquareChevronRight
            className="w-5 h-5 transition-colors"
            style={{ color: 'var(--tq-text-secondary)' }}
          />
          <span
            className="text-sm transition-colors"
            style={{ color: 'var(--tq-text-secondary)' }}
          >
            Pro Tools
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 text-[18px]"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 cursor-pointer"
              style={{
                backgroundColor: 'rgba(0,0,0,.40)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
              onClick={() => setIsOpen(false)}
              title="Close Panel"
            />

            {/* Panel Container */}
            <motion.div
              className="relative w-[1200px] h-[800px] backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden"
              style={{
                background: 'var(--tq-surface-1)',
                border: '1px solid var(--tq-border-1)',
              }}
            >
              {/* Gradient Overlays */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'var(--tq-gradient-subtle)' }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'var(--tq-gradient-glass)' }}
              />

              {/* Content Container */}
              <div className="relative h-full flex flex-col">
                {/* Header */}
                <div
                  className="flex items-center justify-between p-6"
                  style={{ borderBottom: '1px solid var(--tq-border-1)' }}
                >
                  <h2
                    className="text-xl font-medium flex items-center gap-2 overflow-hidden"
                    style={{ color: 'var(--tq-text-secondary)' }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2"
                      >
                        {React.cloneElement(tabDetails[activeTab].icon, { size: 24 })}
                        <span className="text-xl">{tabDetails[activeTab].title}</span>
                      </motion.div>
                    </AnimatePresence>
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="transition-colors cursor-pointer"
                    style={{ color: 'var(--tq-text-muted)' }}
                    title="Close"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content Area */}
                <div
                  className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:w-[5px] rounded-[4px]"
                  style={{
                    '--scrollbar-track': 'var(--tq-scrollbar-track)',
                    '--scrollbar-thumb': 'var(--tq-scrollbar-thumb)',
                  }}
                >
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
                <div
                  className="p-4"
                  style={{ borderTop: '1px solid var(--tq-border-1)' }}
                >
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
  <motion.button
    whileHover={{ scale: 1.05, background: isActive ? 'var(--tq-surface-elevated)' : 'var(--tq-surface-2)' }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
    style={{
      color: isActive ? 'var(--tq-text-primary)' : 'var(--tq-text-muted)',
      background: isActive ? 'var(--tq-surface-elevated)' : 'transparent',
    }}
    title={`Switch to ${label}`}
  >
    {React.cloneElement(icon, { size: 22 })}
    <span className="text-base font-medium">{label}</span>
  </motion.button>
);

export default ToolsPanel;
