import React from 'react';
import Clock from './components/Clock';
import SocialPopover from './components/SocialPopover';
import ProgressBars from './components/ProgressBars';
import SearchBar from './components/SearchBar';
import BookmarkBar from './components/BookmarkBar';
import SettingsPanel from './components/SettingsPanel';

import { Provider } from 'react-redux';
import { store } from './utils/redux/store';
import { motion } from 'framer-motion';
import FeathersTab from './components/ToolsPanel';
import ToolsPanel from './components/ToolsPanel';
// import PopupContainer from './components/PopUpContainer';
// import ToolsFeature from './components/ToolsFeature';
// import MainLayout from './components/MainLayout';

function App() {
  return (
    <Provider store={store}>
      <div className="bg-gradient-to-b from-gray-800 via-gray-900 to-gray-950 text-white min-h-screen flex flex-col p-6 md:p-8">
        {/* Header Section */}
        <div className="flex mt-4 justify-between"> {/* Reduced margin-top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=""
          >
            <Clock />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className=""
          >
            <SocialPopover />
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          className="space-y-8 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <ProgressBars />
          <SearchBar />
          <BookmarkBar />
        </motion.div>


        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-4"
        >
          <SettingsPanel />
          <ToolsPanel />
        </motion.div>
      </div>
    </Provider>
  );
}

export default App;
