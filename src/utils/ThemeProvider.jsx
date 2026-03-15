import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getThemeTokens, resolveThemeKey, getTheme } from './themes';

/**
 * ThemeProvider
 * ─────────────
 * Reads the current theme key from Redux,
 * resolves it (handling legacy aliases),
 * and injects every token as a CSS custom-property
 * on the root `.tabquest-app` container.
 *
 * All components use  var(--tq-*)  and never need
 * to know which theme is currently active.
 */
const ThemeProvider = ({ children }) => {
  const selectedTheme = useSelector((state) => state.settings.theme) || 'midnight_default';
  const resolvedKey = useMemo(() => resolveThemeKey(selectedTheme), [selectedTheme]);
  const tokens = useMemo(() => getThemeTokens(resolvedKey), [resolvedKey]);
  const theme = useMemo(() => getTheme(resolvedKey), [resolvedKey]);

  // Apply CSS custom properties to the root app element
  useEffect(() => {
    const root = document.querySelector('.tabquest-app');
    if (!root) return;

    Object.entries(tokens).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });

    // Set the data-theme attribute for any remaining CSS selectors
    root.setAttribute('data-theme', resolvedKey);
  }, [tokens, resolvedKey]);

  return (
    <div
      data-theme={resolvedKey}
      className={`tabquest-app bg-gradient-to-b ${theme.bgGradient} text-white min-h-screen h-screen flex flex-col p-4 md:p-6 overflow-hidden relative`}
      style={Object.entries(tokens).reduce((acc, [prop, value]) => {
        acc[prop] = value;
        return acc;
      }, {})}
    >
      {children}
    </div>
  );
};

export default ThemeProvider;
