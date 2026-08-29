type BadgeVariant =
  | 'default'
  | 'accent'
  | 'success'
  | 'danger'
  | 'warning'
  | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: 'var(--tq-surface-2)',
    color: 'var(--tq-text-primary)',
    border: '1px solid var(--tq-border-1)',
  },
  accent: {
    background: 'rgba(var(--tq-accent-rgb), 0.15)',
    color: 'var(--tq-accent)',
    border: '1px solid rgba(var(--tq-accent-rgb), 0.3)',
  },
  success: {
    background: 'rgba(16, 185, 129, 0.12)',
    color: 'var(--tq-success)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
  },
  danger: {
    background: 'rgba(239, 68, 68, 0.12)',
    color: 'var(--tq-danger)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.12)',
    color: 'var(--tq-warning)',
    border: '1px solid rgba(245, 158, 11, 0.25)',
  },
  muted: {
    background: 'transparent',
    color: 'var(--tq-text-muted)',
    border: '1px solid var(--tq-border-1)',
  },
};

export const Badge = ({
  children,
  variant = 'default',
  icon,
  onRemove,
  className = '',
}: BadgeProps) => (
  <span className={`tq-pill ${className}`} style={variantStyles[variant]}>
    {icon && <span className="shrink-0">{icon}</span>}
    {children}
    {onRemove && (
      <button
        onClick={onRemove}
        className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer leading-none"
        aria-label="Remove"
        type="button"
      >
        ×
      </button>
    )}
  </span>
);
