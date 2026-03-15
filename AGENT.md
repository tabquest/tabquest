# AGENT.md — AI-Centric Contribution Guide for TabQuest 🚀

Welcome, AI Agent! This document is your primary source of truth for understanding the **TabQuest** codebase, its architectural "vibe," and the strict standards for contribution.

## 🧬 Codebase DNA & "Vibe"
TabQuest is a **premium productivity suite** (Bookmarks, Tasks, Notes) built as a browser extension. The "vibe" is:
- **Glassmorphic & Aesthetic**: Transparent surfaces, subtle glows, and smooth transitions.
- **Theme-Driven**: Highly customized through a robust CSS variable system (`src/utils/themes.js`).
- **Motion-Heavy**: Uses `framer-motion` for almost all transitions (Spring-based).
- **Clean Structure**: Component-driven with a focus on reusability and semantic styling.

---

## 🛠 Tech Stack & Tooling
- **Core**: React 19, Redux Toolkit, Vite.
- **Styling**: Tailwind CSS v4 (using the `@tailwindcss/vite` plugin).
- **Icons**: `lucide-react` (primary), `react-icons` (fallback).
- **Animations**: `framer-motion`.
- **Package Manager**: `pnpm` (strictly required).
- **Environment**: Multi-browser support (Chrome, Edge, Firefox) handled via `chooseMode.js`.

---

## 🧠 State & Data Persistence
TabQuest uses a hybrid approach for performance and reliability:
- **Redux Toolkit (RTK)**: Handles synchronous UI state across the application.
- **LocalStorage**: The primary persistence layer for user data (Bookmarks, Tasks, Notes, Settings).

### Data Flow Pattern:
1.  **Redux Slices**: Each feature has a slice in `src/utils/redux/` (e.g., `bookmarkSlice.js`).
2.  **Persistence**: Reducers manually call a local `saveToStorage()` function using a specific key (e.g., `bookmarkManager`, `settings`).
3.  **Hydration**: Key components perform a "Hydration" step in `useEffect` on mount:
    ```javascript
    useEffect(() => {
      const data = loadFromLocalStorage();
      dispatch(setInitialState(data));
    }, []);
    ```
4.  **Consistency**: Before adding new fields to a slice, ensure they are added to both the `initialState` and the corresponding `load/save` helpers to prevent data loss.

---

## 🚀 Setup & Development Workflow
AI Agents should follow these steps to initialize the environment:

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```
2. **Launch Development Mode**:
   TabQuest uses a custom launcher to sync manifests. Run:
   ```bash
   pnpm dev
   ```
   *Note: This will prompt you to select a target browser (Chrome, Edge, or Firefox).*

3. **Build Target**:
   ```bash
   pnpm build:chrome
   # or build:firefox, build:edge
   ```

---

## 🎨 Styling Philosophy & Themes
**CRITICAL**: Do NOT use hardcoded colors (e.g., `text-blue-500`) unless they are intentional "brand" colors.
- Use **Theme Tokens** located in `src/utils/themes.js`.
- These are mapped to CSS variables like `--tq-accent`, `--tq-surface-1`, etc.
- In Tailwind v4, you can reference these directly or via custom classes in `index.css`.

Example of the "Premium" look:
```jsx
<motion.div 
  className="bg-[var(--tq-glass-bg)] border border-[var(--tq-glass-border)] backdrop-blur-md rounded-2xl"
  whileHover={{ scale: 1.02 }}
>
  {/* Content */}
</motion.div>
```

## 🧩 Architectural Patterns & Quirks
To avoid confusing the AI, follow these three distinct patterns found in the wild:

1.  **Redux-Driven Persistence (Bookmarks, Settings)**:
    - Reducers in the slice (e.g., `src/utils/redux/bookmarkSlice.js`) manually call a helper like `saveToStorage(state)` on every modification.
2.  **Stateless Redux Hydration (Notes)**:
    - The slice (e.g., `src/utils/redux/notesSlice.js`) calls `loadFromStorage()` directly within the `initialState` definition.
3.  **Component-Driven Persistence (Tasks)**:
    - The feature component (e.g., `src/components/TaskComponent/index.jsx`) uses a `useEffect` hook with `[folders, tasks]` as dependencies to trigger `saveToLocalStorage` whenever the Redux state changes.

**Agent Instruction**: Before modifying a feature, identify which of these 3 patterns it uses. Do not mix patterns within the same feature.

### 🔑 Storage Keys
- `bookmarkManager`: Key for Bookmarks.
- `notesManager`: Key for Notes.
- `settings`: Key for Settings.
- `tasks`: Key for Tasks (in `src/utils/storage.js`).
- **Spring Animations**: We favor "Glassmorphic" motion. Use `stiffness: 100` and `damping: 20` for a premium feel. Avoid standard `ease-in-out` transitions for primary UI panels.

---

## 📝 Git & Commit Standards
We use **Conventional Commits**. Husky and Commitlint will reject non-compliant messages.

**Format**: `<type>(<scope>): <subject>`
- **feat**: New feature.
- **fix**: Bug fix.
- **docs**: Documentation changes.
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **perf**: Performance improvements.
- **test**: Adding missing tests or correcting existing tests.
- **chore**: Changes to the build process or auxiliary tools.

---

## 🛠 Pull Request Protocol
1. **Branching**: `feat/your-feature-name` or `fix/issue-description`.
2. **Self-Review Checklist for Agents**:
   - [ ] Is it responsive? (Check `MobileView.jsx` logic).
   - [ ] Does it respect the current Theme? (Check CSS vars).
   - [ ] Are animations smooth? (Prefer `stiffness: 100`, `damping: 20` type springs).
   - [ ] Is it tested? (Add to `src/__tests__`).
3. **PR Description**: Must include an "AI Walkthrough" of the changes and a breakdown of performance/UI impacts.

---

## 🗺 Directory Map
- `/src/components`: UI components, organized by feature folders (e.g., `BookmarkComponent`).
- `/src/features`: Larger functional modules or views.
- `/src/utils`: Redux store, themes, and shared constants.
- `/scripts`: Custom build scripts.
- `/manifests`: Target-specific browser manifest files.

---

## 🌐 External Services & APIs
TabQuest depends on the following external services. AI Agents should be aware of these when debugging or proposing features:
- **Weather API**: `https://tabquest.val.run/weather?city=`
  - **Backend**: [Val Town Weather API](https://www.val.town/x/TabQuest/weatherAPI)
  - **Note**: This is a custom proxy to protect API keys and aggregate data.
- **Favicon Service**: `https://www.google.com/s2/favicons?sz=64&domain=`
- **Feedback API**: Google Apps Script endpoint.

---

## 🤖 Interaction Guardrails

- **No Refactor Sprawl**: If asked to fix a bug, do not refactor the entire file unless explicitly requested.
- **Preserve Aesthetic**: If adding a new UI element, ensure it uses the glassy/premium design language.
- **Ask Before Deleting**: Never remove features or legacy themes without confirmation.

TabQuest is about **Productivity with Class**. Now go build something beautiful. 🚀
