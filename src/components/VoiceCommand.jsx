import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

const hinglishMappings = {
  // English words
  'movie': 'movie',
  'video': 'video',
  'song': 'song',
  'play': 'play',
  'latest': 'latest',
  'new': 'new',
  // Hindi words (romanized)
  'gaana': 'गाना',
  'film': 'फिल्म',
  'naya': 'नया',
  'purana': 'पुराना',
  'hit': 'हिट',
  'best': 'बेस्ट',
  'dekhna': 'देखना',
  'sunna': 'सुनना'
};

function convertHinglishToHindi(query) {
  return query.split(' ').map(word => {
    const lowerWord = word.toLowerCase();
    return hinglishMappings[lowerWord] || word;
  }).join(' ');
}

const VoiceCommand = ({ onSearch }) => {
  // State
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en-US'); // Default language
  const [commandHistory, setCommandHistory] = useState([]);

  // Keep recognition ref to avoid stale closures
  const recognitionRef = useRef(null);

  useEffect(() => {
    let speechRecognition;

    const initSpeechRecognition = async () => {
      try {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
          setIsSupported(false);
          setError('Voice search not supported in your browser');
          return;
        }

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
        } catch (err) {
          setIsSupported(false);
          setError('Microphone access denied. Please enable permissions.');
          return;
        }

        speechRecognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
        speechRecognition.continuous = false;
        speechRecognition.interimResults = false;
        speechRecognition.lang = language;

        speechRecognition.onresult = (event) => {
          let query = event.results[0][0].transcript.trim();

          // Detect if query contains Hinglish (mix of English and Romanized Hindi)
          const isHinglish = /[a-zA-Z]/.test(query) && 
                             (/[aiueo]/i.test(query) || 
                             Object.keys(hinglishMappings).some(word => query.toLowerCase().includes(word)));

          if (isHinglish && language === 'hi-IN') {
            query = convertHinglishToHindi(query);
          }
          // Add to command history
          addToCommandHistory(query);
          onSearch(query);
        };

        speechRecognition.onerror = (event) => {
          setError('Error recognizing speech. Try again.');
        };

        speechRecognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = speechRecognition;
        setIsSupported(true);
        setError(null);
      } catch (err) {
        setError('Failed to initialize voice search');
      }
    };

    initSpeechRecognition();

    // Clean up instance on unmount or language toggle
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [language, onSearch]);

  // Command history handler
  const addToCommandHistory = (command) => {
    setCommandHistory(prev => [
      ...prev,
      {
        text: command,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Start/Stop listening
  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setError(null);
      recognition.start();
      setIsListening(true);
    }
  };

  // Toggle Hindi/English
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en-US' ? 'hi-IN' : 'en-US');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false); // Stop listening when language changes
    }
  };

  // Early return for unsupported
  if (!isSupported) {
    return (
      <div className="voice-control-glass">
        <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Voice search not available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-control-glass">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={toggleLanguage}
          className="language-toggle text-sm bg-gray-200 px-3 py-1 rounded"
        >
          {language === 'en-US' ? 'Switch to Hindi' : 'हिंदी से अंग्रेज़ी'}
        </button>
        <span className="text-sm">
          {language === 'en-US' ? 'English' : 'हिंदी'}
        </span>
      </div>

      <div className="text-center mb-4">
        <button
          className={`voice-btn ${isListening ? 'listen' : ''}`}
          onClick={toggleListening}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          {isListening ? 
            (language === 'en-US' ? 'Listening...' : 'सुन रहा हूँ...') : 
            (language === 'en-US' ? 'Voice Search' : 'आवाज़ खोज')}
        </button>
      </div>

      {error && (
        <div className="voice-error bg-red-100 text-red-700 p-2 mb-2 rounded text-sm">
          {error}
        </div>
      )}

      <div className="command-display mb-2">
        {commandHistory.slice(-3).reverse().map((cmd, i) => (
          <div key={i} className="mb-1">
            <div className="command-text font-mono">{cmd.text}</div>
            <div className="command-timestamp text-xs text-gray-400">{cmd.timestamp}</div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <span className={`voice-status-blip ${!isListening ? 'off' : ''}`}>
          {isListening ? 
            (language === 'en-US' ? 'Speak now...' : 'बोलिए...') : 
            (language === 'en-US' ? 'Ready' : 'तैयार')}
        </span>
      </div>
    </div>
  );
};

export default VoiceCommand