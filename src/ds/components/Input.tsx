import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    const baseStyle: React.CSSProperties = {
      background: 'var(--tq-surface-2)',
      border: `1px solid ${error ? 'var(--tq-danger)' : 'var(--tq-border-1)'}`,
      color: 'var(--tq-text-primary)',
      borderRadius: '0.75rem',
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium"
            style={{ color: 'var(--tq-text-secondary)' }}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--tq-text-muted)' }}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${icon ? 'pl-9' : ''} ${className}`}
            style={{
              ...baseStyle,
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--tq-accent)';
              e.currentTarget.style.boxShadow =
                '0 0 0 2px rgba(var(--tq-accent-rgb), 0.2)';
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error
                ? 'var(--tq-danger)'
                : 'var(--tq-border-1)';
              e.currentTarget.style.boxShadow = 'none';
              props.onBlur?.(e);
            }}
            data-no-theme-transition="true"
            {...props}
          />
        </div>

        {(error || hint) && (
          <p
            className="text-xs"
            style={{
              color: error ? 'var(--tq-danger)' : 'var(--tq-text-muted)',
            }}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
