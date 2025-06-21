import React, { useState, useEffect } from 'react';
import { Shield, Wifi, WifiOff, Activity, Settings, Lock, Unlock, AlertTriangle, Download, History, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import USBDetectionPanel from '@/components/USBDetectionPanel';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import OTPEntryForm from '@/components/OTPEntryForm';
import SecurityStatus from '@/components/SecurityStatus';
import AIAgent from '@/components/AIAgent';
import DemoUSBNotification from '@/components/DemoUSBNotification';
import Footer from '@/components/Footer';
import { useUSBDetection } from '@/hooks/useUSBDetection';

const Index = () => {
  const { toast } = useToast();
  const [currentOTP, setCurrentOTP] = useState<string>('');
  const [qrCodeUrl, setQRCodeUrl] = useState<string>('');
  const [isUSBBlocked, setIsUSBBlocked] = useState<boolean>(true);
  const [serverConnected, setServerConnected] = useState<boolean>(false);
  const [autoMountBlocked, setAutoMountBlocked] = useState<boolean>(true);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  
  const { 
    usbDevices, 
    isMonitoring, 
    startMonitoring, 
    stopMonitoring, 
    usbEvents 
  } = useUSBDetection();

  // Load demo settings
  useEffect(() => {
    const savedDemoMode = localStorage.getItem('demo_mode') === 'true';
    const savedAdminEmail = localStorage.getItem('admin_email') || '';
    setDemoMode(savedDemoMode);
    setAdminEmail(savedAdminEmail);
  }, []);

  // Enhanced server connection check
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/usb-status', {
          headers: { 'Cache-Control': 'no-cache' }
        });
        const wasConnected = serverConnected;
        const isConnected = response.ok;
        
        setServerConnected(isConnected);
        
        if (isConnected && response.ok) {
          const data = await response.json();
          setIsUSBBlocked(data.usb_blocked || true);
          setAutoMountBlocked(data.auto_mount_blocked || true);
        }
        
        if (!wasConnected && isConnected) {
          // Enable USB blocking immediately when server comes online
          enableSystemProtection();
        }
      } catch (error) {
        console.error('Connection check failed:', error);
        setServerConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 2000);
    return () => clearInterval(interval);
  }, [serverConnected]);

  // Enable comprehensive USB protection
  const enableSystemProtection = async () => {
    try {
      await fetch('http://localhost:5000/api/enable-protection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          blockAutoMount: true,
          requireAuthentication: true 
        })
      });
    } catch (error) {
      console.error('Failed to enable system protection:', error);
    }
  };

  // Fixed QR code generation using existing OTP endpoint
  const generateOTP = async () => {
    try {
      // First generate OTP using existing endpoint
      const otpResponse = await fetch('http://localhost:5000/api/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          security_level: securityLevel,
          include_qr: true 
        })
      });
      
      if (otpResponse.ok) {
        const otpData = await otpResponse.json();
        setCurrentOTP(otpData.otp);
        
        // Create QR code URL with the OTP embedded
        const qrData = JSON.stringify({
          otp: otpData.otp,
          timestamp: new Date().toISOString(),
          security_level: securityLevel,
          device_id: 'web-client'
        });
        
        // Generate QR code using a QR code API service
        const qrCodeDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
        setQRCodeUrl(qrCodeDataUrl);
        
        toast({
          title: "🔐 Secure QR Generated",
          description: "QR code generated with embedded authentication token. Scan to access USB system.",
        });
      } else {
        throw new Error('Failed to generate OTP');
      }
    } catch (error) {
      console.error('QR generation error:', error);
      toast({
        title: "QR Generation Failed",
        description: "Unable to generate QR code. Please check server connection.",
        variant: "destructive"
      });
    }
  };

  // Enhanced OTP verification with mount control
  const verifyOTP = async (otp: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp-and-mount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          otp,
          enableAutoMount: true,
          deviceAccess: true 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsUSBBlocked(false);
        setAutoMountBlocked(false);
        
        toast({
          title: "✅ Access Granted",
          description: "USB access unlocked! Auto-mounting enabled for connected devices.",
        });
        
        // Clear OTP after successful verification
        setCurrentOTP('');
        setQRCodeUrl('');
      } else {
        toast({
          title: "❌ Access Denied",
          description: data.message || "Invalid authentication token. USB remains blocked.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Enhanced USB blocking toggle
  const toggleUSBBlocking = async () => {
    try {
      const endpoint = isUSBBlocked ? '/api/unblock-usb-system' : '/api/block-usb-system';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          blockAutoMount: !isUSBBlocked,
          systemWide: true 
        })
      });
      
      if (response.ok) {
        const newBlockedState = !isUSBBlocked;
        setIsUSBBlocked(newBlockedState);
        setAutoMountBlocked(newBlockedState);
        
        toast({
          title: newBlockedState ? "🔒 System Locked" : "🔓 System Unlocked",
          description: `USB ${newBlockedState ? 'auto-mounting blocked' : 'auto-mounting enabled'} system-wide.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle system protection.",
        variant: "destructive"
      });
    }
  };

  // New feature: Security level management
  const changeSecurityLevel = (level: 'low' | 'medium' | 'high') => {
    setSecurityLevel(level);
    toast({
      title: "Security Level Updated",
      description: `Security set to ${level.toUpperCase()} level`,
    });
  };

  // New feature: Export security logs
  const exportSecurityLogs = () => {
    const logs = {
      events: usbEvents,
      devices: usbDevices,
      timestamp: new Date().toISOString(),
      security_level: securityLevel
    };
    
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usb-security-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast({
      title: "Logs Exported",
      description: "Security logs downloaded successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-cyan-500/10 to-blue-500/10 rounded-full animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Enhanced Header with Admin Toggle */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Shield className="w-16 h-16 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 bg-blue-400/20 rounded-full animate-ping" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent mb-4">
            QRLock Pro
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Advanced USB Security & Mount Protection
          </p>
          
          {/* Admin Mode Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => setAdminMode(!adminMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                adminMode 
                  ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400' 
                  : 'bg-gray-700/20 border border-gray-600/50 text-gray-400'
              }`}
            >
              <User className="w-4 h-4" />
              Admin Mode
            </button>
          </div>
          
          {/* Enhanced Server Status */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              {serverConnected ? (
                <>
                  <Wifi className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Server Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-medium">Server Disconnected</span>
                </>
              )}
            </div>
            
            {autoMountBlocked && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400 font-medium">Auto-Mount Blocked</span>
              </div>
            )}
          </div>
        </div>

        {/* Security Level Selector */}
        {adminMode && (
          <div className="mb-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Security Level</h3>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => changeSecurityLevel(level)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    securityLevel === level
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Dashboard Grid - Updated to include Demo USB component */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
          {/* Security Status Card */}
          <div className="lg:col-span-1">
            <SecurityStatus 
              isUSBBlocked={isUSBBlocked}
              isMonitoring={isMonitoring}
              serverConnected={serverConnected}
              usbDeviceCount={usbDevices.length}
            />
          </div>

          {/* QR Code Display Card */}
          <div className="lg:col-span-1">
            <QRCodeDisplay 
              qrCodeUrl={qrCodeUrl}
              currentOTP={currentOTP}
              onGenerateOTP={generateOTP}
              serverConnected={serverConnected}
            />
          </div>

          {/* OTP Entry Card */}
          <div className="lg:col-span-1">
            <OTPEntryForm 
              onVerifyOTP={verifyOTP}
              serverConnected={serverConnected}
            />
          </div>

          {/* AI Agent Card */}
          <div className="lg:col-span-1">
            <AIAgent serverConnected={serverConnected} />
          </div>

          {/* Demo USB Notification Card */}
          <div className="lg:col-span-1">
            <DemoUSBNotification 
              demoMode={demoMode}
              adminEmail={adminEmail}
            />
          </div>
        </div>

        {/* Enhanced Control Buttons with New Features */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={generateOTP}
            disabled={!serverConnected}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Activity className="w-5 h-5" />
            Generate Secure QR
          </button>

          <button
            onClick={toggleUSBBlocking}
            disabled={!serverConnected}
            className={`${
              isUSBBlocked 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600'
            } disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-lg disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {isUSBBlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            {isUSBBlocked ? 'Enable USB System' : 'Lock USB System'}
          </button>

          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            disabled={!serverConnected}
            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            {isMonitoring ? 'Stop Protection' : 'Start Protection'}
          </button>
        </div>

        {/* USB Detection Panel */}
        <USBDetectionPanel 
          usbDevices={usbDevices}
          isMonitoring={isMonitoring}
          usbEvents={usbEvents}
          serverConnected={serverConnected}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
