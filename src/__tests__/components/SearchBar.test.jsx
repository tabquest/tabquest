import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import SearchBar from '../../components/SearchBar';

describe('SearchBar component', () => {
  it('renders search input', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeInTheDocument();
  });
});
