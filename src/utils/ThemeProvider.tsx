import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { THEMES } from './themes';
import type { RootState } from './redux/store';
import type { BackgroundConfig } from '../types/domain';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const theme = THEMES.dark;
const tokens = theme.tokens;

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const background = useSelector(
    (state: RootState) => state.settings.background,
  ) as BackgroundConfig | undefined;

  /* Inject CSS variables once — single dark theme, never changes */
  useEffect(() => {
    const root = document.querySelector('.tabquest-app');
    if (!root) return;
    Object.entries(tokens).forEach(([prop, value]) => {
      (root as HTMLElement).style.setProperty(prop, value);
      document.documentElement.style.setProperty(prop, value);
    });
    (root as HTMLElement).setAttribute('data-theme', 'dark');
  }, []);

  const tokenStyle = useMemo(
    () =>
      Object.entries(tokens).reduce(
        (acc, [prop, value]) => {
          acc[prop] = value;
          return acc;
        },
        {} as Record<string, string>,
      ),
    [],
  );

  const isCustomBackground = background && background.type !== 'theme';

  return (
    <div
      data-theme="dark"
      className={`tabquest-app text-white tq-shell relative ${isCustomBackground ? '' : 'tq-bg-void'}`}
      style={tokenStyle}
    >
      {/* Custom background image */}
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

      {/* Dark overlay for legibility over custom images */}
      {background?.type === 'image' && (
        <div
          className="absolute inset-0 z-0 pointer-events-none bg-black"
          style={{ opacity: background.overlayOpacity ?? 0.45 }}
        />
      )}

      {children}
    </div>
  );
};

export default ThemeProvider;
