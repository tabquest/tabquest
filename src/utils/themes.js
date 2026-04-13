/**
 * TabQuest Theme System — Single Source of Truth
 * -----------------------------------------------
 * Every visual token lives here.  Components reference
 * CSS custom-properties set by ThemeProvider so they
 * never need to know which theme is active.
 */

// ─── Theme Definitions ──────────────────────────────────────────────

export const THEMES = {
  /* ── 1. Midnight Default (kept & enhanced) ───────────────────── */
  midnight_default: {
    key: 'midnight_default',
    label: 'Midnight',
    isDefault: true,
    bgGradient: 'from-gray-900 via-slate-900 to-black',
    preview: ['#0f172a', '#020617', '#000000'],
    tokens: {
      '--tq-accent': '#10b981',          // emerald-500
      '--tq-accent-rgb': '16,185,129',
      '--tq-accent-glow': 'rgba(16,185,129,.35)',
      '--tq-accent-secondary': '#3b82f6',          // blue-500
      '--tq-accent-sec-rgb': '59,130,246',

      '--tq-surface-1': 'rgba(15,23,42,.15)',
      '--tq-surface-2': 'rgba(15,23,42,.10)',
      '--tq-surface-3': 'rgba(255,255,255,.03)',
      '--tq-surface-elevated': 'rgba(255,255,255,.05)',
      '--tq-surface-overlay': 'rgba(15,23,42,0.95)',

      '--tq-border-1': 'rgba(255,255,255,.08)',
      '--tq-border-2': 'rgba(255,255,255,.15)',

      '--tq-text-primary': '#ffffff',
      '--tq-text-secondary': 'rgba(255,255,255,.85)',
      '--tq-text-muted': 'rgba(255,255,255,.50)',

      '--tq-glass-bg': 'rgba(255,255,255,.06)',
      '--tq-glass-border': 'rgba(255,255,255,.12)',
      '--tq-glass-sheen': 'inset 0 1px 1px rgba(255,255,255,.15)',

      '--tq-progress-year': '#3b82f6',
      '--tq-progress-day': '#10b981',

      '--tq-search-bg': 'rgba(255,255,255,.04)',
      '--tq-search-border': 'rgba(255,255,255,.10)',
      '--tq-search-accent': '#ffffff',

      '--tq-hover-bg': 'rgba(255,255,255,.08)',

      '--tq-success': '#10b981',
      '--tq-danger': '#ef4444',
      '--tq-warning': '#f59e0b',

      '--tq-scrollbar-track': 'transparent',
      '--tq-scrollbar-thumb': 'rgba(255,255,255,.15)',

      '--tq-gradient-subtle': 'linear-gradient(135deg, rgba(16,185,129,.05), rgba(59,130,246,.05))',
      '--tq-gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 100%)',
    },
  },

  /* ── 2. Aurora Borealis ─────────────────────────────────────── */
  aurora_borealis: {
    key: 'aurora_borealis',
    label: 'Aurora Borealis',
    bgGradient: 'from-[#020617] via-[#0f172a] to-[#020617]',
    preview: ['#020617', '#0f172a', '#020617'],
    tokens: {
      '--tq-accent': '#22d3ee',          // cyan-400
      '--tq-accent-rgb': '34,211,238',
      '--tq-accent-glow': 'rgba(34,211,238,.35)',
      '--tq-accent-secondary': '#818cf8',          // indigo-400
      '--tq-accent-sec-rgb': '129,140,248',

      '--tq-surface-1': 'rgba(15,23,42,.12)',
      '--tq-surface-2': 'rgba(34,211,238,.03)',
      '--tq-surface-3': 'rgba(34,211,238,.05)',
      '--tq-surface-elevated': 'rgba(34,211,238,.08)',
      '--tq-surface-overlay': 'rgba(2,6,23,0.92)',

      '--tq-border-1': 'rgba(34,211,238,.12)',
      '--tq-border-2': 'rgba(34,211,238,.25)',

      '--tq-text-primary': '#f0f9ff',
      '--tq-text-secondary': 'rgba(239,246,255,.85)',
      '--tq-text-muted': 'rgba(186,230,253,.50)',

      '--tq-glass-bg': 'rgba(15,23,42,.08)',
      '--tq-glass-border': 'rgba(34,211,238,.15)',
      '--tq-glass-sheen': 'inset 0 1px 1px rgba(34,211,238,.20)',

      '--tq-progress-year': '#22d3ee',
      '--tq-progress-day': '#818cf8',

      '--tq-search-bg': 'rgba(34,211,238,.04)',
      '--tq-search-border': 'rgba(34,211,238,.12)',
      '--tq-search-accent': '#22d3ee',

      '--tq-hover-bg': 'rgba(34,211,238,.10)',

      '--tq-success': '#34d399',
      '--tq-danger': '#fb7185',
      '--tq-warning': '#fbbf24',

      '--tq-scrollbar-track': 'transparent',
      '--tq-scrollbar-thumb': 'rgba(34,211,238,.15)',

      '--tq-gradient-subtle': 'linear-gradient(135deg, rgba(34,211,238,.05), rgba(129,140,248,.05))',
      '--tq-gradient-glass': 'linear-gradient(135deg, rgba(34,211,238,0.1) 0%, transparent 50%, rgba(34,211,238,0.08) 100%)',
    },
  },

  /* ── 3. Cyber Neon ──────────────────────────────────────────── */
  cyber_neon: {
    key: 'cyber_neon',
    label: 'Cyber Neon',
    bgGradient: 'from-[#02010a] via-[#0a021a] to-[#02010a]',
    preview: ['#02010a', '#0a021a', '#02010a'],
    tokens: {
      '--tq-accent': '#d946ef',          // fuchsia-500
      '--tq-accent-rgb': '217,70,239',
      '--tq-accent-glow': 'rgba(217,70,239,.40)',
      '--tq-accent-secondary': '#06b6d4',          // cyan-500
      '--tq-accent-sec-rgb': '6,182,212',

      '--tq-surface-1': 'rgba(217,70,239,.03)',
      '--tq-surface-2': 'rgba(217,70,239,.05)',
      '--tq-surface-3': 'rgba(217,70,239,.08)',
      '--tq-surface-elevated': 'rgba(217,70,239,.12)',
      '--tq-surface-overlay': 'rgba(10,2,26,0.95)',

      '--tq-border-1': 'rgba(217,70,239,.15)',
      '--tq-border-2': 'rgba(217,70,239,.30)',

      '--tq-text-primary': '#fdf4ff',
      '--tq-text-secondary': 'rgba(245,208,254,.85)',
      '--tq-text-muted': 'rgba(217,170,237,.50)',

      '--tq-glass-bg': 'rgba(10,2,26,.10)',
      '--tq-glass-border': 'rgba(217,70,239,.18)',
      '--tq-glass-sheen': 'inset 0 1px 1px rgba(217,70,239,.25)',

      '--tq-progress-year': '#d946ef',
      '--tq-progress-day': '#06b6d4',

      '--tq-search-bg': 'rgba(217,70,239,.04)',
      '--tq-search-border': 'rgba(217,70,239,.15)',
      '--tq-search-accent': '#d946ef',

      '--tq-hover-bg': 'rgba(217,70,239,.12)',

      '--tq-success': '#4ade80',
      '--tq-danger': '#f87171',
      '--tq-warning': '#fbbf24',

      '--tq-scrollbar-track': 'transparent',
      '--tq-scrollbar-thumb': 'rgba(217,70,239,.20)',

      '--tq-gradient-subtle': 'linear-gradient(135deg, rgba(217,70,239,.05), rgba(6,182,212,.05))',
      '--tq-gradient-glass': 'linear-gradient(135deg, rgba(217,70,239,0.12) 0%, transparent 50%, rgba(217,70,239,0.1) 100%)',
    },
  },

  /* ── 4. Velvet Rose ─────────────────────────────────────────── */
  velvet_rose: {
    key: 'velvet_rose',
    label: 'Velvet Rose',
    bgGradient: 'from-[#0a0508] via-[#1a0a14] to-[#0a0508]',
    preview: ['#0a0508', '#1a0a14', '#0a0508'],
    tokens: {
      '--tq-accent': '#f43f5e',          // rose-500
      '--tq-accent-rgb': '244,63,94',
      '--tq-accent-glow': 'rgba(244,63,94,.35)',
      '--tq-accent-secondary': '#f59e0b',          // amber-500
      '--tq-accent-sec-rgb': '245,158,11',

      '--tq-surface-1': 'rgba(244,63,94,.03)',
      '--tq-surface-2': 'rgba(244,63,94,.05)',
      '--tq-surface-3': 'rgba(244,63,94,.08)',
      '--tq-surface-elevated': 'rgba(244,63,94,.12)',
      '--tq-surface-overlay': 'rgba(26,10,20,0.95)',

      '--tq-border-1': 'rgba(244,63,94,.15)',
      '--tq-border-2': 'rgba(244,63,94,.28)',

      '--tq-text-primary': '#fff1f2',
      '--tq-text-secondary': 'rgba(255,241,242,.85)',
      '--tq-text-muted': 'rgba(251,113,133,.50)',

      '--tq-glass-bg': 'rgba(26,10,20,.10)',
      '--tq-glass-border': 'rgba(244,63,94,.18)',
      '--tq-glass-sheen': 'inset 0 1px 1px rgba(244,63,94,.25)',

      '--tq-progress-year': '#f43f5e',
      '--tq-progress-day': '#f59e0b',

      '--tq-search-bg': 'rgba(244,63,94,.04)',
      '--tq-search-border': 'rgba(244,63,94,.15)',
      '--tq-search-accent': '#f43f5e',

      '--tq-hover-bg': 'rgba(244,63,94,.12)',

      '--tq-success': '#10b981',
      '--tq-danger': '#ef4444',
      '--tq-warning': '#f59e0b',

      '--tq-scrollbar-track': 'transparent',
      '--tq-scrollbar-thumb': 'rgba(244,63,94,.20)',

      '--tq-gradient-subtle': 'linear-gradient(135deg, rgba(244,63,94,.05), rgba(245,158,11,.05))',
      '--tq-gradient-glass': 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, transparent 50%, rgba(244,63,94,0.1) 100%)',
    },
  },

  /* ── 5. Arctic Frost ────────────────────────────────────────── */
  arctic_frost: {
    key: 'arctic_frost',
    label: 'arctic_frost',
    bgGradient: 'from-[#0f172a] via-[#1e293b] to-[#0f172a]',
    preview: ['#0f172a', '#1e293b', '#0f172a'],
    tokens: {
      '--tq-accent': '#22d3ee',          // cyan-400
      '--tq-accent-rgb': '34,211,238',
      '--tq-accent-glow': 'rgba(34,211,238,.35)',
      '--tq-accent-secondary': '#38bdf8',          // sky-400
      '--tq-accent-sec-rgb': '56,189,248',

      '--tq-surface-1': 'rgba(30,41,59,.25)',
      '--tq-surface-2': 'rgba(30,41,59,.15)',
      '--tq-surface-3': 'rgba(30,41,59,.10)',
      '--tq-surface-elevated': 'rgba(30,41,59,0.35)',
      '--tq-surface-overlay': 'rgba(15,23,42,0.94)',

      '--tq-border-1': 'rgba(255,255,255,.08)',
      '--tq-border-2': 'rgba(255,255,255,.15)',

      '--tq-text-primary': '#ffffff',
      '--tq-text-secondary': 'rgba(255,255,255,.85)',
      '--tq-text-muted': 'rgba(255,255,255,.50)',

      '--tq-glass-bg': 'rgba(15,23,42,.15)',
      '--tq-glass-border': 'rgba(255,255,255,.10)',
      '--tq-glass-sheen': 'inset 0 1px 1px rgba(255,255,255,.10)',

      '--tq-progress-year': '#22d3ee',
      '--tq-progress-day': '#38bdf8',

      '--tq-search-bg': 'rgba(255,255,255,.03)',
      '--tq-search-border': 'rgba(255,255,255,.08)',
      '--tq-search-accent': '#22d3ee',

      '--tq-hover-bg': 'rgba(255,255,255,.05)',

      '--tq-success': '#10b981',
      '--tq-danger': '#ef4444',
      '--tq-warning': '#f59e0b',

      '--tq-scrollbar-track': 'transparent',
      '--tq-scrollbar-thumb': 'rgba(255,255,255,.10)',

      '--tq-gradient-subtle': 'linear-gradient(135deg, rgba(34,211,238,.05), rgba(56,189,248,.05))',
      '--tq-gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.04) 100%)',
    },
  },

  /* ── 6. Ember Glow ──────────────────────────────────────────── */
  ember_glow: {
    key: 'ember_glow',
    label: 'Ember Glow',
    bgGradient: 'from-[#0a0502] via-[#1c0e04] to-[#0a0502]',
    preview: ['#0a0502', '#1c0e04', '#0a0502'],
    tokens: {
      '--tq-accent': '#f97316',          // orange-500
      '--tq-accent-rgb': '249,115,22',
      '--tq-accent-glow': 'rgba(249,115,22,.35)',
      '--tq-accent-secondary': '#eab308',          // yellow-500
      '--tq-accent-sec-rgb': '234,179,8',

      '--tq-surface-1': 'rgba(249,115,22,.03)',
      '--tq-surface-2': 'rgba(249,115,22,.05)',
      '--tq-surface-3': 'rgba(249,115,22,.08)',
      '--tq-surface-elevated': 'rgba(249,115,22,.12)',
      '--tq-surface-overlay': 'rgba(28,14,4,0.95)',

      '--tq-border-1': 'rgba(249,115,22,.15)',
      '--tq-border-2': 'rgba(249,115,22,.28)',

      '--tq-text-primary': '#fff7ed',
      '--tq-text-secondary': 'rgba(255,247,237,.85)',
      '--tq-text-muted': 'rgba(253,186,116,.50)',

      '--tq-glass-bg': 'rgba(28,14,4,.10)',
      '--tq-glass-border': 'rgba(249,115,22,.18)',
      '--tq-glass-sheen': 'inset 0 1px 1px rgba(249,115,22,.25)',

      '--tq-progress-year': '#f97316',
      '--tq-progress-day': '#eab308',

      '--tq-search-bg': 'rgba(249,115,22,.04)',
      '--tq-search-border': 'rgba(249,115,22,.15)',
      '--tq-search-accent': '#f97316',

      '--tq-hover-bg': 'rgba(249,115,22,.12)',

      '--tq-success': '#10b981',
      '--tq-danger': '#ef4444',
      '--tq-warning': '#f59e0b',

      '--tq-scrollbar-track': 'transparent',
      '--tq-scrollbar-thumb': 'rgba(249,115,22,.20)',

      '--tq-gradient-subtle': 'linear-gradient(135deg, rgba(249,115,22,.05), rgba(234,179,8,.05))',
      '--tq-gradient-glass': 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, transparent 50%, rgba(249,115,22,0.1) 100%)',
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────

/** Ordered array for the settings grid */
export const THEME_LIST = Object.values(THEMES);

/** Resolve legacy theme keys to their new equivalents */
const LEGACY_ALIASES = {
  ocean_mist: 'midnight_default',
  forest_night: 'midnight_default',
  sunset_glow: 'midnight_default',
  aurora_bloom: 'midnight_default',
  graphite_steel: 'midnight_default',
  slate_ocean: 'midnight_default',
  evergreen_slate: 'midnight_default',
  graphite_navy: 'midnight_default',
  blue_ink: 'midnight_default',
  amber_slate: 'midnight_default',
};

export const resolveThemeKey = (key) => {
  if (THEMES[key]) return key;
  return LEGACY_ALIASES[key] || 'midnight_default';
};

/** Get the token map for a resolved key */
export const getThemeTokens = (key) => {
  const resolved = resolveThemeKey(key);
  return THEMES[resolved]?.tokens ?? THEMES.midnight_default.tokens;
};

/** Get theme metadata */
export const getTheme = (key) => {
  const resolved = resolveThemeKey(key);
  return THEMES[resolved] ?? THEMES.midnight_default;
};
