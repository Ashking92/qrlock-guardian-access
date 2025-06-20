
# QRLock Pro - Advanced USB Security System

![QRLock Pro Banner](https://via.placeholder.com/800x300/1e293b/3b82f6?text=QRLock+Pro+-+Advanced+USB+Security+System)

## 🔒 Overview

QRLock Pro is an advanced USB security system that provides real-time monitoring, QR code authentication, and comprehensive access control for USB devices. Built with modern web technologies, it offers enterprise-grade security features with an intuitive user interface.

## ✨ Key Features

### 🛡️ Security Features
- **Real-time USB Device Detection** - Instantly detect when USB devices are connected or disconnected
- **QR Code Authentication** - Generate secure QR codes for mobile authentication
- **OTP Verification System** - Time-based one-time password verification (5-minute expiry)
- **USB Access Control** - Block/unblock USB access with granular control
- **Security Event Logging** - Comprehensive audit trail of all USB activities
- **Live Security Status Dashboard** - Real-time security score and status monitoring

### 📱 User Experience
- **Modern Glassmorphism UI** - Beautiful, modern interface with backdrop blur effects
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Notifications** - Toast notifications for important security events
- **Live Status Indicators** - Visual indicators for connection status and security level
- **Animated UI Elements** - Smooth animations and transitions for better UX

### 🔧 Advanced Monitoring
- **Device Information Display** - Detailed USB device information (vendor, product, serial)
- **Connection Status Tracking** - Monitor connected/disconnected/blocked/allowed states
- **Event Timeline** - Chronological view of all security events
- **Server Connection Monitoring** - Real-time backend server status
- **Security Score Calculation** - Dynamic security scoring based on current settings

## 🚀 How It Works

1. **Device Detection**: The system continuously monitors for USB device connections
2. **Security Assessment**: Each device connection triggers a security evaluation
3. **Authentication Required**: Users must authenticate via QR code or OTP for USB access
4. **Access Control**: Based on authentication, USB access is granted or denied
5. **Event Logging**: All activities are logged for security audit purposes
6. **Real-time Updates**: Dashboard updates in real-time with current security status

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with enhanced IDE support
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **shadcn/ui** - High-quality, accessible UI components
- **Lucide React** - Beautiful, consistent icon library
- **React Router** - Client-side routing for single-page application
- **React Query** - Powerful data fetching and state management

### Backend (Required)
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web framework for API endpoints
- **USB Detection Library** - Native USB device monitoring
- **QR Code Generation** - Dynamic QR code creation
- **OTP Generation** - Secure time-based authentication

### Development Tools
- **ESLint** - Code linting for consistent code quality
- **Prettier** - Code formatting for consistent style
- **TypeScript Compiler** - Type checking and compilation

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qrlock-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open application**
   - Navigate to `http://localhost:5173` in your browser

### Backend Setup (Required for full functionality)

1. **Create backend server**
   ```bash
   mkdir qrlock-backend
   cd qrlock-backend
   npm init -y
   ```

2. **Install backend dependencies**
   ```bash
   npm install express cors qrcode speakeasy usb
   ```

3. **Create server endpoints**
   - `/api/usb-status` - Get current USB status
   - `/api/generate-otp` - Generate new OTP and QR code
   - `/api/verify-otp` - Verify submitted OTP
   - `/api/block-usb` - Block USB access
   - `/api/unblock-usb` - Unblock USB access

4. **Start backend server**
   ```bash
   node server.js
   ```
   - Server should run on `http://localhost:5000`

### Production Build

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready for deployment.

## 📋 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/usb-status` | GET | Get current USB monitoring status |
| `/api/generate-otp` | POST | Generate new OTP and QR code |
| `/api/verify-otp` | POST | Verify submitted OTP |
| `/api/block-usb` | POST | Block USB device access |
| `/api/unblock-usb` | POST | Unblock USB device access |
| `/api/usb-devices` | GET | Get list of connected USB devices |
| `/api/security-events` | GET | Get security event history |

## 🔒 Security Features

### Authentication
- **Time-based OTP** - 6-digit codes with 5-minute expiry
- **QR Code Authentication** - Secure mobile device scanning
- **Single-use Tokens** - Each OTP can only be used once

### Monitoring
- **Real-time Detection** - Instant USB device monitoring
- **Event Logging** - Complete audit trail of all activities
- **Status Tracking** - Live connection and security status

### Access Control
- **Granular Permissions** - Fine-grained USB access control
- **Automatic Blocking** - Configurable auto-block features
- **Manual Override** - Administrative override capabilities

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Yash Pawar**
- Full Stack Developer
- Specializing in modern web technologies and security systems
- GitHub: [@yashpawar](https://github.com/yashpawar)
- LinkedIn: [Yash Pawar](https://linkedin.com/in/yashpawar)
- Email: yash@example.com

## 🙏 Acknowledgments

- [React Team](https://reactjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the comprehensive icon library
- [Vite](https://vitejs.dev/) for the lightning-fast build tool

## 📞 Support

If you have any questions or need support, please:
- Open an issue on GitHub
- Contact the developer via email
- Check the documentation for common solutions

---

**Created with ❤️ by Yash Pawar**

*Making USB security accessible and beautiful for everyone.*
