import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[ErrorBoundary:${this.props.componentName || 'unknown'}]`,
      error,
      errorInfo,
    );
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-6 m-2 rounded-2xl"
          style={{
            background: 'var(--tq-surface-2)',
            border: '1px solid var(--tq-border-1)',
          }}
        >
          <div
            className="p-3 rounded-xl mb-3"
            style={{ background: 'rgba(239, 68, 68, 0.1)' }}
          >
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <p
            className="text-sm font-medium text-center mb-3"
            style={{ color: 'var(--tq-text-primary)' }}
          >
            {this.props.componentName
              ? `${this.props.componentName} encountered an error`
              : 'Something went wrong'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={this.handleReload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
            style={{
              background: 'var(--tq-surface-elevated)',
              border: '1px solid var(--tq-border-1)',
              color: 'var(--tq-text-secondary)',
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </motion.button>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
