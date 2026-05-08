import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../../components/ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary component', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('renders error fallback on error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary componentName="TestComponent">
        <ProblemChild />
      </ErrorBoundary>,
    );
    expect(
      screen.getByText('TestComponent encountered an error'),
    ).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
    spy.mockRestore();
  });
});
