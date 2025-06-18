import { Copy, Check, Terminal } from 'lucide-react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
  onCopy?: () => void;
  copied?: boolean;
  rows?: number;
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  onCopy,
  copied = false,
  rows = 6
}: TextAreaProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 font-mono">
          <Terminal size={14} className="animate-pulse" />
          {label}
        </label>
        {readOnly && value && (
          <button
            onClick={onCopy}
            className="flex items-center gap-2 px-3 py-1 text-xs font-bold font-mono text-black bg-gradient-to-r from-cyan-400 to-blue-500 rounded-md hover:from-cyan-300 hover:to-blue-400 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'COPIED' : 'COPY'}
          </button>
        )}
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={rows}
          className={`w-full px-4 py-3 text-sm rounded-lg resize-none focus:outline-none transition-all duration-200 font-mono ${
            readOnly
              ? 'bg-black/80 text-purple-300 cursor-default border border-purple-500/30 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-purple-500/50 shadow-inner'
              : 'bg-black/80 text-cyan-100 border border-cyan-500/30 hover:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-cyan-500/50 shadow-inner'
          }`}
        />
        {/* Scanning line effect for active textarea */}
        {!readOnly && value && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
}