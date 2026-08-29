import { forwardRef } from 'react';
import { motion } from 'framer-motion';

type Variant = 'accent' | 'ghost' | 'subtle' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  accent: {
    background: 'var(--tq-accent)',
    color: '#000',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--tq-text-primary)',
    border: '1px solid var(--tq-border-1)',
  },
  subtle: {
    background: 'var(--tq-surface-2)',
    color: 'var(--tq-text-primary)',
    border: '1px solid var(--tq-border-1)',
  },
  danger: {
    background: 'var(--tq-danger)',
    color: '#fff',
    border: 'none',
  },
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-2.5 text-base gap-2.5 rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'subtle',
      size = 'md',
      loading = false,
      icon,
      children,
      disabled,
      className = '',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileHover={isDisabled ? {} : { opacity: 0.85, scale: 1.02 }}
        whileTap={isDisabled ? {} : { scale: 0.96 }}
        transition={{ duration: 0.12 }}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center font-medium cursor-pointer transition-opacity select-none ${sizeStyles[size]} ${className}`}
        style={{
          ...variantStyles[variant],
          opacity: isDisabled ? 0.5 : 1,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}
        {...(props as object)}
      >
        {loading ? (
          <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon
        )}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
