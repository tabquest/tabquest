import {
  render as rtlRender,
  type RenderOptions,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { RootState } from '../utils/redux/store';
import settingsReducer from '../utils/redux/settingsSlice';
import bookmarkReducer from '../utils/redux/bookmarkSlice';
import taskReducer from '../utils/redux/taskSlice';
import notesReducer from '../utils/redux/notesSlice';

type PreloadedState = Partial<RootState>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState;
}

const rootReducer = combineReducers({
  settings: settingsReducer,
  bookmarks: bookmarkReducer,
  tasks: taskReducer,
  notes: notesReducer,
});

function render(ui: React.ReactElement, options?: ExtendedRenderOptions) {
  const { preloadedState, ...renderOptions } = options ?? {};

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { render };
