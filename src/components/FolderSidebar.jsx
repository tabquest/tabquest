import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Folder, Edit2, Trash2 } from 'lucide-react';

const FolderSidebar = ({
  folders,
  selectedFolder,
  setSelectedFolder,
  setShowFolderPopup,
  setEditingFolder,
  setShowDeleteConfirm,
  bookmarks
}) => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 border-r border-white/10 p-4"
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mb-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 flex items-center gap-2"
        onClick={() => setShowFolderPopup(true)}
      >
        <Plus size={16} />
        <span>New Folder</span>
      </motion.button>

      <div className="space-y-1">
        {folders.map((folder) => (
          <motion.div
            key={folder.id}
            whileHover={{ x: 2 }}
            className={`w-full px-4 py-2 rounded-lg flex items-center justify-between group ${selectedFolder === folder.id ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
              }`}
          >
            <div
              className="flex-1 flex items-center gap-2 cursor-pointer"
              onClick={() => setSelectedFolder(folder.id)}
            >
              <Folder size={16} />
              <span>{folder.title}</span>
              <span className="text-sm text-white/50">
                ({folder.isDefault ? bookmarks.filter(b => b.starred).length : folder.count})
              </span>
            </div>
            {!folder.isDefault && (
              <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/50 hover:text-white/90"
                  onClick={() => setEditingFolder(folder)}
                >
                  <Edit2 size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/50 hover:text-red-400"
                  onClick={() => setShowDeleteConfirm({ type: 'folder', id: folder.id })}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FolderSidebar;