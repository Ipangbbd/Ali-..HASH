import { useState, useCallback } from 'react';
import { Shield, Lock, Unlock, Info, Zap, Eye } from 'lucide-react';
import { SecureTextTransformer } from './utils/crypto';
import { TextArea } from './components/TextArea';
import { StatusMessage } from './components/StatusMessage';
import { ActionButton } from './components/ActionButton';

type Mode = 'encrypt' | 'decrypt';
type Status = { type: 'success' | 'error' | 'info'; message: string } | null;

function App() {
  const [mode, setMode] = useState<Mode>('encrypt');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [status, setStatus] = useState<Status>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const clearStatus = useCallback(() => {
    setStatus(null);
  }, []);

  const handleCopy = useCallback(async () => {
    if (outputText) {
      try {
        await navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        setStatus({ type: 'error', message: 'Failed to copy to clipboard' });
      }
    }
  }, [outputText]);

  const handleTransform = useCallback(async () => {
    clearStatus();
    
    if (!inputText.trim()) {
      setStatus({ type: 'error', message: 'Please enter some text to transform' });
      return;
    }

    setIsProcessing(true);
    
    try {
      let result: string;
      
      if (mode === 'encrypt') {
        result = SecureTextTransformer.encrypt(inputText);
        setStatus({ 
          type: 'success', 
          message: 'Text successfully encoded with quantum-resistant transformation' 
        });
      } else {
        if (!SecureTextTransformer.isValidEncryptedFormat(inputText)) {
          throw new Error('Invalid encoded text format');
        }
        result = SecureTextTransformer.decrypt(inputText);
        setStatus({ 
          type: 'success', 
          message: 'Text successfully decoded and verified' 
        });
      }
      
      setOutputText(result);
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Transformation failed' 
      });
      setOutputText('');
    } finally {
      setIsProcessing(false);
    }
  }, [mode, inputText, clearStatus]);

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
    setInputText('');
    setOutputText('');
    clearStatus();
  }, [clearStatus]);

  const handleClear = useCallback(() => {
    setInputText('');
    setOutputText('');
    clearStatus();
  }, [clearStatus]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,255,255,0.1)_0%,transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,0,255,0.1)_0%,transparent_50%)] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(0,255,0,0.05)_0%,transparent_50%)] animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Header */}
      <div className="relative bg-black/80 backdrop-blur-sm border-b border-cyan-500/30 shadow-lg shadow-cyan-500/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg shadow-lg shadow-cyan-500/50">
              <Shield className="w-8 h-8 text-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-50 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ALI-..HASH
              </h1>
              <p className="text-sm text-cyan-300/80 font-mono">
                [QUANTUM-MATRIX] AUTONOMOUS TEXT HASHING
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-xs text-green-400 font-mono">AUTONOMOUS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Mode Selection */}
        <div className="mb-8">
          <div className="flex gap-2 p-2 bg-black/60 backdrop-blur-sm rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
            <button
              onClick={() => handleModeChange('encrypt')}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-bold font-mono transition-all duration-300 transform hover:scale-105 ${
                mode === 'encrypt'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/50 border border-cyan-400'
                  : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30'
              }`}
            >
              <Lock size={18} />
              <span className="text-sm">ENCODE</span>
              {mode === 'encrypt' && <Zap size={14} className="animate-pulse" />}
            </button>
            <button
              onClick={() => handleModeChange('decrypt')}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-bold font-mono transition-all duration-300 transform hover:scale-105 ${
                mode === 'decrypt'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-black shadow-lg shadow-purple-500/50 border border-purple-400'
                  : 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30'
              }`}
            >
              <Unlock size={18} />
              <span className="text-sm">DECODE</span>
              {mode === 'decrypt' && <Eye size={14} className="animate-pulse" />}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>
            <div className="relative">
              <TextArea
                label={mode === 'encrypt' ? '[INPUT] PLAIN_TEXT' : '[INPUT] CIPHER_TEXT'}
                value={inputText}
                onChange={setInputText}
                placeholder={
                  mode === 'encrypt'
                    ? 'Enter data for transformation...'
                    : 'Paste encoded payload here...'
                }
                rows={12}
              />
              
              <div className="mt-6">
                <div className="flex gap-3">
                  <ActionButton
                    onClick={handleTransform}
                    loading={isProcessing}
                    disabled={!inputText.trim()}
                    icon={mode === 'encrypt' ? <Lock size={16} /> : <Unlock size={16} />}
                  >
                    {mode === 'encrypt' ? 'ENCODE' : 'DECODE'}
                  </ActionButton>
                  
                  <ActionButton
                    onClick={handleClear}
                    variant="secondary"
                    disabled={isProcessing}
                  >
                    CLEAR_ALL
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
            <div className="relative">
              <TextArea
                label={mode === 'encrypt' ? '[OUTPUT] CIPHER_TEXT' : '[OUTPUT] PLAIN_TEXT'}
                value={outputText}
                placeholder={
                  mode === 'encrypt'
                    ? 'Encoded payload will materialize here...'
                    : 'Decoded data will appear here...'
                }
                readOnly
                onCopy={handleCopy}
                copied={copied}
                rows={12}
              />

              {/* Security Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <Info size={18} className="text-cyan-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div className="text-sm text-cyan-300">
                    <p className="font-bold mb-2 text-cyan-400 font-mono">[TRANSFORMATION_PROTOCOL]</p>
                    <ul className="space-y-1 text-xs font-mono text-cyan-300/80">
                      <li>• Quantum-matrix transformation algorithm</li>
                      <li>• Multi-layer encoding with integrity verification</li>
                      <li>• Autonomous operation - no external dependencies</li>
                      <li>• Reversible transformation with built-in validation</li>
                      <li>• Zero-knowledge client-side processing</li>
                      <li>• Portable across any system or account</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {status && (
          <div className="mt-6">
            <StatusMessage type={status.type} message={status.message} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;