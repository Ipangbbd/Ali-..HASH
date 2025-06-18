import React from 'react';
import { Loader2, Zap } from 'lucide-react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

export function ActionButton({
  onClick,
  disabled = false,
  loading = false,
  children,
  variant = 'primary',
  icon
}: ActionButtonProps) {
  const baseClasses = "relative flex items-center justify-center gap-2 px-6 py-3 font-bold font-mono rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:from-cyan-400 hover:to-blue-500 focus:ring-cyan-500/50 shadow-lg shadow-cyan-500/30 border border-cyan-400/50",
    secondary: "bg-black/80 text-cyan-400 border-2 border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 focus:ring-cyan-500/30 shadow-lg shadow-cyan-500/20 backdrop-blur-sm"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {/* Animated background for primary buttons */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
      )}
      
      {/* Scanning line effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
      
      <div className="relative flex items-center gap-2">
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            {icon && <span>{icon}</span>}
            <Zap size={12} className="animate-pulse" />
          </>
        )}
        <span className="text-sm">{children}</span>
      </div>
    </button>
  );
}