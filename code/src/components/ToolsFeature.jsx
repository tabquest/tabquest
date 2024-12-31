import React, { useState } from 'react';
import { Bookmark, ListTodo, Code, X, Search, Plus, Tag, Edit2, PanelTopClose } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ToolsFeature = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('bookmarks');

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50">
      {/* Tools Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/50 transition-all"
      >
        {/* <Tool className="text-emerald-400 group-hover:text-emerald-300" size={24} /> */}
        <PanelTopClose className="text-emerald-400 group-hover:text-emerald-300" size={24}/>
      </motion.button>

      {/* Tools Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-24 top-1/2 -translate-y-1/2 w-96 h-[80vh] bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-medium text-slate-200">Developer Tools</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4"
                  >
                    {activeTab === 'bookmarks' && <BookmarksTab />}
                    {activeTab === 'todos' && <TodosTab />}
                    {activeTab === 'notes' && <NotesTab />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="p-2 border-t border-slate-700/50 bg-slate-800/50">
                <nav className="flex justify-around">
                  <TabButton
                    icon={<Bookmark size={20} />}
                    label="Bookmarks"
                    isActive={activeTab === 'bookmarks'}
                    onClick={() => setActiveTab('bookmarks')}
                  />
                  <TabButton
                    icon={<ListTodo size={20} />}
                    label="Tasks"
                    isActive={activeTab === 'todos'}
                    onClick={() => setActiveTab('todos')}
                  />
                  <TabButton
                    icon={<Code size={20} />}
                    label="Notes"
                    isActive={activeTab === 'notes'}
                    onClick={() => setActiveTab('notes')}
                  />
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TabButton = ({ icon, label, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
      isActive ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-400 hover:text-slate-200'
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </motion.button>
);

const BookmarksTab = () => (
  <div className="space-y-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="text"
        placeholder="Search bookmarks..."
        className="w-full bg-slate-700/30 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50"
      />
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-slate-300">Development</h3>
        <button className="text-emerald-400 hover:text-emerald-300">
          <Plus size={18} />
        </button>
      </div>
      <BookmarkItem
        title="GitHub"
        url="github.com"
        tags={['dev', 'code']}
      />
      <BookmarkItem
        title="Documentation"
        url="docs.example.com"
        tags={['reference']}
      />
    </div>
  </div>
);

const BookmarkItem = ({ title, url, tags }) => (
  <motion.div
    whileHover={{ x: 4 }}
    className="group p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
  >
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-slate-200 font-medium">{title}</h4>
        <p className="text-sm text-slate-400">{url}</p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-200">
        <Edit2 size={16} />
      </button>
    </div>
    <div className="flex gap-2 mt-2">
      {tags.map(tag => (
        <span
          key={tag}
          className="px-2 py-1 text-xs rounded-full bg-emerald-400/10 text-emerald-400"
        >
          {tag}
        </span>
      ))}
    </div>
  </motion.div>
);

const TodosTab = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-slate-200 font-medium">Tasks</h3>
      <button className="text-emerald-400 hover:text-emerald-300">
        <Plus size={18} />
      </button>
    </div>
    <TodoItem
      title="Implement search functionality"
      tags={['frontend', 'priority']}
      completed={false}
    />
    <TodoItem
      title="Write documentation"
      tags={['docs']}
      completed={true}
    />
  </div>
);

const TodoItem = ({ title, tags, completed }) => (
  <motion.div
    whileHover={{ x: 4 }}
    className={`p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors ${
      completed ? 'opacity-50' : ''
    }`}
  >
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={completed}
        className="mt-1 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
      />
      <div className="flex-1">
        <p className={`text-slate-200 ${completed ? 'line-through' : ''}`}>{title}</p>
        <div className="flex gap-2 mt-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-emerald-400/10 text-emerald-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const NotesTab = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-slate-200 font-medium">Code Snippets</h3>
      <button className="text-emerald-400 hover:text-emerald-300">
        <Plus size={18} />
      </button>
    </div>
    <NoteItem
      title="React Hook Example"
      language="JavaScript"
      tags={['react', 'hooks']}
    />
    <NoteItem
      title="API Integration"
      language="TypeScript"
      tags={['api', 'fetch']}
    />
  </div>
);

const NoteItem = ({ title, language, tags }) => (
  <motion.div
    whileHover={{ x: 4 }}
    className="p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
  >
    <div className="flex justify-between items-start">
      <div>
        <h4 className="text-slate-200 font-medium">{title}</h4>
        <p className="text-sm text-slate-400">{language}</p>
      </div>
      <button className="text-slate-400 hover:text-slate-200">
        <Edit2 size={16} />
      </button>
    </div>
    <div className="flex gap-2 mt-2">
      {tags.map(tag => (
        <span
          key={tag}
          className="px-2 py-1 text-xs rounded-full bg-emerald-400/10 text-emerald-400"
        >
          {tag}
        </span>
      ))}
    </div>
  </motion.div>
);

export default ToolsFeature;