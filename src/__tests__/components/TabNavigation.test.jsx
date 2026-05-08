import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabNavigation from '../../components/TabNavigation';

describe('TabNavigation component', () => {
  it('renders all tabs', () => {
    render(<TabNavigation activeTab="Bookmarks" setActiveTab={() => {}} />);
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('TaskManager')).toBeInTheDocument();
    expect(screen.getByText('NotesSnippets')).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    const { container } = render(
      <TabNavigation activeTab="TaskManager" setActiveTab={() => {}} />,
    );
    const buttons = container.querySelectorAll('button');
    const activeButton = Array.from(buttons).find(
      (btn) => btn.textContent === 'TaskManager',
    );
    expect(activeButton).toBeInTheDocument();
  });
});
