import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import ThemeProvider from '../../utils/ThemeProvider';

describe('ThemeProvider', () => {
  it('renders children with theme wrapper', () => {
    render(
      <ThemeProvider>
        <div>themed content</div>
      </ThemeProvider>,
    );
    expect(screen.getByText('themed content')).toBeInTheDocument();
  });
});
