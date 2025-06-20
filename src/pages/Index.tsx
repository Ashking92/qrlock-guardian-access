import React, { useState, useEffect } from 'react';
import { Shield, Wifi, WifiOff, Activity, Settings, Lock, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import USBDetectionPanel from '@/components/USBDetectionPanel';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import OTPEntryForm from '@/components/OTPEntryForm';
import SecurityStatus from '@/components/SecurityStatus';
import Footer from '@/components/Footer';
import { useUSBDetection } from '@/hooks/useUSBDetection';

const Index = () => {
  const { toast } = useToast();
  const [currentOTP, setCurrentOTP] = useState<string>('');
  const [qrCodeUrl, setQRCodeUrl] = useState<string>('');
  const [isUSBBlocked, setIsUSBBlocked] = useState<boolean>(true);
  const [serverConnected, setServerConnected] = useState<boolean>(false);
  
  const { 
    usbDevices, 
    isMonitoring, 
    startMonitoring, 
    stopMonitoring, 
    usbEvents 
  } = useUSBDetection();

  // Check server connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/usb-status');
        setServerConnected(response.ok);
      } catch (error) {
        setServerConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const generateOTP = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentOTP(data.otp);
        setQRCodeUrl(data.qr_code_url);
        toast({
          title: "QR Code Generated",
          description: "New OTP generated successfully. Scan QR code or enter OTP manually.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate OTP. Please check server connection.",
        variant: "destructive"
      });
    }
  };

  const verifyOTP = async (otp: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsUSBBlocked(false);
        toast({
          title: "Access Granted",
          description: "USB access has been unlocked successfully!",
        });
      } else {
        toast({
          title: "Access Denied",
          description: data.message || "Invalid OTP. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please check server connection.",
        variant: "destructive"
      });
    }
  };

  const toggleUSBBlocking = async () => {
    try {
      const endpoint = isUSBBlocked ? '/api/unblock-usb' : '/api/block-usb';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setIsUSBBlocked(!isUSBBlocked);
        toast({
          title: isUSBBlocked ? "USB Unblocked" : "USB Blocked",
          description: `USB access has been ${isUSBBlocked ? 'enabled' : 'disabled'}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle USB blocking.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-cyan-500/10 to-blue-500/10 rounded-full animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
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
            Advanced USB Security System
          </p>
          
          {/* Server Status */}
          <div className="flex items-center justify-center gap-2 mb-8">
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
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={generateOTP}
            disabled={!serverConnected}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Activity className="w-5 h-5" />
            Generate New QR
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
            {isUSBBlocked ? 'Unlock USB' : 'Lock USB'}
          </button>

          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            disabled={!serverConnected}
            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
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
