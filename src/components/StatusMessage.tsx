import { CheckCircle, XCircle, AlertCircle, Zap } from 'lucide-react';

interface StatusMessageProps {
  type: 'success' | 'error' | 'info';
  message: string;
}

export function StatusMessage({ type, message }: StatusMessageProps) {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-gradient-to-r from-green-500/20 to-cyan-500/20',
      textColor: 'text-green-400',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/30',
      shadowColor: 'shadow-green-500/20'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-gradient-to-r from-red-500/20 to-pink-500/20',
      textColor: 'text-red-400',
      iconColor: 'text-red-400',
      borderColor: 'border-red-500/30',
      shadowColor: 'shadow-red-500/20'
    },
    info: {
      icon: AlertCircle,
      bgColor: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20',
      textColor: 'text-cyan-400',
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      shadowColor: 'shadow-cyan-500/20'
    }
  };

  const { icon: Icon, bgColor, textColor, iconColor, borderColor, shadowColor } = config[type];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm ${bgColor} ${borderColor} shadow-lg ${shadowColor} animate-in slide-in-from-top-2 duration-300 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      <div className="relative flex items-center gap-3">
        <div className="relative">
          <Icon size={20} className={`${iconColor} flex-shrink-0`} />
          <Zap size={12} className={`absolute -top-1 -right-1 ${iconColor} animate-pulse`} />
        </div>
        <p className={`text-sm font-bold font-mono ${textColor}`}>
          [{type.toUpperCase()}] {message}
        </p>
      </div>
    </div>
  );
}