
import React from 'react';

interface DemoUSBNotificationProps {
  demoMode: boolean;
  adminEmail: string;
}

const DemoUSBNotification: React.FC<DemoUSBNotificationProps> = ({ demoMode, adminEmail }) => {
  // Demo mode is disabled - component doesn't render anything
  return null;
};

export default DemoUSBNotification;
