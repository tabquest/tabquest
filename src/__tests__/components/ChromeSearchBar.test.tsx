import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import ChromeSearchBar from '../../components/ChromeSearchBar';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      main: { temp: 30 },
      weather: [{ description: 'clear sky', icon: '01d' }],
      name: 'Chennai',
      sys: { country: 'IN' },
    }),
  });
});

describe('ChromeSearchBar', () => {
  it('renders search input and buttons', () => {
    render(<ChromeSearchBar onFocusChange={jest.fn()} />);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeInTheDocument();
    expect(screen.getByTitle(/perform search/i)).toBeInTheDocument();
  });
});
