import React, { useEffect, useState } from "react";

// Custom Hook to get Chrome extension version
const useExtensionVersion = () => {
    const [version, setVersion] = useState("");

    useEffect(() => {
        // Check if chrome.runtime is available (indicating we're in a Chrome extension environment)
        if (
            typeof chrome !== "undefined" &&
            chrome.runtime &&
            chrome.runtime.getManifest
        ) {
            try {
                // In production, fetch the version from chrome.runtime.getManifest()
                const manifestVersion = chrome.runtime.getManifest().version;
                setVersion(manifestVersion);
            } catch (err) {
                console.error("Error fetching version from manifest:", err);
                setVersion("1.0.0"); // Set a mock version if there is an error
            }
        } else {
            // In development mode, return a mock version
            setVersion("1.0.0-dev"); // Set a dummy mock version for dev
        }
    }, []);

    return version;
};

export default useExtensionVersion;
