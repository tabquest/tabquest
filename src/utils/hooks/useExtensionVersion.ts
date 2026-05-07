import { useEffect, useState } from 'react';

const useExtensionVersion = (): string => {
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    if (
      typeof chrome !== 'undefined' &&
      chrome.runtime &&
      chrome.runtime.getManifest
    ) {
      try {
        const manifestVersion = chrome.runtime.getManifest().version;
        setVersion(manifestVersion);
      } catch (err) {
        console.error('Error fetching version from manifest:', err);
        setVersion('1.0.0');
      }
    } else {
      setVersion('1.0.0-dev');
    }
  }, []);

  return version;
};

export default useExtensionVersion;
