import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import Clock from '../../components/Clock';

describe('Clock component', () => {
  it('renders date', () => {
    render(<Clock />);
    const date = new Date();
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      year: 'numeric',
    });
    expect(screen.getByText(dateStr)).toBeInTheDocument();
  });
});
