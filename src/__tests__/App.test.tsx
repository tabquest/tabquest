import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

test('renders a button with the text "Submit"', () => {
  render(<App />);
  expect(screen.getByText('user_name')).toBeInTheDocument();
});
