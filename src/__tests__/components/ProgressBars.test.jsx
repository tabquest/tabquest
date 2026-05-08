import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import ProgressBars from '../../components/ProgressBars';

describe('ProgressBars component', () => {
  it('renders progress sections', () => {
    render(<ProgressBars />);
    expect(screen.getByText('Year in progress')).toBeInTheDocument();
    expect(screen.getByText('Day in progress')).toBeInTheDocument();
  });
});
