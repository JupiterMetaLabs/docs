/**
 * ChatbotWidget.jsx
 * Unified Search & AI Guide (Zara) for JMDT Docs.
 * Full-screen modal UI with MiniSearch retrieval and Gemini chat.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from '@docusaurus/router';
import MiniSearch from 'minisearch';

// ─── Constants ──────────────────────────────────────────────────────────────
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
  const history = useHistory();
  const apiKey = siteConfig.customFields?.geminiApiKey;

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('search');
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('jmdt_chat_history');
      return saved ? JSON.parse(saved) : [WELCOME_MESSAGE];
    } catch (e) { return [WELCOME_MESSAGE]; }
  });
  const [query, setQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  
  // Persistence state
  const [recentDocs, setRecentDocs] = useState(() => {
    try {
      const saved = localStorage.getItem('jmdt_recent_docs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  const [recentChats, setRecentChats] = useState(() => {
    try {
      const saved = localStorage.getItem('jmdt_recent_chats');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // Save persistence
  useEffect(() => {
    localStorage.setItem('jmdt_recent_docs', JSON.stringify(recentDocs));
  }, [recentDocs]);
  useEffect(() => {
    localStorage.setItem('jmdt_recent_chats', JSON.stringify(recentChats));
  }, [recentChats]);
  useEffect(() => {
    localStorage.setItem('jmdt_chat_history', JSON.stringify(messages));
  }, [messages]);
  
  const miniSearchRef = useRef(
    new MiniSearch({
      fields: ['name', 'content', 'title'],
      storeFields: ['name', 'content', 'title', 'anchor'],
      searchOptions: {
        boost: { title: 3, name: 2 },
        fuzzy: 0.2,
        prefix: true
      }
    })
  );

  useEffect(() => {
    fetch('/docs-content.json')
      .then(r => r.json())
      .then(({ pages }) => {
        if (pages && pages.length > 0) {
          // Pages are already processed into sections by the indexing script
          miniSearchRef.current.addAll(pages);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
      // No longer clearing query or view on close - persistence!
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (view !== 'search') return;
    if (!query.trim()) {
      setSearchResults([]);
      setSelectedIndex(0);
      return;
    }
    const results = miniSearchRef.current.search(query).slice(0, 6);
    setSearchResults(results);
    setSelectedIndex(0);
  }, [query, view]);

  // Helper to highlight matches in a string
  const HighlightText = ({ text }) => {
    if (!text) return null;
    if (!query.trim()) return <span>{text}</span>;
    
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    if (terms.length === 0) return <span>{text}</span>;
    
    // Escape regex special characters
    const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    const parts = text.split(pattern);
    
    return (
      <span>
        {parts.map((part, i) => 
          pattern.test(part) ? (
            <mark key={i} style={styles.highlight}>{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  // Helper to generate a snippet around the match
  const getSnippet = (content, query) => {
    const queryLower = query.toLowerCase();
    const index = content.toLowerCase().indexOf(queryLower);
    if (index === -1) return content.slice(0, 100) + '...';
    
    const start = Math.max(0, index - 40);
    const end = Math.min(content.length, index + 80);
    let snippet = content.slice(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet += '...';
    return snippet;
  };

  const handleTriggerChat = (text = query) => {
    if (!text.trim()) return;
    setQuery(text);
    setView('chat');
    
    // Add to recent chats
    setRecentChats(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== text.toLowerCase());
      return [text, ...filtered].slice(0, 5);
    });

    sendMessage(text);
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setQuery('');
    setView('search');
    localStorage.removeItem('jmdt_chat_history');
  };

  const handleNavigate = (res) => {
    setIsOpen(false);
    
    // Add to recent docs
    setRecentDocs(prev => {
      const filtered = prev.filter(d => d.id !== res.id);
      return [res, ...filtered].slice(0, 5);
    });

    const url = `/docs/${res.name}${res.anchor ? '#' + res.anchor : ''}`;
    history.push(url);
  };

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim() || isStreaming) return;

    if (!apiKey) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ **Gemini API key not configured.**',
      }]);
      return;
    }

    const userMsg = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    const historyState = messages
      .slice(1)
      .slice(-4)
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
    historyState.push({ role: 'user', parts: [{ text: userText }] });

    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }]);
    abortRef.current = new AbortController();

    const searchResultsForAI = miniSearchRef.current.search(userText).slice(0, 3);
    const relevantContext = searchResultsForAI
      .map(res => `=== ${res.name}.md [${res.title}] ===\n${res.content}`)
      .join('\n\n');

    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: relevantContext
                ? `${SYSTEM_PROMPT}\n\n--- JMDT DOCUMENTATION EXCERPTS ---\n\n${relevantContext}`
                : SYSTEM_PROMPT,
            }],
          },
          contents: historyState,
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const fullText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '_(no response)_';

      let i = 0;
      const CHUNK = 6;
      const DELAY = 16;

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
          if (i < fullText.length) setTimeout(tick, DELAY); else resolve();
        }
        tick();
      });

    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        if (err.name !== 'AbortError') {
          updated[updated.length - 1] = { role: 'assistant', content: `❌ **Error:** ${err.message}`, streaming: false };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
      // Automatically add source to the response if relevant
      if (searchResultsForAI.length > 0) {
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === 'assistant' && !last.content.includes('Related sources')) {
            last.content += `\n\n### Related sources\n${searchResultsForAI.map(s => `- [${s.title}](/docs/${s.name}${s.anchor ? '#' + s.anchor : ''})`).join('\n')}`;
          }
          return updated;
        });
      }
    }
  }, [messages, apiKey, isStreaming]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (view === 'chat') {
        setView('search');
      } else if (query) {
        setQuery('');
      } else {
        setIsOpen(false);
      }
      return;
    }

    if (view === 'search') {
      const isInitial = !query.trim();
      const initialItemsCount = recentDocs.length + recentChats.length;
      const totalItems = isInitial ? initialItemsCount : (searchResults.length + (query ? 1 : 0));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (isInitial) {
           if (selectedIndex < recentDocs.length) {
             handleNavigate(recentDocs[selectedIndex]);
           } else {
             handleTriggerChat(recentChats[selectedIndex - recentDocs.length]);
           }
        } else {
          if (query && selectedIndex === 0) {
            handleTriggerChat();
          } else {
            const result = searchResults[query ? selectedIndex - 1 : selectedIndex];
            if (result) handleNavigate(result);
          }
        }
      }
    } else if (view === 'chat' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = inputRef.current?.value;
      if (text) {
        sendMessage(text);
        inputRef.current.value = '';
      }
    }
  };

  const stopStreaming = () => abortRef.current?.abort();

  return (
    <>
      <button className="jmdt-fab" onClick={() => setIsOpen(true)} title="Quick Search & AI">
        <span className="jmdt-fab-icon">🔍</span>
        <span className="jmdt-fab-text">Search Docs </span>
        <span className="jmdt-fab-key">⌘K</span>
      </button>

      {isOpen && (
        <div style={styles.backdrop} onClick={() => setIsOpen(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.searchHeader}>
              <div style={styles.searchIcon}>
                {view === 'chat' ? (
                   <div style={styles.backBtn} onClick={() => setView('search')}>
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                   </div>
                ) : (
                  '🔍'
                )}
              </div>
              <input
                ref={inputRef}
                style={styles.searchInput}
                placeholder={view === 'chat' ? "Ask Zara another question..." : "Search docs..."}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  if (view === 'chat' && e.target.value) setView('search');
                }}
                onKeyDown={handleKeyDown}
              />
              <div style={styles.headerRight}>
                {view === 'chat' && <div style={styles.clearBtn} onClick={clearChat}>Clear</div>}
                <div style={styles.escHint} onClick={() => setIsOpen(false)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
              </div>
            </div>

            <div className="jmdt-chatbot-scrollbar" style={styles.contentBody}>
              {view === 'search' ? (
                <>
                  {!query ? (
                    <div style={styles.emptyState}>
                      {recentDocs.length > 0 && (
                        <>
                          <div style={styles.recentLabel}>Recent</div>
                          {recentDocs.map((item, i) => (
                            <div 
                              key={`rd-${item.id}`} 
                              style={{...styles.resultItem, ...(selectedIndex === i ? styles.selectedItem : {})}} 
                              onClick={() => handleNavigate(item)}
                            >
                              <div style={styles.resultIconWrapper}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.4}}><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="9"></circle></svg>
                              </div>
                              <div style={{flex: 1}}>
                                <div style={styles.resultTitle}>{item.title}</div>
                                <div style={styles.resultPath}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</div>
                              </div>
                              <div 
                                style={styles.removeItem} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRecentDocs(prev => prev.filter(d => d.id !== item.id));
                                }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                              </div>
                            </div>
                          ))}
                        </>
                      )}

                      {recentChats.length > 0 && (
                        <>
                          <div style={styles.recentLabel}>Recent conversations</div>
                          {recentChats.map((item, i) => {
                            const isSel = selectedIndex === (recentDocs.length + i);
                            return (
                              <div 
                                key={`rc-${i}`} 
                                style={{...styles.resultItem, ...(isSel ? styles.selectedItem : {})}} 
                                onClick={() => handleTriggerChat(item)}
                              >
                                <div style={styles.resultIconWrapper}>
                                  <span style={{fontSize: '14px', opacity: 0.5}}>✨</span>
                                </div>
                                <div style={{flex: 1}}>
                                  <div style={styles.resultTitle}>{item}</div>
                                </div>
                                <div 
                                  style={styles.removeItem} 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRecentChats(prev => prev.filter(c => c !== item));
                                  }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                      
                      {recentDocs.length === 0 && recentChats.length === 0 && (
                         <div style={{padding: '40px 20px', textAlign: 'center', opacity: 0.3, fontSize: '14px'}}>
                           No recent searches or conversations.
                         </div>
                      )}
                    </div>
                  ) : (
                    <div style={styles.resultsList}>
                      <div 
                        style={{...styles.askAiItem, ...(selectedIndex === 0 ? styles.selectedItem : {})}}
                        onClick={() => handleTriggerChat()}
                      >
                        <div style={styles.sparkleIcon}>✨</div>
                        <div>
                          <div style={styles.askAiLabel}>Ask Zara: <span style={styles.queryHighlight}>{query}</span></div>
                          <div style={styles.askAiSub}>Instant answers from documentation</div>
                        </div>
                      </div>

                      {searchResults.map((res, i) => {
                        const isSel = selectedIndex === (i + 1);
                        const parentTitle = res.name.charAt(0).toUpperCase() + res.name.slice(1);
                        const isMainDoc = res.title.toLowerCase() === parentTitle.toLowerCase();
                        
                        return (
                          <div 
                            key={res.id} 
                            style={{...styles.resultItem, ...(isSel ? styles.selectedItem : {})}}
                            onClick={() => handleNavigate(res)}
                          >
                             <div style={styles.resultIconWrapper}>
                               {isMainDoc ? (
                                 <span style={styles.resultTypeIcon}>#</span>
                               ) : (
                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.4}}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                               )}
                             </div>
                             <div style={styles.docResultInfo}>
                               <div style={styles.resultTitle}>
                                 <HighlightText text={res.title} />
                               </div>
                               {!isMainDoc && (
                                 <div style={styles.resultSnippet}>
                                   <HighlightText text={getSnippet(res.content, query)} />
                                 </div>
                               )}
                               <div style={styles.resultPath}>
                                 {parentTitle}
                               </div>
                             </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div style={styles.chatView}>
                  <div style={styles.aiDisclaimer}>Answers are generated with AI which can make mistakes. Verify responses.</div>
                  {messages.length > 1 && (
                    <div style={styles.searchMeta}>
                       <span style={{opacity: 0.5}}>🔍 Searched for "{query}"</span>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} style={{ ...styles.msgRow, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ ...styles.bubble, ...(msg.role === 'user' ? styles.userBubble : styles.botBubble) }}>
                        <MessageContent content={msg.content} />
                        {msg.streaming && <span style={styles.cursor} />}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div style={styles.footer}>
              <div style={styles.footerHints}>
                <span><span style={styles.key}>↑↓</span> Navigate</span>
                <span><span style={styles.key}>↵</span> Select</span>
                <span><span style={styles.key}>ESC</span> Close</span>
              </div>
              <div style={styles.poweredBy}>
                Powered by <span style={styles.brand}>Zara AI</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes jmdt-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .jmdt-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          height: 48px;
          background: rgba(15, 15, 25, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(113, 162, 230, 0.3);
          border-radius: 12px;
          color: #fff;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 10px;
          cursor: pointer;
          z-index: 1000;
          transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .jmdt-fab:hover {
          border-color: #71a2e6;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(113, 162, 230, 0.3);
        }
        .jmdt-fab-icon { font-size: 18px; }
        .jmdt-fab-text { font-weight: 500; font-size: 14px; color: rgba(255,255,255,0.9); }
        .jmdt-fab-key { 
            font-size: 11px; 
            padding: 2px 6px; 
            background: rgba(255,255,255,0.1); 
            border-radius: 4px; 
            color: rgba(255,255,255,0.4); 
            border: 1px solid rgba(255,255,255,0.1);
        }
        .jmdt-chatbot-scrollbar::-webkit-scrollbar { width: 4px; }
        .jmdt-chatbot-scrollbar::-webkit-scrollbar-thumb { background: rgba(113, 162, 230, 0.2); border-radius: 4px; }
      `}</style>
    </>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    zIndex: 10000,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '80px',
  },
  modal: {
    width: '720px',
    maxWidth: 'calc(100vw - 32px)',
    background: '#111118',
    borderRadius: '16px',
    boxShadow: '0 32px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 120px)',
    overflow: 'hidden',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  searchHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    gap: '12px',
  },
  searchIcon: { fontSize: '20px', opacity: 0.8 },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '18px',
    outline: 'none',
    padding: '4px 0',
  },
  escHint: {
    fontSize: '10px',
    padding: '4px 8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '4px',
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
  },
  contentBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 10px',
    minHeight: '200px',
  },
  emptyState: { padding: '8px 10px' },
  recentLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '12px 12px 8px' },
  resultsList: { display: 'flex', flexDirection: 'column', gap: '4px' },
  resultItem: {
    padding: '12px 16px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  askAiItem: {
    margin: '4px 8px 12px',
    padding: '14px 18px',
    background: 'rgba(113, 162, 230, 0.08)',
    border: '1px solid rgba(113, 162, 230, 0.15)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  selectedItem: {
    background: 'rgba(113, 162, 230, 0.15)',
    boxShadow: 'inset 0 0 0 1px rgba(113, 162, 230, 0.3)',
  },
  sparkleIcon: { fontSize: '24px' },
  askAiLabel: { fontSize: '15px', fontWeight: 600, color: '#fff' },
  askAiSub: { fontSize: '12px', color: 'rgba(113, 162, 230, 0.8)', marginTop: '2px' },
  queryHighlight: { color: '#71a2e6' },
  resultTypeIcon: { width: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '18px' },
  resultTitle: { fontSize: '14px', fontWeight: 500, color: '#e3e3e8' },
  resultPath: { fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' },
  chatView: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' },
  msgRow: { display: 'flex' },
  bubble: { maxWidth: '85%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.6' },
  userBubble: { background: 'linear-gradient(135deg, #4c4cff, #71a2e6)', color: '#fff' },
  botBubble: { background: 'rgba(255,255,255,0.05)', color: '#e3e3e8', border: '1px solid rgba(255,255,255,0.05)' },
  cursor: { display: 'inline-block', width: '6px', height: '14px', background: '#71a2e6', marginLeft: '4px', animation: 'jmdt-blink 0.8s infinite' },
  footer: {
    padding: '12px 20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(0,0,0,0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerHints: { display: 'flex', gap: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.3)' },
  key: { 
    padding: '2px 4px', 
    background: 'rgba(255,255,255,0.08)', 
    borderRadius: '3px', 
    marginRight: '4px', 
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 'bold'
  },
  poweredBy: { fontSize: '11px', color: 'rgba(255,255,255,0.3)' },
  brand: { color: '#71a2e6', fontWeight: 600 },
  inlineCode: { background: 'rgba(113, 162, 230, 0.1)', padding: '2px 4px', borderRadius: '4px', fontFamily: 'monospace', color: '#71a2e6' },
  codeBlock: { background: '#09090c', padding: '12px', borderRadius: '8px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)', margin: '8px 0', fontSize: '13px' },
  textPara: { margin: '4px 0' },
  highlight: {
    background: 'transparent',
    color: '#71a2e6',
    fontWeight: 'bold',
    padding: 0,
    textDecoration: 'underline',
  },
  resultIconWrapper: {
    width: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  resultSnippet: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '4px',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontStyle: 'italic'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backBtn: {
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.4)',
    transition: 'color 0.2s',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    ':hover': { color: '#fff' }
  },
  clearBtn: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    ':hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' }
  },
  aiDisclaimer: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    padding: '0 20px 8px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '8px',
  },
  searchMeta: {
    fontSize: '13px',
    padding: '8px 4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  removeItem: {
    padding: '6px',
    borderRadius: '4px',
    color: 'rgba(255,255,255,0.2)',
    cursor: 'pointer',
    ':hover': { color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.05)' }
  },
};
