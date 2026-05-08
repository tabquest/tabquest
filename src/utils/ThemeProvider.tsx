import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getThemeTokens, resolveThemeKey, getTheme } from './themes';
import type { RootState } from './redux/store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const selectedTheme =
    useSelector((state: RootState) => state.settings.theme) ||
    'midnight_default';
  const resolvedKey = useMemo(
    () => resolveThemeKey(selectedTheme),
    [selectedTheme],
  );
  const tokens = useMemo(() => getThemeTokens(resolvedKey), [resolvedKey]);
  const theme = useMemo(() => getTheme(resolvedKey), [resolvedKey]);

  useEffect(() => {
    const root = document.querySelector('.tabquest-app');
    if (!root) return;

    Object.entries(tokens).forEach(([prop, value]) => {
      (root as HTMLElement).style.setProperty(prop, value);
    });

    (root as HTMLElement).setAttribute('data-theme', resolvedKey);
  }, [tokens, resolvedKey]);

  return (
    <div
      data-theme={resolvedKey}
      className={`tabquest-app bg-gradient-to-b ${theme.bgGradient} text-white min-h-screen h-screen flex flex-col p-4 md:p-6 overflow-hidden relative`}
      style={Object.entries(tokens).reduce(
        (acc, [prop, value]) => {
          acc[prop] = value;
          return acc;
        },
        {} as Record<string, string>,
      )}
    >
      {children}
    </div>
  );
};

export default ThemeProvider;
