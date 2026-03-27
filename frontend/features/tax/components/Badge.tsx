import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'success' }) => {
  const styles = {
    success: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20',
    warning: 'bg-amber-500/15 text-amber-500 border border-amber-500/20',
    error: 'bg-rose-500/15 text-rose-500 border border-rose-500/20',
    info: 'bg-sky-500/15 text-sky-500 border border-sky-500/20',
  };

  return (
    <div className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full w-fit ${styles[variant]}`}>
      {children}
    </div>
  );
};

export default Badge;
