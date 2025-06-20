
import React, { useState } from 'react';
import { QrCode, RefreshCw, CheckCircle, XCircle, Shield, Copy, Eye, EyeOff } from 'lucide-react';

interface QRCodeDisplayProps {
  qrCodeUrl: string;
  currentOTP: string;
  onGenerateOTP: () => void;
  serverConnected: boolean;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCodeUrl,
  currentOTP,
  onGenerateOTP,
  serverConnected
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await onGenerateOTP();
    setTimeout(() => setIsGenerating(false), 1000);
  };

  const copyOTP = async () => {
    if (currentOTP) {
      await navigator.clipboard.writeText(currentOTP);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-2xl">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <QrCode className="w-8 h-8 text-cyan-400" />
            {currentOTP && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-6">QR Code Authentication</h3>

        {/* QR Code Display */}
        <div className="mb-6">
          {qrCodeUrl ? (
            <div className="relative inline-block">
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code with embedded OTP" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full">
                <CheckCircle className="w-4 h-4" />
              </div>
              {/* Security indicator for embedded OTP */}
              <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm font-medium">Secure OTP Embedded</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-48 h-48 mx-auto bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-500 flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No QR Code Generated</p>
              </div>
            </div>
          )}
        </div>

        {/* OTP Display (Optional) */}
        {currentOTP && (
          <div className="mb-4 p-3 bg-gray-800/50 border border-gray-600/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">OTP Code:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOTP(!showOTP)}
                  className="text-gray-400 hover:text-white"
                >
                  {showOTP ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={copyOTP}
                  className="text-gray-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 font-mono text-lg text-white">
              {showOTP ? currentOTP : '••••••'}
            </div>
            {copied && (
              <p className="text-green-400 text-xs mt-1">Copied to clipboard!</p>
            )}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!serverConnected || isGenerating}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating Secure QR...
            </>
          ) : (
            <>
              <QrCode className="w-5 h-5" />
              Generate Secure QR Code
            </>
          )}
        </button>

        {!serverConnected && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-red-400">
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Server Offline</span>
            </div>
          </div>
        )}

        {/* Enhanced Instructions */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <h4 className="text-sm font-semibold text-white mb-2">How to use:</h4>
          <ol className="text-xs text-slate-300 space-y-1 text-left">
            <li>1. Click "Generate Secure QR Code" to create authentication code</li>
            <li>2. Scan QR code with your mobile device to reveal OTP</li>
            <li>3. Enter the extracted OTP in the verification form</li>
            <li>4. USB access will be granted and auto-mounting enabled</li>
            <li>5. Device mounting is blocked until successful authentication</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
