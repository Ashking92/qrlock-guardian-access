
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

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

export const useUSBDetection = () => {
  const { toast } = useToast();
  const [usbDevices, setUsbDevices] = useState<USBDevice[]>([]);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [usbEvents, setUsbEvents] = useState<USBEvent[]>([]);
  const [serverConnected, setServerConnected] = useState<boolean>(false);
  const [lastDeviceCount, setLastDeviceCount] = useState<number>(0);

  // Check server connection with enhanced error handling
  const checkServerConnection = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usb-status', {
        timeout: 3000,
        headers: { 'Cache-Control': 'no-cache' }
      });
      const wasConnected = serverConnected;
      const isConnected = response.ok;
      
      setServerConnected(isConnected);
      
      if (!wasConnected && isConnected) {
        toast({
          title: "Server Connected",
          description: "USB security system is now active.",
        });
        // Enable USB blocking immediately when server connects
        enableUSBBlocking();
      } else if (wasConnected && !isConnected) {
        toast({
          title: "Server Disconnected",
          description: "USB protection may be compromised.",
          variant: "destructive"
        });
      }
      
      return isConnected;
    } catch (error) {
      console.error('Server connection check failed:', error);
      setServerConnected(false);
      return false;
    }
  }, [serverConnected, toast]);

  // Enable USB blocking to prevent auto-mounting
  const enableUSBBlocking = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/enable-usb-blocking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log('USB auto-mounting blocked successfully');
      }
    } catch (error) {
      console.error('Failed to enable USB blocking:', error);
    }
  }, []);

  // Fetch USB devices with immediate detection
  const fetchUSBDevices = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usb-devices', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (response.ok) {
        const data = await response.json();
        const devices = data.devices || [];
        
        // Check for new device insertions
        if (devices.length > lastDeviceCount) {
          const newDevice = devices[devices.length - 1];
          
          toast({
            title: "🔌 USB Device Detected",
            description: `Device: ${newDevice?.name || 'Unknown Device'} - Mount Blocked`,
            variant: "destructive"
          });

          // Log insertion event
          const insertEvent: USBEvent = {
            timestamp: new Date().toISOString(),
            action: 'Device Inserted',
            device: newDevice?.name || 'Unknown Device',
            status: 'mount_blocked'
          };
          
          setUsbEvents(prev => [insertEvent, ...prev]);
          
          // Auto-generate OTP for immediate authentication
          try {
            await fetch('http://localhost:5000/api/generate-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
          } catch (error) {
            console.error('Failed to auto-generate OTP:', error);
          }
        }
        
        setUsbDevices(devices);
        setLastDeviceCount(devices.length);
        setIsMonitoring(data.monitoring || false);
      }
    } catch (error) {
      console.error('Failed to fetch USB devices:', error);
    }
  }, [lastDeviceCount, toast]);

  // Enhanced USB events fetching
  const fetchUSBEvents = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usb-events', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.new_events && data.new_events.length > 0) {
          setUsbEvents(prev => [...data.new_events, ...prev]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch USB events:', error);
    }
  }, []);

  // Start enhanced monitoring
  const startMonitoring = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/start-monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockAutoMount: true })
      });
      
      if (response.ok) {
        setIsMonitoring(true);
        toast({
          title: "Enhanced Monitoring Started",
          description: "USB auto-mounting blocked. Authentication required for device access.",
        });
        
        // Enable immediate blocking
        enableUSBBlocking();
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
  }, [toast, fetchUSBDevices, fetchUSBEvents, enableUSBBlocking]);

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
          description: "USB auto-mounting restored to system default.",
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

  // Real-time USB change detection with faster polling
  const detectUSBChanges = useCallback(async () => {
    if (!isMonitoring || !serverConnected) return;

    try {
      const response = await fetch('http://localhost:5000/api/usb-realtime-status', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (response.ok) {
        const data = await response.json();
        const newDevices = data.devices || [];
        
        // Immediate device detection and blocking
        if (newDevices.length !== usbDevices.length) {
          console.log('USB device change detected:', newDevices);
          setUsbDevices(newDevices);
          
          if (newDevices.length > usbDevices.length) {
            // New device connected - immediately block mounting
            const latestDevice = newDevices[newDevices.length - 1];
            
            toast({
              title: "🚫 Device Mount Blocked",
              description: `${latestDevice?.name || 'USB Device'} detected - Authentication required`,
              variant: "destructive"
            });
            
            // Block the specific device
            try {
              await fetch('http://localhost:5000/api/block-device-mount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceId: latestDevice?.serial || 'unknown' })
              });
            } catch (error) {
              console.error('Failed to block device mount:', error);
            }
          }
        }
        
        fetchUSBEvents();
      }
    } catch (error) {
      console.error('Real-time USB detection error:', error);
    }
  }, [isMonitoring, serverConnected, usbDevices.length, toast, fetchUSBEvents]);

  // Enhanced initialization with faster intervals
  useEffect(() => {
    checkServerConnection();
    
    // Much faster polling for immediate detection
    const connectionInterval = setInterval(checkServerConnection, 3000);
    const deviceInterval = setInterval(fetchUSBDevices, 500); // Very fast for immediate detection
    const eventInterval = setInterval(fetchUSBEvents, 1000);
    const changeDetectionInterval = setInterval(detectUSBChanges, 250); // Ultra-fast detection
    
    return () => {
      clearInterval(connectionInterval);
      clearInterval(deviceInterval);
      clearInterval(eventInterval);
      clearInterval(changeDetectionInterval);
    };
  }, [checkServerConnection, fetchUSBDevices, fetchUSBEvents, detectUSBChanges]);

  // Auto-start monitoring when server connects
  useEffect(() => {
    if (serverConnected && !isMonitoring) {
      // Auto-start monitoring for immediate protection
      setTimeout(() => {
        startMonitoring();
      }, 1000);
    }
  }, [serverConnected, isMonitoring, startMonitoring]);

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
