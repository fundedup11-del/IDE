import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  ...props
}) => {
  const sizes: Record<Size, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '14px' },
    md: { padding: '8px 16px', fontSize: '16px' },
    lg: { padding: '12px 24px', fontSize: '18px' },
  };

  const variantStyles: Record<Variant, React.CSSProperties> = {
    primary: {
      background: 'var(--primary)',
      color: 'var(--primary-foreground, #fff)',
      border: 'none',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text-default)',
      border: `1px solid var(--border)`,
    },
    ghost: {
      background: 'transparent',
      color: 'var(--primary)',
      border: 'none',
    },
    destructive: {
      background: 'var(--color-error)',
      color: '#fff',
      border: 'none',
    },
  };

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform var(--motion-fast), box-shadow var(--motion-fast)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transform: 'translateZ(0)',
    ...sizes[size],
    ...variantStyles[variant],
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={style}
      aria-pressed={false}
    >
      {loading ? (
        <span aria-hidden style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 8, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'rgba(255,255,255,0.8)', animation: 'spin 1s linear infinite' }} />
      ) : null}
      <span>{children}</span>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}button:active{transform:scale(.98)}button:focus{outline:3px solid var(--ring);outline-offset:2px}`}</style>
    </button>
  );
};

export default Button;
