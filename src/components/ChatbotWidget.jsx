/**
 * ChatbotWidget.jsx
 * Self-contained floating AI chat widget for JMDT Docs.
 * Powered by Google Gemini API (generateContent) with typewriter effect.
 * Injected globally via src/theme/Root.js
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// ─── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Zara, the complete and official technical AI guide for JMDT (docs.jmdt.io). Answer questions about JMDT node deployment, configuration, networking, CLI usage, and troubleshooting. Give step-by-step instructions when asked how to do something. Use code blocks for commands. If you don't know something, say so and suggest checking docs.jmdt.io. Never answer questions unrelated to JMDT. Always base your answers on the documentation provided below.`;

const GEMINI_MODEL = 'gemini-3.1-flash-lite-preview';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm **Zara**, your JMDT AI Guide. Ask me anything about node deployment, CLI usage, networking, or configuration.",
};

// ─── Markdown Renderer ────────────────────────────────────────────────────────
function renderParts(text) {
  const parts = [];
  const codeBlockRe = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0;
  let m;
  while ((m = codeBlockRe.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', content: text.slice(last, m.index) });
    parts.push({ type: 'code', lang: m[1] || '', content: m[2].trim() });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: 'text', content: text.slice(last) });
  return parts;
}

function InlineText({ line }) {
  const segments = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) segments.push(<span key={last}>{line.slice(last, m.index)}</span>);
    const val = m[0];
    if (val.startsWith('`')) {
      segments.push(
        <code key={m.index} style={styles.inlineCode}>{val.slice(1, -1)}</code>
      );
    } else if (val.startsWith('**')) {
      segments.push(<strong key={m.index}>{val.slice(2, -2)}</strong>);
    } else {
      segments.push(<em key={m.index}>{val.slice(1, -1)}</em>);
    }
    last = m.index + val.length;
  }
  if (last < line.length) segments.push(<span key={last}>{line.slice(last)}</span>);
  return <>{segments}</>;
}

function MessageContent({ content }) {
  const parts = renderParts(content);
  return (
    <div style={{ wordBreak: 'break-word' }}>
      {parts.map((part, i) => {
        if (part.type === 'code') {
          return (
            <pre key={i} style={styles.codeBlock}>
              <code>{part.content}</code>
            </pre>
          );
        }
        const lines = part.content.split('\n');
        return (
          <p key={i} style={styles.textPara}>
            {lines.map((line, j) => (
              <React.Fragment key={j}>
                <InlineText line={line} />
                {j < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────
export default function ChatbotWidget() {
  const { siteConfig } = useDocusaurusContext();
  const apiKey = siteConfig.customFields?.geminiApiKey;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const docsContextRef = useRef(''); // holds the full docs content once fetched

  // Fetch docs-content.json once on mount and build the context string
  useEffect(() => {
    fetch('/docs-content.json')
      .then(r => r.json())
      .then(({ pages }) => {
        const context = pages
          .map(p => `=== ${p.name}.md ===\n${p.content}`)
          .join('\n\n');
        docsContextRef.current = context;
      })
      .catch(() => { /* silently ignore — widget still works without docs context */ });
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    if (!apiKey) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ **Gemini API key not configured.**\n\nPlease set `GEMINI_API_KEY` in your environment and restart the dev server:\n```bash\nGEMINI_API_KEY=your_key_here yarn start\n```',
      }]);
      return;
    }

    const userText = input.trim();
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    const userMsg = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    // Build Gemini conversation history (exclude welcome message from history)
    const history = messages
      .slice(1) // skip static welcome
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
    history.push({ role: 'user', parts: [{ text: userText }] });

    // Append streaming placeholder
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: docsContextRef.current
                ? `${SYSTEM_PROMPT}\n\n--- JMDT DOCUMENTATION ---\n\n${docsContextRef.current}`
                : SYSTEM_PROMPT,
            }],
          },
          contents: history,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const fullText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '_(no response)_';

      // Typewriter effect — reveal response character by character
      let i = 0;
      const CHUNK = 6; // chars per tick
      const DELAY = 16; // ms per tick (~60fps)

      await new Promise((resolve) => {
        function tick() {
          if (abortRef.current?.signal.aborted) { resolve(); return; }
          i = Math.min(i + CHUNK, fullText.length);
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'assistant',
              content: fullText.slice(0, i),
              streaming: i < fullText.length,
            };
            return updated;
          });
          if (i < fullText.length) {
            setTimeout(tick, DELAY);
          } else {
            resolve();
          }
        }
        tick();
      });

    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (err.name === 'AbortError') {
          updated[updated.length - 1] = { ...last, streaming: false };
        } else {
          updated[updated.length - 1] = {
            role: 'assistant',
            content: `❌ **Error:** ${err.message}`,
            streaming: false,
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, apiKey]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopStreaming = () => abortRef.current?.abort();

  const clearChat = () => {
    stopStreaming();
    setMessages([WELCOME_MESSAGE]);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <button
        className={`jmdt-fab ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen(o => !o)}
        title="Ask Zara"
        aria-label={isOpen ? 'Close guide' : 'Open Zara'}
      >
        <span className="jmdt-fab-icon">
          {isOpen ? '✕' : '✨'}
        </span>
        {!isOpen && (
          <span className="jmdt-fab-text">
            Ask Zara
          </span>
        )}
      </button>

      {/* ── Chat Panel ── */}
      {isOpen && (
        <div style={styles.panel}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.avatar}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M4.5 3L5.5 5.5L8 6.5L5.5 7.5L4.5 10L3.5 7.5L1 6.5L3.5 5.5L4.5 3Z" fill="white" stroke="white" strokeWidth="1" />
                </svg>
              </div>
              <div>
                <div style={styles.headerTitle}>Zara</div>
                <div style={styles.headerSub}>
                  <span style={styles.onlineDot} />
                  Ready to help
                </div>
              </div>
            </div>
            <button onClick={clearChat} title="Clear conversation" style={styles.clearBtn}>
              Clear
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    ...styles.bubble,
                    ...(msg.role === 'user' ? styles.userBubble : styles.botBubble),
                  }}
                >
                  <MessageContent content={msg.content} />
                  {msg.streaming && <span style={styles.cursor} />}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={styles.inputRow}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask Zara…"
              rows={1}
              disabled={isStreaming}
              style={styles.textarea}
            />
            {isStreaming ? (
              <button onClick={stopStreaming} title="Stop" style={styles.stopBtn}>⏹</button>
            ) : (
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                title="Send (Enter)"
                style={{
                  ...styles.sendBtn,
                  background: input.trim()
                    ? 'linear-gradient(135deg, #8074d9, #71a2e6)'
                    : 'rgba(255,255,255,0.05)',
                  color: input.trim() ? '#fff' : 'rgba(255,255,255,0.25)',
                  cursor: input.trim() ? 'pointer' : 'default',
                }}
              >
                ↑
              </button>
            )}
          </div>

          {/* Footer hint */}
          <div style={styles.footer}>
            Enter to send · Shift+Enter for newline
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes jmdt-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes jmdt-pulse {
          0% { box-shadow: 0 0 0 0 rgba(113, 162, 230, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(113, 162, 230, 0); }
          100% { box-shadow: 0 0 0 0 rgba(113, 162, 230, 0); }
        }
        .jmdt-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          height: 54px;
          border-radius: 27px;
          border: 1px solid rgba(113, 162, 230, 0.4);
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(8, 8, 16, 0.6);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          background: linear-gradient(135deg, #0e0e1a, #1a1a2e);
          padding: 0 20px 0 16px;
          animation: jmdt-pulse 3s infinite;
        }
        .jmdt-fab:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(113, 162, 230, 0.4);
          background: linear-gradient(135deg, #8074d9, #71a2e6);
          border-color: transparent;
        }
        .jmdt-fab.is-open {
          width: 54px;
          padding: 0;
          background: linear-gradient(135deg, #df77a8, #8074d9);
          border: none;
          animation: none;
        }
        .jmdt-fab-icon {
          font-size: 20px;
          line-height: 1;
        }
        .jmdt-fab-text {
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          font-family: 'Outfit', 'Inter', system-ui, sans-serif;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .jmdt-chatbot-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .jmdt-chatbot-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .jmdt-chatbot-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(113, 162, 230, 0.25);
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  fab: {},
  panel: {
    position: 'fixed',
    bottom: '90px',
    right: '24px',
    width: '390px',
    maxWidth: 'calc(100vw - 48px)',
    height: '540px',
    maxHeight: 'calc(100vh - 110px)',
    background: 'rgba(8, 8, 16, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(113, 162, 230, 0.18)',
    borderRadius: '18px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(128, 116, 217, 0.08)',
    zIndex: 9998,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
  },
  header: {
    padding: '16px 20px',
    background: 'linear-gradient(135deg, rgba(30, 30, 46, 0.8), rgba(18, 18, 28, 0.9))',
    borderBottom: '1px solid rgba(113, 162, 230, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderTopLeftRadius: '18px',
    borderTopRightRadius: '18px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #8074d9, #71a2e6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(128, 116, 217, 0.3)',
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: '16px',
    color: '#ffffff',
    letterSpacing: '0.02em',
    fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
  },
  headerSub: {
    fontSize: '12px',
    color: '#a8d8ff',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '2px',
    fontWeight: 500,
  },
  onlineDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#4ade80',
    display: 'inline-block',
    boxShadow: '0 0 6px rgba(74, 222, 128, 0.6)',
  },
  clearBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
    fontSize: '11px',
    padding: '4px 9px',
    transition: 'border-color 0.2s, color 0.2s',
  },
  messages: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: '14px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(113, 162, 230, 0.25) transparent',
  },
  bubble: {
    maxWidth: '90%',
    padding: '10px 13px',
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#e3e3e8',
  },
  userBubble: {
    borderRadius: '14px 14px 3px 14px',
    background: 'linear-gradient(135deg, #8074d9, #5e8cc9)',
    color: '#ffffff',
  },
  botBubble: {
    borderRadius: '14px 14px 14px 3px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
  },
  cursor: {
    display: 'inline-block',
    width: '7px',
    height: '13px',
    background: '#71a2e6',
    borderRadius: '2px',
    marginLeft: '3px',
    verticalAlign: 'text-bottom',
    animation: 'jmdt-blink 0.75s infinite',
  },
  inputRow: {
    padding: '10px 12px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  textarea: {
    flex: 1,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(113, 162, 230, 0.22)',
    borderRadius: '10px',
    color: '#e3e3e8',
    fontSize: '13px',
    padding: '9px 12px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    overflowY: 'auto',
    minHeight: '38px',
    maxHeight: '100px',
    transition: 'border-color 0.2s',
  },
  sendBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.15s',
    fontWeight: 'bold',
  },
  stopBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    border: 'none',
    background: 'rgba(223, 119, 168, 0.15)',
    color: '#df77a8',
    cursor: 'pointer',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  footer: {
    textAlign: 'center',
    fontSize: '10px',
    color: 'rgba(255,255,255,0.2)',
    padding: '4px 0 8px',
    flexShrink: 0,
  },
  inlineCode: {
    background: 'rgba(113, 162, 230, 0.12)',
    padding: '1px 5px',
    borderRadius: '4px',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '0.84em',
    color: '#84b8ff',
  },
  codeBlock: {
    background: 'rgba(5, 5, 10, 0.85)',
    border: '1px solid rgba(113, 162, 230, 0.15)',
    borderRadius: '8px',
    padding: '10px 13px',
    margin: '6px 0',
    overflowX: 'auto',
    fontSize: '0.78em',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    color: '#a8d8ff',
    lineHeight: '1.55',
    whiteSpace: 'pre',
  },
  textPara: {
    margin: '3px 0',
    lineHeight: '1.65',
  },
};
