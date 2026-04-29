import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    { label: "Book a Room 🏨", value: "book a room" },
    { label: "Facilities 🏊", value: "facilities" },
    { label: "Breakfast ☕", value: "breakfast" },
    { label: "Feedback ⭐", value: "feedback" }
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const userId = userInfo ? userInfo._id : null;
        
        let sessionId = localStorage.getItem('chatSessionId');
        if (!sessionId && !userId) {
          sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('chatSessionId', sessionId);
        }

        const { data } = await axios.get(`http://localhost:5001/api/chat/history?userId=${userId || ''}&sessionId=${sessionId || ''}`);
        if (data.length > 0) {
          const historyMessages = data.map(msg => ({
            text: msg.message,
            sender: msg.role  // role is 'user' or 'bot', matches sender class
          }));
          setMessages(historyMessages);
        } else {
          // No history — show the default greeting
          setMessages([
            { text: "Hello! I'm your LuxuryStay Assistant. How can I help you today?", sender: 'bot' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        // On error still show greeting
        setMessages([
          { text: "Hello! I'm your LuxuryStay Assistant. How can I help you today?", sender: 'bot' }
        ]);
      }
    };
    fetchHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const inputMessage = textToSend || message;
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const userId = userInfo ? userInfo._id : null;
      const sessionId = localStorage.getItem('chatSessionId');
      
      const { data } = await axios.post('http://localhost:5001/api/chat', { 
        message: inputMessage,
        userId,
        sessionId
      });

      let botMessage = { text: data.message, sender: 'bot' };
      
      try {
        const parsed = JSON.parse(data.message);
        if (parsed.text && parsed.cards) {
          botMessage = { 
            text: parsed.text, 
            cards: parsed.cards, 
            sender: 'bot' 
          };
        }
      } catch (e) {}

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { text: "Sorry, I'm having trouble connecting right now. Please try again later.", sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSendMessage(transcript);
    };
    recognition.start();
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([{ text: "History cleared. How can I help you today?", sender: 'bot' }]);
      localStorage.removeItem('chatSessionId');
    }
  };

  return (
    <div className="chatbot-container">
      {/* Floating Toggle Button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
      >
        <i className={isOpen ? "fas fa-times" : "fas fa-comments"}></i>
      </button>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'show' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="bot-info-wrapper">
            <div className="bot-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="bot-info">
              <h3>Hotel Assistant</h3>
              <div className="bot-status"><span className="status-dot"></span> Online</div>
            </div>
          </div>
          <div className="header-actions">
            <button className="header-btn" title="Clear Chat" onClick={handleClearChat}>
              <i className="fas fa-trash-alt"></i>
            </button>
            <button className="header-btn" onClick={() => setIsOpen(false)}>
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.sender} animate-in`}>
              <div className={`message ${msg.sender}`}>
                {msg.text}
              </div>
              {msg.cards && (
                <div className="room-cards-container">
                  {msg.cards.map((card, idx) => (
                    <div key={idx} className="room-card" onClick={() => handleCardSelect(card.id)}>
                      <div className="card-image-wrapper">
                        <img src={card.image} alt={card.title} />
                        <div className="card-price-tag">${card.price}/night</div>
                      </div>
                      <div className="card-info">
                        <h4>{card.title}</h4>
                        <button className="select-btn">
                          <i className="fas fa-check-circle"></i> Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message-wrapper bot">
              <div className="typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {!isLoading && messages.length > 0 && (
          <div className="quick-replies">
            {quickReplies.map((reply, index) => (
              <button 
                key={index} 
                className="quick-reply-btn"
                onClick={() => handleSendMessage(reply.value)}
              >
                {reply.label}
              </button>
            ))}
          </div>
        )}

        {/* Footer / Input */}
        <form className="chat-footer" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
          <div className="chat-input-container">
            <button 
              type="button" 
              className={`mic-btn ${isListening ? 'is-listening' : ''}`}
              onClick={startVoiceRecognition}
              title="Voice Input"
            >
              <i className="fas fa-microphone"></i>
            </button>
            <input
              type="text"
              placeholder={isListening ? "Listening..." : "Ask me anything..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading || isListening}
            />
            <button type="submit" className="send-btn" disabled={isLoading || isListening || !message.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
