import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import BookmarkBar from '../../components/BookmarkBar';

describe('BookmarkBar component', () => {
  it('renders bookmarks from redux store', () => {
    render(<BookmarkBar />);
    expect(screen.getByText('Notion')).toBeInTheDocument();
    expect(screen.getByText('YouTube')).toBeInTheDocument();
  });
});
