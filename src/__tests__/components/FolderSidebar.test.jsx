import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FolderSidebar from '../../components/FolderSidebar';

describe('FolderSidebar', () => {
  it('renders folders and new folder button', () => {
    const folders = [
      { id: '1', title: 'Work', count: 3, isDefault: false },
      { id: '2', title: 'Personal', count: 1, isDefault: false },
    ];
    render(
      <FolderSidebar
        folders={folders}
        selectedFolder={null}
        setSelectedFolder={jest.fn()}
        setShowFolderPopup={jest.fn()}
        setEditingFolder={jest.fn()}
        setShowDeleteConfirm={jest.fn()}
        bookmarks={[]}
      />,
    );
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText(/new folder/i)).toBeInTheDocument();
  });
});
