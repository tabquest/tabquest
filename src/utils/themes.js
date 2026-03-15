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
    // Tailwind gradient classes for the <body> bg
    bgGradient: 'from-gray-800 via-gray-900 to-gray-950',
    // Hex preview colours for the settings swatch
    preview: ['#1f2937', '#111827', '#030712'],
    // CSS custom-property map injected by ThemeProvider
    tokens: {
      '--tq-accent':            '#34d399',          // emerald-400
      '--tq-accent-rgb':        '52,211,153',
      '--tq-accent-glow':       'rgba(52,211,153,.25)',
      '--tq-accent-secondary':  '#60a5fa',          // blue-400
      '--tq-accent-sec-rgb':    '96,165,250',

      '--tq-surface-1':         'rgba(0,0,0,.40)',
      '--tq-surface-2':         'rgba(0,0,0,.20)',
      '--tq-surface-3':         'rgba(255,255,255,.05)',
      '--tq-surface-elevated':  'rgba(255,255,255,.08)',

      '--tq-border-1':          'rgba(255,255,255,.10)',
      '--tq-border-2':          'rgba(255,255,255,.20)',

      '--tq-text-primary':      'rgba(255,255,255,.95)',
      '--tq-text-secondary':    'rgba(255,255,255,.70)',
      '--tq-text-muted':        'rgba(255,255,255,.45)',

      '--tq-glass-bg':          'rgba(0,0,0,.35)',
      '--tq-glass-border':      'rgba(255,255,255,.10)',

      '--tq-progress-year':     '#3b82f6',       // blue-500
      '--tq-progress-day':      '#22c55e',        // green-500

      '--tq-search-bg':         'rgba(88,28,135,.30)',  // purple-900/30
      '--tq-search-border':     'rgba(168,85,247,.20)', // purple-500/20
      '--tq-search-accent':     '#a855f7',

      '--tq-hover-bg':          'rgba(255,255,255,.10)',

      '--tq-success':           '#22c55e',
      '--tq-danger':            '#ef4444',
      '--tq-warning':           '#f59e0b',

      '--tq-scrollbar-track':   'rgba(0,0,0,.20)',
      '--tq-scrollbar-thumb':   'rgba(255,255,255,.10)',

      '--tq-gradient-subtle':   'linear-gradient(135deg, rgba(52,211,153,.05), rgba(96,165,250,.05))',
      '--tq-gradient-glass':    'linear-gradient(135deg, rgba(255,255,255,.05), transparent, rgba(255,255,255,.05))',
    },
  },

  /* ── 2. Aurora Borealis ─────────────────────────────────────── */
  aurora_borealis: {
    key: 'aurora_borealis',
    label: 'Aurora Borealis',
    bgGradient: 'from-[#0a1628] via-[#0d2137] to-[#060e1a]',
    preview: ['#0a1628', '#0d2137', '#060e1a'],
    tokens: {
      '--tq-accent':            '#67e8f9',          // cyan-300
      '--tq-accent-rgb':        '103,232,249',
      '--tq-accent-glow':       'rgba(103,232,249,.25)',
      '--tq-accent-secondary':  '#a78bfa',          // violet-400
      '--tq-accent-sec-rgb':    '167,139,250',

      '--tq-surface-1':         'rgba(10,22,40,.55)',
      '--tq-surface-2':         'rgba(13,33,55,.45)',
      '--tq-surface-3':         'rgba(103,232,249,.06)',
      '--tq-surface-elevated':  'rgba(103,232,249,.08)',

      '--tq-border-1':          'rgba(103,232,249,.15)',
      '--tq-border-2':          'rgba(103,232,249,.25)',

      '--tq-text-primary':      'rgba(236,254,255,.96)',
      '--tq-text-secondary':    'rgba(186,230,253,.78)',
      '--tq-text-muted':        'rgba(147,197,253,.45)',

      '--tq-glass-bg':          'rgba(10,22,40,.50)',
      '--tq-glass-border':      'rgba(103,232,249,.12)',

      '--tq-progress-year':     '#67e8f9',
      '--tq-progress-day':      '#a78bfa',

      '--tq-search-bg':         'rgba(103,232,249,.08)',
      '--tq-search-border':     'rgba(103,232,249,.18)',
      '--tq-search-accent':     '#67e8f9',

      '--tq-hover-bg':          'rgba(103,232,249,.10)',

      '--tq-success':           '#34d399',
      '--tq-danger':            '#fb7185',
      '--tq-warning':           '#fbbf24',

      '--tq-scrollbar-track':   'rgba(10,22,40,.30)',
      '--tq-scrollbar-thumb':   'rgba(103,232,249,.15)',

      '--tq-gradient-subtle':   'linear-gradient(135deg, rgba(103,232,249,.06), rgba(167,139,250,.06))',
      '--tq-gradient-glass':    'linear-gradient(135deg, rgba(103,232,249,.05), transparent, rgba(167,139,250,.05))',
    },
  },

  /* ── 3. Cyber Neon ──────────────────────────────────────────── */
  cyber_neon: {
    key: 'cyber_neon',
    label: 'Cyber Neon',
    bgGradient: 'from-[#0c0118] via-[#120228] to-[#080012]',
    preview: ['#0c0118', '#120228', '#080012'],
    tokens: {
      '--tq-accent':            '#e879f9',          // fuchsia-400
      '--tq-accent-rgb':        '232,121,249',
      '--tq-accent-glow':       'rgba(232,121,249,.30)',
      '--tq-accent-secondary':  '#22d3ee',          // cyan-400
      '--tq-accent-sec-rgb':    '34,211,238',

      '--tq-surface-1':         'rgba(12,1,24,.60)',
      '--tq-surface-2':         'rgba(18,2,40,.45)',
      '--tq-surface-3':         'rgba(232,121,249,.06)',
      '--tq-surface-elevated':  'rgba(232,121,249,.10)',

      '--tq-border-1':          'rgba(232,121,249,.18)',
      '--tq-border-2':          'rgba(232,121,249,.30)',

      '--tq-text-primary':      'rgba(253,244,255,.96)',
      '--tq-text-secondary':    'rgba(245,208,254,.78)',
      '--tq-text-muted':        'rgba(217,170,237,.45)',

      '--tq-glass-bg':          'rgba(12,1,24,.55)',
      '--tq-glass-border':      'rgba(232,121,249,.14)',

      '--tq-progress-year':     '#e879f9',
      '--tq-progress-day':      '#22d3ee',

      '--tq-search-bg':         'rgba(232,121,249,.08)',
      '--tq-search-border':     'rgba(232,121,249,.20)',
      '--tq-search-accent':     '#e879f9',

      '--tq-hover-bg':          'rgba(232,121,249,.12)',

      '--tq-success':           '#4ade80',
      '--tq-danger':            '#f87171',
      '--tq-warning':           '#fbbf24',

      '--tq-scrollbar-track':   'rgba(12,1,24,.30)',
      '--tq-scrollbar-thumb':   'rgba(232,121,249,.15)',

      '--tq-gradient-subtle':   'linear-gradient(135deg, rgba(232,121,249,.06), rgba(34,211,238,.06))',
      '--tq-gradient-glass':    'linear-gradient(135deg, rgba(232,121,249,.06), transparent, rgba(34,211,238,.06))',
    },
  },

  /* ── 4. Velvet Rose ─────────────────────────────────────────── */
  velvet_rose: {
    key: 'velvet_rose',
    label: 'Velvet Rose',
    bgGradient: 'from-[#1a0a14] via-[#22101a] to-[#0e0610]',
    preview: ['#1a0a14', '#22101a', '#0e0610'],
    tokens: {
      '--tq-accent':            '#fb7185',          // rose-400
      '--tq-accent-rgb':        '251,113,133',
      '--tq-accent-glow':       'rgba(251,113,133,.25)',
      '--tq-accent-secondary':  '#fbbf24',          // amber-400
      '--tq-accent-sec-rgb':    '251,191,36',

      '--tq-surface-1':         'rgba(26,10,20,.55)',
      '--tq-surface-2':         'rgba(34,16,26,.45)',
      '--tq-surface-3':         'rgba(251,113,133,.06)',
      '--tq-surface-elevated':  'rgba(251,113,133,.08)',

      '--tq-border-1':          'rgba(251,113,133,.15)',
      '--tq-border-2':          'rgba(251,113,133,.25)',

      '--tq-text-primary':      'rgba(255,241,242,.96)',
      '--tq-text-secondary':    'rgba(254,205,211,.78)',
      '--tq-text-muted':        'rgba(252,165,165,.45)',

      '--tq-glass-bg':          'rgba(26,10,20,.50)',
      '--tq-glass-border':      'rgba(251,113,133,.12)',

      '--tq-progress-year':     '#fb7185',
      '--tq-progress-day':      '#fbbf24',

      '--tq-search-bg':         'rgba(251,113,133,.08)',
      '--tq-search-border':     'rgba(251,113,133,.18)',
      '--tq-search-accent':     '#fb7185',

      '--tq-hover-bg':          'rgba(251,113,133,.10)',

      '--tq-success':           '#4ade80',
      '--tq-danger':            '#f87171',
      '--tq-warning':           '#fbbf24',

      '--tq-scrollbar-track':   'rgba(26,10,20,.30)',
      '--tq-scrollbar-thumb':   'rgba(251,113,133,.15)',

      '--tq-gradient-subtle':   'linear-gradient(135deg, rgba(251,113,133,.06), rgba(251,191,36,.06))',
      '--tq-gradient-glass':    'linear-gradient(135deg, rgba(251,113,133,.05), transparent, rgba(251,191,36,.05))',
    },
  },

  /* ── 5. Arctic Frost ────────────────────────────────────────── */
  arctic_frost: {
    key: 'arctic_frost',
    label: 'Arctic Frost',
    bgGradient: 'from-[#0c1929] via-[#0f2035] to-[#071018]',
    preview: ['#0c1929', '#0f2035', '#071018'],
    tokens: {
      '--tq-accent':            '#93c5fd',          // blue-300
      '--tq-accent-rgb':        '147,197,253',
      '--tq-accent-glow':       'rgba(147,197,253,.25)',
      '--tq-accent-secondary':  '#c4b5fd',          // violet-300
      '--tq-accent-sec-rgb':    '196,181,253',

      '--tq-surface-1':         'rgba(12,25,41,.55)',
      '--tq-surface-2':         'rgba(15,32,53,.45)',
      '--tq-surface-3':         'rgba(147,197,253,.06)',
      '--tq-surface-elevated':  'rgba(147,197,253,.08)',

      '--tq-border-1':          'rgba(147,197,253,.15)',
      '--tq-border-2':          'rgba(147,197,253,.25)',

      '--tq-text-primary':      'rgba(239,246,255,.96)',
      '--tq-text-secondary':    'rgba(191,219,254,.80)',
      '--tq-text-muted':        'rgba(147,197,253,.45)',

      '--tq-glass-bg':          'rgba(12,25,41,.50)',
      '--tq-glass-border':      'rgba(147,197,253,.12)',

      '--tq-progress-year':     '#93c5fd',
      '--tq-progress-day':      '#c4b5fd',

      '--tq-search-bg':         'rgba(147,197,253,.08)',
      '--tq-search-border':     'rgba(147,197,253,.18)',
      '--tq-search-accent':     '#93c5fd',

      '--tq-hover-bg':          'rgba(147,197,253,.10)',

      '--tq-success':           '#6ee7b7',
      '--tq-danger':            '#fca5a5',
      '--tq-warning':           '#fcd34d',

      '--tq-scrollbar-track':   'rgba(12,25,41,.30)',
      '--tq-scrollbar-thumb':   'rgba(147,197,253,.15)',

      '--tq-gradient-subtle':   'linear-gradient(135deg, rgba(147,197,253,.06), rgba(196,181,253,.06))',
      '--tq-gradient-glass':    'linear-gradient(135deg, rgba(147,197,253,.05), transparent, rgba(196,181,253,.05))',
    },
  },

  /* ── 6. Ember Glow ──────────────────────────────────────────── */
  ember_glow: {
    key: 'ember_glow',
    label: 'Ember Glow',
    bgGradient: 'from-[#1c0e04] via-[#261308] to-[#100802]',
    preview: ['#1c0e04', '#261308', '#100802'],
    tokens: {
      '--tq-accent':            '#fb923c',          // orange-400
      '--tq-accent-rgb':        '251,146,60',
      '--tq-accent-glow':       'rgba(251,146,60,.25)',
      '--tq-accent-secondary':  '#facc15',          // yellow-400
      '--tq-accent-sec-rgb':    '250,204,21',

      '--tq-surface-1':         'rgba(28,14,4,.55)',
      '--tq-surface-2':         'rgba(38,19,8,.45)',
      '--tq-surface-3':         'rgba(251,146,60,.06)',
      '--tq-surface-elevated':  'rgba(251,146,60,.08)',

      '--tq-border-1':          'rgba(251,146,60,.15)',
      '--tq-border-2':          'rgba(251,146,60,.25)',

      '--tq-text-primary':      'rgba(255,247,237,.96)',
      '--tq-text-secondary':    'rgba(254,215,170,.78)',
      '--tq-text-muted':        'rgba(253,186,116,.45)',

      '--tq-glass-bg':          'rgba(28,14,4,.50)',
      '--tq-glass-border':      'rgba(251,146,60,.12)',

      '--tq-progress-year':     '#fb923c',
      '--tq-progress-day':      '#facc15',

      '--tq-search-bg':         'rgba(251,146,60,.08)',
      '--tq-search-border':     'rgba(251,146,60,.18)',
      '--tq-search-accent':     '#fb923c',

      '--tq-hover-bg':          'rgba(251,146,60,.10)',

      '--tq-success':           '#4ade80',
      '--tq-danger':            '#f87171',
      '--tq-warning':           '#fbbf24',

      '--tq-scrollbar-track':   'rgba(28,14,4,.30)',
      '--tq-scrollbar-thumb':   'rgba(251,146,60,.15)',

      '--tq-gradient-subtle':   'linear-gradient(135deg, rgba(251,146,60,.06), rgba(250,204,21,.06))',
      '--tq-gradient-glass':    'linear-gradient(135deg, rgba(251,146,60,.05), transparent, rgba(250,204,21,.05))',
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────

/** Ordered array for the settings grid */
export const THEME_LIST = Object.values(THEMES);

/** Resolve legacy theme keys to their new equivalents */
const LEGACY_ALIASES = {
  ocean_mist:       'midnight_default',
  forest_night:     'midnight_default',
  sunset_glow:      'midnight_default',
  aurora_bloom:     'midnight_default',
  graphite_steel:   'midnight_default',
  slate_ocean:      'midnight_default',
  evergreen_slate:  'midnight_default',
  graphite_navy:    'midnight_default',
  blue_ink:         'midnight_default',
  amber_slate:      'midnight_default',
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
