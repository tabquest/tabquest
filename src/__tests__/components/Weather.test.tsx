import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import Weather from '../../components/Weather';

beforeEach(() => {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({
        main: { temp: 30 },
        weather: [{ description: 'clear sky', icon: '01d' }],
        name: 'Chennai',
        sys: { country: 'IN' },
      }),
    } as Response),
  ) as typeof globalThis.fetch;
});

describe('Weather component', () => {
  it('renders city name from weather data', async () => {
    render(<Weather />);
    const city = await screen.findByText(/chennai/i);
    expect(city).toBeInTheDocument();
  });
});
