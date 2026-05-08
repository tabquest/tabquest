import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from '../utils/redux/settingsSlice';
import bookmarkReducer from '../utils/redux/bookmarkSlice';
import taskReducer from '../utils/redux/taskSlice';
import notesReducer from '../utils/redux/notesSlice';

function render(ui, { preloadedState, ...options } = {}) {
  const store = configureStore({
    reducer: {
      settings: settingsReducer,
      bookmarks: bookmarkReducer,
      tasks: taskReducer,
      notes: notesReducer,
    },
    preloadedState,
  });

  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
export { render };
