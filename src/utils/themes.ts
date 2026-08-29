/* ─────────────────────────────────────────────────────────────────────────────
   TabQuest v2  •  "Void" — Single Dark Theme
   ─────────────────────────────────────────────────────────────────────────────
   One theme. Pure black. Glass so thin it's almost not there.
   Every surface is depth-from-darkness, not depth-from-colour.
   ──────────────────────────────────────────────────────────────────────────── */

export type ThemeMode = 'dark' | 'light' | 'system'; // kept only for localStorage migration

interface ThemeTokens {
  [key: string]: string;
}

export interface Theme {
  key: 'dark';
  label: string;
  tokens: ThemeTokens;
}

const darkTheme: Theme = {
  key: 'dark',
  label: 'Dark',
  tokens: {
    /* ── Accent ─────────────────────────────────────────────────── */
    '--tq-accent': '#10b981',
    '--tq-accent-rgb': '16,185,129',
    '--tq-accent-glow': 'rgba(16,185,129,.22)',
    '--tq-accent-secondary': '#6366f1',
    '--tq-accent-sec-rgb': '99,102,241',

    /* ── Glass surfaces — paper-thin, almost invisible ─────────── */
    '--tq-glass-bg': 'rgba(255,255,255,.04)',
    '--tq-glass-border': 'rgba(255,255,255,.07)',
    '--tq-glass-sheen':
      'inset 0 1px 0 rgba(255,255,255,.08), 0 24px 64px rgba(0,0,0,.8)',

    /* ── Surface hierarchy ──────────────────────────────────────── */
    '--tq-surface-1': 'rgba(255,255,255,.06)',
    '--tq-surface-2': 'rgba(255,255,255,.04)',
    '--tq-surface-3': 'rgba(255,255,255,.025)',
    '--tq-surface-elevated': 'rgba(255,255,255,.08)',
    '--tq-surface-overlay': 'rgba(4,4,10,.97)',

    /* ── Borders ────────────────────────────────────────────────── */
    '--tq-border-1': 'rgba(255,255,255,.07)',
    '--tq-border-2': 'rgba(255,255,255,.13)',

    /* ── Text — white spectrum ──────────────────────────────────── */
    '--tq-text-primary': 'rgba(255,255,255,.95)',
    '--tq-text-secondary': 'rgba(255,255,255,.55)',
    '--tq-text-muted': 'rgba(255,255,255,.28)',

    /* ── Search ─────────────────────────────────────────────────── */
    '--tq-search-bg': 'rgba(255,255,255,.05)',
    '--tq-search-border': 'rgba(255,255,255,.09)',
    '--tq-search-accent': '#10b981',

    /* ── Progress ───────────────────────────────────────────────── */
    '--tq-progress-year': '#6366f1',
    '--tq-progress-day': '#10b981',

    /* ── Interaction ────────────────────────────────────────────── */
    '--tq-hover-bg': 'rgba(255,255,255,.055)',

    /* ── Scrollbar ──────────────────────────────────────────────── */
    '--tq-scrollbar-track': 'transparent',
    '--tq-scrollbar-thumb': 'rgba(255,255,255,.09)',

    /* ── Semantic ───────────────────────────────────────────────── */
    '--tq-success': '#10b981',
    '--tq-danger': '#ef4444',
    '--tq-warning': '#f59e0b',
  },
};

/* ─── Public API ─────────────────────────────────────────────────────────────── */

export const THEMES = { dark: darkTheme };

/** All legacy v1 keys and 'light'/'system' → 'dark'. */
export const migrateThemeKey = (_key: string): ThemeMode => 'dark';

/** Always resolves to 'dark'. Kept for call-site compatibility. */
export const resolveMode = (
  _mode: ThemeMode,
  _systemPrefersDark: boolean,
): 'dark' => 'dark';

export const getThemeTokens = (): ThemeTokens => darkTheme.tokens;
export const getTheme = (): Theme => darkTheme;

/** @deprecated Use migrateThemeKey */
export const resolveThemeKey = migrateThemeKey;
