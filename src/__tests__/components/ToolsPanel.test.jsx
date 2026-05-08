import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import ToolsPanel from '../../components/ToolsPanel';

describe('ToolsPanel component', () => {
  it('renders the floating toggle button', () => {
    render(<ToolsPanel />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
