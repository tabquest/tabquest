import React from 'react';
import Clock from './components/Clock';
import SocialPopover from './components/SocialPopover';
import ProgressBars from './components/ProgressBars';
import SearchBar from './components/SearchBar';
import BookmarkBar from './components/BookmarkBar';
import SettingsPanel from './components/SettingsPanel';
import ToolsPanel from './components/ToolsPanel';

import { LiveUsersTracker, MobileView, VersionChecker } from './features';

import { Provider } from 'react-redux';
import { store } from './utils/redux/store';
import { motion } from 'framer-motion';

function App() {
  // Check if the user is on a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    return <MobileView />;  // Only display mobile warning
  }

  return (
    <Provider store={store}>
      {/* LiveUsersTracker - GoogleAnalytics */}
      <LiveUsersTracker />

      {/* Version Check */}
      <VersionChecker />
      <div className="bg-gradient-to-b from-gray-800 via-gray-900 to-gray-950 text-white min-h-screen flex flex-col p-6 md:p-8">
        {/* <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen flex flex-col p-6 md:p-8"> */}
        {/* <div className="bg-gradient-to-br from-[#090d15] via-[#101725] to-[#090d15] text-white min-h-screen flex flex-col p-6 md:p-8"> */}

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
