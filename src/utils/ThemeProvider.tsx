import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getThemeTokens, resolveThemeKey, getTheme } from './themes';
import type { RootState } from './redux/store';
import type { BackgroundConfig } from '../types/domain';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const selectedTheme =
    useSelector((state: RootState) => state.settings.theme) ||
    'midnight_default';
  const background = useSelector(
    (state: RootState) => state.settings.background,
  ) as BackgroundConfig | undefined;
  const resolvedKey = useMemo(
    () => resolveThemeKey(selectedTheme),
    [selectedTheme],
  );
  const tokens = useMemo(() => getThemeTokens(resolvedKey), [resolvedKey]);
  const theme = useMemo(() => getTheme(resolvedKey), [resolvedKey]);

  const bgStyle = useMemo((): React.CSSProperties => {
    return {}; // gradient type removed; image handled by overlay divs below
  }, []);

  const isCustomBackground = background && background.type !== 'theme';

  useEffect(() => {
    const root = document.querySelector('.tabquest-app');
    if (!root) return;

    Object.entries(tokens).forEach(([prop, value]) => {
      (root as HTMLElement).style.setProperty(prop, value);
    });

    (root as HTMLElement).setAttribute('data-theme', resolvedKey);
  }, [tokens, resolvedKey]);

  const tokenStyle = Object.entries(tokens).reduce(
    (acc, [prop, value]) => {
      acc[prop] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div
      data-theme={resolvedKey}
      className={`tabquest-app ${isCustomBackground ? '' : `bg-gradient-to-b ${theme.bgGradient}`} text-white min-h-screen h-screen flex flex-col p-4 md:p-6 overflow-hidden relative`}
      style={{ ...tokenStyle, ...bgStyle }}
    >
      {background?.type === 'image' && background.imageUrl && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${background.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: background.blur ? `blur(${background.blur}px)` : undefined,
          }}
        />
      )}
      {background?.type === 'image' && (
        <div
          className="absolute inset-0 z-0 pointer-events-none bg-black"
          style={{ opacity: background.overlayOpacity ?? 0.4 }}
        />
      )}
      {children}
    </div>
  );
};

export default ThemeProvider;
