import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import ChromeSearchBar from '../../components/ChromeSearchBar';

beforeEach(() => {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          main: { temp: 30 },
          weather: [{ description: 'clear sky', icon: '01d' }],
          name: 'Chennai',
          sys: { country: 'IN' },
        }),
    } as Response),
  ) as typeof globalThis.fetch;
});

describe('ChromeSearchBar', () => {
  it('renders search input and buttons', () => {
    render(<ChromeSearchBar onFocusChange={jest.fn()} />);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeInTheDocument();
    expect(screen.getByTitle(/perform search/i)).toBeInTheDocument();
  });
});
