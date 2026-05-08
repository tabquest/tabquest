import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChristmasSnowfall from '../../components/ChristmasSnowfall';

describe('ChristmasSnowfall', () => {
  it('renders without crashing', () => {
    const { container } = render(<ChristmasSnowfall />);
    expect(container.querySelector('.fixed.inset-0')).toBeInTheDocument();
  });
});
