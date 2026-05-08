import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import TaskComponent from '../../components/TaskComponent';

describe('TaskComponent', () => {
  it('renders the tasks panel with default folders', () => {
    render(<TaskComponent />, {
      preloadedState: {
        tasks: {
          folders: [
            { id: 'today', title: 'Today', isDefault: true, count: 0 },
            { id: 'archive', title: 'Archive', isDefault: true, count: 0 },
          ],
          tasks: [],
          isAddingNew: false,
        },
      },
    });
    expect(screen.getAllByText('Today')).toHaveLength(2);
    expect(screen.getByText('Archive')).toBeInTheDocument();
    expect(screen.getByText(/new list/i)).toBeInTheDocument();
    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
  });
});
