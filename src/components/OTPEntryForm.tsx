
import React, { useState } from 'react';
import { Shield, Send, Lock, CheckCircle, XCircle } from 'lucide-react';

interface OTPEntryFormProps {
  onVerifyOTP: (otp: string) => void;
  serverConnected: boolean;
}

const OTPEntryForm: React.FC<OTPEntryFormProps> = ({
  onVerifyOTP,
  serverConnected
}) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsVerifying(true);
    setVerificationStatus('idle');
    
    try {
      await onVerifyOTP(otp);
      setVerificationStatus('success');
      setOtp('');
    } catch (error) {
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
      setTimeout(() => setVerificationStatus('idle'), 3000);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const isValidOTP = otp.length === 6;

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-2xl">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Shield className="w-8 h-8 text-green-400" />
            {verificationStatus === 'success' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-6">OTP Verification</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Enter 6-Digit OTP
            </label>
            <div className="relative">
              <input
                type="text"
                value={otp}
                onChange={handleOTPChange}
                placeholder="000000"
                maxLength={6}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-center text-2xl font-mono tracking-widest placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                disabled={!serverConnected || isVerifying}
              />
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            
            {/* OTP Progress Indicator */}
            <div className="flex justify-center gap-1 mt-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index < otp.length
                      ? 'bg-green-400 shadow-lg shadow-green-400/50'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Verification Status */}
          {verificationStatus !== 'idle' && (
            <div className={`p-3 rounded-xl border ${
              verificationStatus === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="flex items-center justify-center gap-2">
                {verificationStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Access Granted!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span className="font-medium">Invalid OTP</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValidOTP || !serverConnected || isVerifying}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Verify OTP
              </>
            )}
          </button>
        </form>

        {!serverConnected && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-red-400">
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Server Offline</span>
            </div>
          </div>
        )}

        {/* Security Note */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <h4 className="text-sm font-semibold text-white mb-2">Security Features:</h4>
          <ul className="text-xs text-slate-300 space-y-1 text-left">
            <li>• OTP expires in 5 minutes</li>
            <li>• Single-use authentication</li>
            <li>• All attempts are logged</li>
            <li>• Secure encryption protocols</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OTPEntryForm;
