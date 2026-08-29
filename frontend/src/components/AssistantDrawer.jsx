import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Zap, RefreshCw, X, ArrowRight, AlertCircle } from 'lucide-react';

export default function AssistantDrawer({ isOpen, onClose, onTriggerReplan, isReplanning }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I'm your PathCraft AI Assistant. Ask me anything about your roadmap, or use the quick adapt buttons below to reflow your path live!"
    }
  ]);
  const [inputText, setInputText] = useState("");

  if (!isOpen) return null;

  const handleSendMessage = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    // Simulate conversational intelligence
    setTimeout(() => {
      let reply = "I've analyzed your skill DAG. Every node in your roadmap is placed based on prerequisite satisfaction and your target role score.";
      const lower = textToSend.toLowerCase();

      if (lower.contains || lower.includes("hour") || lower.includes("time") || lower.includes("week") || lower.includes("hard") || lower.includes("skip")) {
        reply = "Got it! I am triggering a live DAG reflow right now to adapt your roadmap schedule and resource sequencing based on your feedback.";
        onTriggerReplan(textToSend);
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  const quickAdapts = [
    { label: "📉 I only have 3 hrs/week now", prompt: "I only have 3 hours per week now" },
    { label: "🧠 Math is too hard, add a refresher", prompt: "Linear algebra is too hard, add a refresher lab" },
    { label: "⚡ Accelerate path (too easy)", prompt: "The current milestone is too easy, accelerate my path" },
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 100
    }}>
      <div style={{
        width: '460px',
        background: '#090d16',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(18, 26, 44, 0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>PathCraft Persistent AI Assistant</h3>
              <p style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Connected to Skill DAG Engine</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Quick Replanning Triggers */}
        <div style={{ padding: '14px 20px', background: 'rgba(99, 102, 241, 0.06)', borderBottom: '1px solid rgba(99, 102, 241, 0.15)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={12} /> Live Replanning Triggers:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {quickAdapts.map((qa, i) => (
              <button
                key={i}
                onClick={() => {
                  handleSendMessage(qa.prompt);
                }}
                disabled={isReplanning}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#e5e7eb',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {qa.label}
                <ArrowRight size={14} color="#6366f1" />
              </button>
            ))}
          </div>
        </div>

        {/* Chat History */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(18, 26, 44, 0.9)',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                fontSize: '0.88rem',
                lineHeight: 1.4,
                border: msg.sender === 'bot' ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
              }}
            >
              {msg.text}
            </div>
          ))}
          {isReplanning && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(18, 26, 44, 0.9)', padding: '10px 14px', borderRadius: '12px', color: '#10b981', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
              Recalculating DAG nodes & reflowing roadmap timeline...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(9, 13, 22, 0.9)', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask assistant or type replan request..."
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#ffffff',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            className="glow-btn-primary"
            style={{ padding: '10px 16px' }}
          >
            <Send size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
