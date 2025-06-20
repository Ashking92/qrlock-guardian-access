
import React from 'react';
import { Shield, Lock, Unlock, Monitor, MonitorOff, Wifi, WifiOff, Usb, Activity } from 'lucide-react';

interface SecurityStatusProps {
  isUSBBlocked: boolean;
  isMonitoring: boolean;
  serverConnected: boolean;
  usbDeviceCount: number;
}

const SecurityStatus: React.FC<SecurityStatusProps> = ({
  isUSBBlocked,
  isMonitoring,
  serverConnected,
  usbDeviceCount
}) => {
  const getSecurityLevel = () => {
    if (!serverConnected) return { level: 'Critical', color: 'red', score: 0 };
    if (!isMonitoring) return { level: 'Low', color: 'yellow', score: 25 };
    if (isUSBBlocked) return { level: 'High', color: 'green', score: 85 };
    return { level: 'Medium', color: 'orange', score: 60 };
  };

  const securityInfo = getSecurityLevel();

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-2xl">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Shield className={`w-12 h-12 ${
              securityInfo.color === 'green' ? 'text-green-400' :
              securityInfo.color === 'yellow' ? 'text-yellow-400' :
              securityInfo.color === 'orange' ? 'text-orange-400' :
              'text-red-400'
            }`} />
            <div className={`absolute inset-0 w-12 h-12 rounded-full animate-ping ${
              securityInfo.color === 'green' ? 'bg-green-400/20' :
              securityInfo.color === 'yellow' ? 'bg-yellow-400/20' :
              securityInfo.color === 'orange' ? 'bg-orange-400/20' :
              'bg-red-400/20'
            }`} />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Security Status</h3>
        
        {/* Security Level */}
        <div className="mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            securityInfo.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            securityInfo.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            securityInfo.color === 'orange' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
            'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            <Activity className="w-4 h-4" />
            {securityInfo.level} Security
          </div>
          
          {/* Security Score */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Security Score</span>
              <span>{securityInfo.score}/100</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  securityInfo.color === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  securityInfo.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                  securityInfo.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                  'bg-gradient-to-r from-red-500 to-rose-500'
                }`}
                style={{ width: `${securityInfo.score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* USB Status */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-center mb-2">
              {isUSBBlocked ? (
                <Lock className="w-6 h-6 text-red-400" />
              ) : (
                <Unlock className="w-6 h-6 text-green-400" />
              )}
            </div>
            <div className="text-sm font-medium text-white">USB Access</div>
            <div className={`text-xs ${isUSBBlocked ? 'text-red-400' : 'text-green-400'}`}>
              {isUSBBlocked ? 'Blocked' : 'Allowed'}
            </div>
          </div>

          {/* Monitoring Status */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-center mb-2">
              {isMonitoring ? (
                <Monitor className="w-6 h-6 text-blue-400" />
              ) : (
                <MonitorOff className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="text-sm font-medium text-white">Monitoring</div>
            <div className={`text-xs ${isMonitoring ? 'text-blue-400' : 'text-gray-400'}`}>
              {isMonitoring ? 'Active' : 'Inactive'}
            </div>
          </div>

          {/* Server Status */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-center mb-2">
              {serverConnected ? (
                <Wifi className="w-6 h-6 text-green-400" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-400" />
              )}
            </div>
            <div className="text-sm font-medium text-white">Server</div>
            <div className={`text-xs ${serverConnected ? 'text-green-400' : 'text-red-400'}`}>
              {serverConnected ? 'Connected' : 'Offline'}
            </div>
          </div>

          {/* USB Devices */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-center mb-2">
              <Usb className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-sm font-medium text-white">USB Devices</div>
            <div className="text-xs text-cyan-400">
              {usbDeviceCount} Connected
            </div>
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-sm font-semibold text-white mb-3">Security Recommendations</h4>
          <div className="space-y-2 text-xs text-left">
            {!serverConnected && (
              <div className="flex items-center gap-2 text-red-300">
                <div className="w-1 h-1 bg-red-400 rounded-full" />
                <span>Restore server connection</span>
              </div>
            )}
            {!isMonitoring && serverConnected && (
              <div className="flex items-center gap-2 text-yellow-300">
                <div className="w-1 h-1 bg-yellow-400 rounded-full" />
                <span>Enable USB monitoring</span>
              </div>
            )}
            {!isUSBBlocked && (
              <div className="flex items-center gap-2 text-orange-300">
                <div className="w-1 h-1 bg-orange-400 rounded-full" />
                <span>Consider blocking USB access</span>
              </div>
            )}
            {serverConnected && isMonitoring && isUSBBlocked && (
              <div className="flex items-center gap-2 text-green-300">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                <span>All security measures active</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityStatus;
