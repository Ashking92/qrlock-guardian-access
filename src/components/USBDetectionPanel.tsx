
import React from 'react';
import { Usb, Monitor, MonitorOff, Clock, Shield, AlertTriangle, Lock, Unlock } from 'lucide-react';

interface USBDevice {
  name: string;
  vendor: string;
  product: string;
  serial?: string;
  mountPath?: string;
  blocked?: boolean;
}

interface USBEvent {
  timestamp: string;
  action: string;
  device?: string;
  status: 'connected' | 'disconnected' | 'blocked' | 'allowed' | 'mount_blocked';
}

interface USBDetectionPanelProps {
  usbDevices: USBDevice[];
  isMonitoring: boolean;
  usbEvents: USBEvent[];
  serverConnected: boolean;
}

const USBDetectionPanel: React.FC<USBDetectionPanelProps> = ({
  usbDevices,
  isMonitoring,
  usbEvents,
  serverConnected
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Usb className="w-4 h-4 text-blue-400" />;
      case 'disconnected':
        return <MonitorOff className="w-4 h-4 text-gray-400" />;
      case 'blocked':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'allowed':
        return <Shield className="w-4 h-4 text-green-400" />;
      case 'mount_blocked':
        return <Lock className="w-4 h-4 text-orange-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'border-blue-500/50 bg-blue-500/10';
      case 'disconnected':
        return 'border-gray-500/50 bg-gray-500/10';
      case 'blocked':
        return 'border-red-500/50 bg-red-500/10';
      case 'allowed':
        return 'border-green-500/50 bg-green-500/10';
      case 'mount_blocked':
        return 'border-orange-500/50 bg-orange-500/10';
      default:
        return 'border-yellow-500/50 bg-yellow-500/10';
    }
  };

  const getDeviceStatusDisplay = (device: USBDevice) => {
    if (device.blocked) {
      return {
        icon: <Lock className="w-4 h-4 text-red-400" />,
        text: 'Mount Blocked',
        color: 'text-red-400'
      };
    } else if (device.mountPath) {
      return {
        icon: <Unlock className="w-4 h-4 text-green-400" />,
        text: 'Mounted',
        color: 'text-green-400'
      };
    } else {
      return {
        icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
        text: 'Auth Required',
        color: 'text-orange-400'
      };
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="relative">
            <Monitor className="w-8 h-8 text-blue-400" />
            {isMonitoring && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
          Real-time USB Detection
        </h2>
        
        <div className="flex items-center gap-2">
          {isMonitoring ? (
            <>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 font-medium">Protection Active</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="text-gray-400 font-medium">Protection Inactive</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Devices with Mount Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Usb className="w-5 h-5 text-blue-400" />
            Connected Devices ({usbDevices.length})
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {usbDevices.length > 0 ? (
              usbDevices.map((device, index) => {
                const status = getDeviceStatusDisplay(device);
                return (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{device.name}</h4>
                        <p className="text-sm text-slate-300">Vendor: {device.vendor}</p>
                        <p className="text-sm text-slate-300">Product: {device.product}</p>
                        {device.serial && (
                          <p className="text-xs text-slate-400">Serial: {device.serial}</p>
                        )}
                        {device.mountPath && (
                          <p className="text-xs text-green-400">Mount: {device.mountPath}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                          <span className="text-xs text-blue-400 font-medium">Connected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {status.icon}
                          <span className={`text-xs font-medium ${status.color}`}>{status.text}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Usb className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No USB devices detected</p>
                <p className="text-sm text-gray-500 mt-1">Insert a USB device for immediate detection</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Security Event Log */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Security Event Log ({usbEvents.length})
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {usbEvents.length > 0 ? (
              usbEvents.slice(-15).reverse().map((event, index) => (
                <div key={index} className={`rounded-xl p-4 border transition-all duration-300 ${getStatusColor(event.status)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(event.status)}
                        <span className="font-medium text-white capitalize">{event.action}</span>
                      </div>
                      {event.device && (
                        <p className="text-sm text-slate-300">{event.device}</p>
                      )}
                      <p className="text-xs text-slate-400">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                      event.status === 'allowed' ? 'bg-green-500/20 text-green-400' :
                      event.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                      event.status === 'mount_blocked' ? 'bg-orange-500/20 text-orange-400' :
                      event.status === 'connected' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {event.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No security events logged</p>
                <p className="text-sm text-gray-500 mt-1">Events will appear as USB devices are detected</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {!serverConnected && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Server Connection Lost</span>
          </div>
          <p className="text-sm text-red-300 mt-1">
            USB protection may be compromised. Please check backend server status.
          </p>
        </div>
      )}
    </div>
  );
};

export default USBDetectionPanel;
