
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface USBDevice {
  name: string;
  vendor: string;
  product: string;
  serial?: string;
}

interface USBEvent {
  timestamp: string;
  action: string;
  device?: string;
  status: 'connected' | 'disconnected' | 'blocked' | 'allowed';
}

export const useUSBDetection = () => {
  const { toast } = useToast();
  const [usbDevices, setUsbDevices] = useState<USBDevice[]>([]);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [usbEvents, setUsbEvents] = useState<USBEvent[]>([]);
  const [serverConnected, setServerConnected] = useState<boolean>(false);

  // Check server connection
  const checkServerConnection = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usb-status');
      const wasConnected = serverConnected;
      const isConnected = response.ok;
      
      setServerConnected(isConnected);
      
      if (!wasConnected && isConnected) {
        toast({
          title: "Server Connected",
          description: "Backend server is now online and ready.",
        });
      } else if (wasConnected && !isConnected) {
        toast({
          title: "Server Disconnected",
          description: "Lost connection to backend server.",
          variant: "destructive"
        });
      }
      
      return isConnected;
    } catch (error) {
      setServerConnected(false);
      return false;
    }
  }, [serverConnected, toast]);

  // Fetch USB devices
  const fetchUSBDevices = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usb-status');
      if (response.ok) {
        const data = await response.json();
        setUsbDevices(data.devices || []);
        setIsMonitoring(data.monitoring || false);
      }
    } catch (error) {
      console.error('Failed to fetch USB devices:', error);
    }
  }, []);

  // Fetch USB events
  const fetchUSBEvents = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usb-events');
      if (response.ok) {
        const data = await response.json();
        setUsbEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch USB events:', error);
    }
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/start-monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setIsMonitoring(true);
        toast({
          title: "Monitoring Started",
          description: "USB device monitoring is now active.",
        });
        
        // Start polling for devices and events
        fetchUSBDevices();
        fetchUSBEvents();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start USB monitoring.",
        variant: "destructive"
      });
    }
  }, [toast, fetchUSBDevices, fetchUSBEvents]);

  // Stop monitoring
  const stopMonitoring = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stop-monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setIsMonitoring(false);
        toast({
          title: "Monitoring Stopped",
          description: "USB device monitoring has been disabled.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop USB monitoring.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Detect USB device changes
  const detectUSBChanges = useCallback(async () => {
    if (!isMonitoring || !serverConnected) return;

    try {
      const response = await fetch('http://localhost:5000/api/usb-status');
      if (response.ok) {
        const data = await response.json();
        const newDevices = data.devices || [];
        
        // Check for new devices
        const newDeviceCount = newDevices.length;
        const currentDeviceCount = usbDevices.length;
        
        if (newDeviceCount > currentDeviceCount) {
          // New device connected
          const newDevice = newDevices[newDevices.length - 1];
          
          toast({
            title: "USB Device Detected",
            description: `New USB device connected: ${newDevice?.name || 'Unknown Device'}`,
            variant: "destructive"
          });
          
          // Automatically generate OTP when new USB device is detected
          try {
            await fetch('http://localhost:5000/api/generate-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
          } catch (error) {
            console.error('Failed to auto-generate OTP:', error);
          }
        }
        
        setUsbDevices(newDevices);
        
        // Fetch updated events
        fetchUSBEvents();
      }
    } catch (error) {
      console.error('USB detection error:', error);
    }
  }, [isMonitoring, serverConnected, usbDevices.length, toast, fetchUSBEvents]);

  // Initialize and setup polling
  useEffect(() => {
    // Initial connection check
    checkServerConnection();
    
    // Setup intervals
    const connectionInterval = setInterval(checkServerConnection, 5000);
    const deviceInterval = setInterval(fetchUSBDevices, 2000);
    const eventInterval = setInterval(fetchUSBEvents, 3000);
    const changeDetectionInterval = setInterval(detectUSBChanges, 500);
    
    return () => {
      clearInterval(connectionInterval);
      clearInterval(deviceInterval);
      clearInterval(eventInterval);
      clearInterval(changeDetectionInterval);
    };
  }, [checkServerConnection, fetchUSBDevices, fetchUSBEvents, detectUSBChanges]);

  // Initial data fetch when server connects
  useEffect(() => {
    if (serverConnected) {
      fetchUSBDevices();
      fetchUSBEvents();
    }
  }, [serverConnected, fetchUSBDevices, fetchUSBEvents]);

  return {
    usbDevices,
    isMonitoring,
    usbEvents,
    serverConnected,
    startMonitoring,
    stopMonitoring,
    fetchUSBDevices,
    fetchUSBEvents
  };
};
