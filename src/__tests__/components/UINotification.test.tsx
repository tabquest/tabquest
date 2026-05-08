import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UINotification from '../../components/UINotification';

describe('UINotification', () => {
  it('renders null when no notification', () => {
    const { container } = render(
      <UINotification notification={null} onClose={jest.fn()} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders notification title and body', () => {
    const notification = { title: 'Test Title', body: 'Test Body' };
    render(<UINotification notification={notification} onClose={jest.fn()} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Body')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    const notification = { title: 'Test', body: 'Body' };
    render(<UINotification notification={notification} onClose={onClose} />);
    fireEvent.click(screen.getByTitle(/close notification/i));
    expect(onClose).toHaveBeenCalled();
  });
});
