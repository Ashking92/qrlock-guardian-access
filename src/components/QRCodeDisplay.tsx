
import React, { useState } from 'react';
import { QrCode, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';

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

  const handleGenerate = async () => {
    setIsGenerating(true);
    await onGenerateOTP();
    setTimeout(() => setIsGenerating(false), 1000);
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
                  alt="QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full">
                <CheckCircle className="w-4 h-4" />
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

        {/* OTP Display */}
        {currentOTP && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Current OTP</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white tracking-wider">
              {currentOTP}
            </div>
            <p className="text-sm text-blue-300 mt-2">
              Valid for 5 minutes
            </p>
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
              Generating...
            </>
          ) : (
            <>
              <QrCode className="w-5 h-5" />
              Generate QR Code
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

        {/* Instructions */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <h4 className="text-sm font-semibold text-white mb-2">How to use:</h4>
          <ol className="text-xs text-slate-300 space-y-1 text-left">
            <li>1. Click "Generate QR Code" to create a new OTP</li>
            <li>2. Scan the QR code with your mobile device</li>
            <li>3. Enter the 6-digit OTP in the verification form</li>
            <li>4. USB access will be granted upon successful verification</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
