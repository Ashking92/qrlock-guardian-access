
import React, { useState, useEffect } from 'react';
import { TestTube, Mail, Usb, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DemoUSBNotificationProps {
  demoMode: boolean;
  adminEmail: string;
}

const DemoUSBNotification: React.FC<DemoUSBNotificationProps> = ({ demoMode, adminEmail }) => {
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState(false);
  const [notificationsSent, setNotificationsSent] = useState(0);

  // Simulate USB insertion in demo mode
  const simulateUSBInsertion = async () => {
    if (!demoMode || !adminEmail) {
      toast({
        title: "Demo Configuration Required",
        description: "Please enable demo mode and set admin email in AI Agent settings.",
        variant: "destructive"
      });
      return;
    }

    setIsSimulating(true);
    
    try {
      // Simulate USB device detection
      const deviceName = `Demo USB Device ${Math.floor(Math.random() * 1000)}`;
      const timestamp = new Date().toISOString();
      
      // Send email notification (simulated)
      await sendEmailNotification(deviceName, timestamp);
      
      toast({
        title: "🔌 Demo USB Inserted",
        description: `${deviceName} detected! Admin notification sent to ${adminEmail}`,
      });
      
      setNotificationsSent(prev => prev + 1);
      
    } catch (error) {
      toast({
        title: "Demo Error",
        description: "Failed to simulate USB insertion notification.",
        variant: "destructive"
      });
    } finally {
      setIsSimulating(false);
    }
  };

  // Simulate email notification (in a real app, this would call your email service)
  const sendEmailNotification = async (deviceName: string, timestamp: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you would call your email service here
    console.log('Email notification sent:', {
      to: adminEmail,
      subject: 'QRLock Pro - USB Device Insertion Alert',
      body: `
        USB Device Alert
        
        Device: ${deviceName}
        Time: ${new Date(timestamp).toLocaleString()}
        Status: Mount Blocked - Authentication Required
        
        Please check the QRLock Pro dashboard for more details.
      `
    });
    
    // You could integrate with services like:
    // - EmailJS for client-side email sending
    // - Your own backend email service
    // - Third-party email APIs
  };

  // Auto-simulate USB insertions in demo mode (optional)
  useEffect(() => {
    if (!demoMode) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 10 seconds
        simulateUSBInsertion();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [demoMode, adminEmail]);

  if (!demoMode) return null;

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-2xl">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <TestTube className="w-8 h-8 text-orange-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-6">Demo USB Monitor</h3>

        {/* Demo Status */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Demo Mode Active</span>
          </div>
          <p className="text-sm text-orange-300">
            Simulating USB device insertions with email notifications
          </p>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Notifications</span>
            </div>
            <p className="text-2xl font-bold text-white">{notificationsSent}</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Admin Email</span>
            </div>
            <p className="text-xs text-green-400 truncate">{adminEmail || 'Not set'}</p>
          </div>
        </div>

        {/* Manual Simulation Button */}
        <button
          onClick={simulateUSBInsertion}
          disabled={isSimulating || !adminEmail}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSimulating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Usb className="w-5 h-5" />
              Simulate USB Insertion
            </>
          )}
        </button>

        {/* Instructions */}
        <div className="mt-4 bg-white/5 rounded-xl border border-white/10 p-4">
          <h4 className="text-sm font-semibold text-white mb-2">Demo Features:</h4>
          <ul className="text-xs text-slate-300 space-y-1 text-left">
            <li>• Manual USB insertion simulation</li>
            <li>• Automatic random USB events (20% chance every 10s)</li>
            <li>• Email notifications to admin</li>
            <li>• Real-time notification counter</li>
            <li>• Integration with QRLock Pro security system</li>
          </ul>
        </div>

        {!adminEmail && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Admin email required for notifications</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoUSBNotification;
