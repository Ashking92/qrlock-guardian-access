
import React from 'react';
import { Shield, Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-black/20 backdrop-blur-lg border-t border-white/10 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">QRLock Pro</h3>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Advanced USB Security System with QR Code Authentication and Real-time Monitoring
            </p>
            <p className="text-slate-400 text-xs">
              Version 1.0.0 • Built with modern web technologies
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Real-time USB Detection</li>
              <li>• QR Code Authentication</li>
              <li>• OTP Verification System</li>
              <li>• Security Event Logging</li>
              <li>• Advanced Monitoring</li>
            </ul>
          </div>

          {/* Developer Info */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-white mb-4">Developer</h4>
            <div className="space-y-2">
              <p className="text-slate-300 font-medium">Yash Pawar</p>
              <p className="text-slate-400 text-sm">Full Stack Developer</p>
              <div className="flex items-center justify-center md:justify-end gap-3 mt-4">
                <a 
                  href="https://github.com/yashpawar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <Github className="w-4 h-4 text-slate-300" />
                </a>
                <a 
                  href="https://linkedin.com/in/yashpawar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <Linkedin className="w-4 h-4 text-slate-300" />
                </a>
                <a 
                  href="mailto:yash@example.com" 
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <Mail className="w-4 h-4 text-slate-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>© 2024 QRLock Pro. Created with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>by Yash Pawar</span>
            </div>
            <div className="text-slate-400 text-sm">
              All rights reserved. Licensed under MIT License.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
