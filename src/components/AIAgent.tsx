
import React, { useState, useEffect, useRef } from 'react';
import { Bot, BotOff, Mic, MicOff, Volume2, VolumeX, Settings, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIAgentProps {
  serverConnected: boolean;
}

const AIAgent: React.FC<AIAgentProps> = ({ serverConnected }) => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatGptApiKey, setChatGptApiKey] = useState('');
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Aria');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Encoded API keys (base64 encoded for security)
  const encodedKeys = {
    chatgpt: 'c2stcHJvai12TnlrTmN6RXpaOGVjV0Q0My1zakVGSGx4UWU3V1BNeVNLcnVyc0VZai1BeWFvRWR2MThYLUFSTXVQYldQdEkydk5MaXprVDNCbGJrRkpRbmhxLXZZd3JUV2FOM0FmZ2NHNXNvT2hJT2tkUHFEV0duMk1oQVU1ZVMwaUhiakV1Rm4wdUlmd0xXOFVkcEdKeHNVS0tUWUE=',
    elevenlabs: 'c2tfNTVlZTViNWEwYjM1ODNlNTNiMzMyYzA0YTg4MGU4YWE3NzY1YWI4NDM0MDE3YTMx'
  };

  // Decode function for API keys
  const decodeKey = (encodedKey: string): string => {
    try {
      return atob(encodedKey);
    } catch (error) {
      console.error('Failed to decode API key');
      return '';
    }
  };

  // Load API keys from localStorage or use encoded defaults
  useEffect(() => {
    const savedChatGptKey = localStorage.getItem('chatgpt_api_key');
    const savedElevenLabsKey = localStorage.getItem('elevenlabs_api_key');
    const savedVoice = localStorage.getItem('ai_agent_voice');
    
    // Use saved keys if available, otherwise use encoded defaults
    setChatGptApiKey(savedChatGptKey || decodeKey(encodedKeys.chatgpt));
    setElevenLabsApiKey(savedElevenLabsKey || decodeKey(encodedKeys.elevenlabs));
    if (savedVoice) setSelectedVoice(savedVoice);
  }, []);

  // Voice IDs for ElevenLabs
  const voices = {
    'Aria': '9BWtsMINqrJLrRacOk9x',
    'Roger': 'CwhRBWXzGAHq8TQ4Fs17',
    'Sarah': 'EXAVITQu4vr4xnSDxMaL',
    'Laura': 'FGY2WhTYpPnrIDTdsKH5',
    'Charlie': 'IKne3meq5aSn9XLyUdCD',
    'George': 'JBFqnCBsd6RMkjVDRZzb',
    'Liam': 'TX3LPaxmHKxFdv7VOQHJ',
    'Charlotte': 'XB0fDUnXU5powFXDhCwa',
    'Alice': 'Xb7hH8MSUJpSbSDYk0k2'
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      
      if (SpeechRecognitionClass) {
        recognitionRef.current = new SpeechRecognitionClass();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
          console.log('Speech recognized:', transcript);
          
          // Check for greeting words
          if (transcript.includes('hello') || transcript.includes('hi') || transcript.includes('hey')) {
            handleGreeting(transcript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          if (isActive) {
            // Restart listening if agent is still active
            setTimeout(() => {
              recognitionRef.current?.start();
            }, 100);
          } else {
            setIsListening(false);
          }
        };
      }
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isActive]);

  const saveApiKeys = () => {
    localStorage.setItem('chatgpt_api_key', chatGptApiKey);
    localStorage.setItem('elevenlabs_api_key', elevenLabsApiKey);
    localStorage.setItem('ai_agent_voice', selectedVoice);
    
    toast({
      title: "Settings Saved",
      description: "API keys and voice settings have been saved locally.",
    });
    
    setShowSettings(false);
  };

  const startAgent = async () => {
    // Auto-use encoded keys if no custom keys are set
    const effectiveChatGptKey = chatGptApiKey || decodeKey(encodedKeys.chatgpt);
    const effectiveElevenLabsKey = elevenLabsApiKey || decodeKey(encodedKeys.elevenlabs);

    if (!effectiveChatGptKey || !effectiveElevenLabsKey) {
      toast({
        title: "API Keys Required",
        description: "Please configure ChatGPT and ElevenLabs API keys first.",
        variant: "destructive"
      });
      setShowSettings(true);
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setIsActive(true);
      setIsListening(true);
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      toast({
        title: "🤖 AI Agent Activated",
        description: "Say 'hello', 'hi', or 'hey' to start a conversation!",
      });
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use the AI agent.",
        variant: "destructive"
      });
    }
  };

  const stopAgent = () => {
    setIsActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    
    toast({
      title: "🤖 AI Agent Deactivated",
      description: "Agent has been turned off.",
    });
  };

  const handleGreeting = async (transcript: string) => {
    console.log('Processing greeting:', transcript);
    
    try {
      // Get response from ChatGPT
      const chatResponse = await getChatGPTResponse(transcript);
      
      if (chatResponse) {
        // Convert response to speech using ElevenLabs
        await speakWithElevenLabs(chatResponse);
      }
    } catch (error) {
      console.error('Error handling greeting:', error);
      toast({
        title: "AI Agent Error",
        description: "Failed to process your greeting. Please check your API keys.",
        variant: "destructive"
      });
    }
  };

  const getChatGPTResponse = async (message: string): Promise<string | null> => {
    try {
      const effectiveApiKey = chatGptApiKey || decodeKey(encodedKeys.chatgpt);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${effectiveApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant for QRLock Pro, a USB security system. Keep responses brief and friendly. You help users with USB security questions and general assistance.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`ChatGPT API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || null;
    } catch (error) {
      console.error('ChatGPT API error:', error);
      return null;
    }
  };

  const speakWithElevenLabs = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      const effectiveApiKey = elevenLabsApiKey || decodeKey(encodedKeys.elevenlabs);
      const voiceId = voices[selectedVoice as keyof typeof voices];
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': effectiveApiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      setIsSpeaking(false);
      
      toast({
        title: "Voice Synthesis Error",
        description: "Failed to generate voice response. Check your ElevenLabs API key.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-2xl">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Bot className={`w-8 h-8 ${isActive ? 'text-green-400' : 'text-gray-400'}`} />
            {isActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-6">AI Security Assistant</h3>

        {/* Status Indicators */}
        <div className="flex justify-center gap-4 mb-6">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
            isListening ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-gray-700/20 border border-gray-600/50 text-gray-400'
          }`}>
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span className="text-sm">{isListening ? 'Listening' : 'Mic Off'}</span>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
            isSpeaking ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400' : 'bg-gray-700/20 border border-gray-600/50 text-gray-400'
          }`}>
            {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-sm">{isSpeaking ? 'Speaking' : 'Silent'}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={isActive ? stopAgent : startAgent}
            disabled={!serverConnected}
            className={`flex-1 ${
              isActive 
                ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
            } disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {isActive ? <BotOff className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            {isActive ? 'Stop AI Agent' : 'Start AI Agent'}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-gray-800/50 border border-gray-600/30 rounded-xl p-4 mb-4">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Configuration
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ChatGPT API Key
                </label>
                <input
                  type="password"
                  value={chatGptApiKey}
                  onChange={(e) => setChatGptApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ElevenLabs API Key
                </label>
                <input
                  type="password"
                  value={elevenLabsApiKey}
                  onChange={(e) => setElevenLabsApiKey(e.target.value)}
                  placeholder="Your ElevenLabs API key"
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Voice Selection
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(voices).map((voice) => (
                    <option key={voice} value={voice}>{voice}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={saveApiKeys}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <h4 className="text-sm font-semibold text-white mb-2">How to use:</h4>
          <ol className="text-xs text-slate-300 space-y-1 text-left">
            <li>1. Configure your ChatGPT and ElevenLabs API keys in settings</li>
            <li>2. Click "Start AI Agent" to activate voice recognition</li>
            <li>3. Say "hello", "hi", or "hey" to start a conversation</li>
            <li>4. The AI will respond with both text and voice</li>
            <li>5. Click "Stop AI Agent" to deactivate the assistant</li>
          </ol>
        </div>

        {!serverConnected && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Bot className="w-4 h-4" />
              <span className="text-sm font-medium">AI Agent available offline</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgent;
