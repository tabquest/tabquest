import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import BookmarkComponent from '../../components/BookmarkComponent';

describe('BookmarkComponent', () => {
  it('renders the bookmarks panel with folders sidebar', () => {
    render(<BookmarkComponent />, {
      preloadedState: {
        bookmarks: {
          folders: [
            { id: 'favorites', title: 'Favorites', count: 0, isDefault: true },
          ],
          bookmarks: [],
          isAddingNew: false,
        },
      },
    });
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText(/new folder/i)).toBeInTheDocument();
    expect(screen.getByText(/No bookmarks found/i)).toBeInTheDocument();
  });
});
