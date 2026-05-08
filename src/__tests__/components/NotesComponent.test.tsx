import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import NotesComponent from '../../components/NotesComponent';

describe('NotesComponent', () => {
  it('renders the notes panel with add note button', () => {
    render(<NotesComponent />, {
      preloadedState: {
        notes: {
          items: [],
          filter: 'all',
          selectedNote: null,
          isAddingNew: false,
        },
      },
    });
    expect(screen.getByText(/add note/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search notes/i)).toBeInTheDocument();
    expect(screen.getByText(/no notes found/i)).toBeInTheDocument();
  });
});
