import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Chrome API for development
const mockChromeAPI = {
  runtime: {
    getManifest: () => ({
      version: '1.0.0'
    })
  }
};

const isExtensionEnvironment = () => {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest;
};

const chromeAPI = isExtensionEnvironment() ? chrome : mockChromeAPI;

const VersionChecker = () => {
  const [currentVersion, setCurrentVersion] = useState('');
  const [latestVersion, setLatestVersion] = useState('');
  const [updateUrl, setUpdateUrl] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isDev] = useState(!isExtensionEnvironment());

  const CHECK_INTERVAL = 8 * 60 * 60 * 1000; // 8 hours

  const getCurrentVersion = () => {
    const manifest = chromeAPI.runtime.getManifest();
    setCurrentVersion(manifest.version);
  };

  const checkForUpdates = async () => {
    try {
      const response = await fetch('https://halithsmh-updatechecker.web.val.run');
      const data = await response.json();
      
      setLatestVersion(data.version);
      setUpdateUrl(data.updateUrl);

      if (data.version !== currentVersion) {
        setShowNotification(true);
      }

      localStorage.setItem('lastUpdateCheck', Date.now().toString());
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  useEffect(() => {
    getCurrentVersion();

    const lastCheck = localStorage.getItem('lastUpdateCheck');
    const now = Date.now();

    if (!lastCheck || (now - Number(lastCheck)) > CHECK_INTERVAL) {
      checkForUpdates();
    }
  }, []);

  return (
    <div className="fixed top-0 right-0 z-50 p-4">
      {isDev && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="-mt-2 px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-md text-sm backdrop-blur-sm"
        >
          Development Mode
        </motion.div>
      )}
      
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="relative w-80"
          >
            <div className="relative overflow-hidden rounded-xl bg-[#1a1b23]/80 backdrop-blur-md border border-gray-800/50 p-4 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
              <div className="relative flex items-start gap-3">
                <Bell className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">
                    Update Available!
                  </h3>
                  <p className="text-gray-300 text-sm">
                    A new version ({latestVersion}) is available. Your current version is {currentVersion}.
                  </p>
                  <motion.a 
                    href={updateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-3 w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors duration-200 text-center block"
                  >
                    Update now
                  </motion.a>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotification(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VersionChecker;