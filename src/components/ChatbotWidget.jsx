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
const SYSTEM_PROMPT = `
You are Zara, the official documentation search assistant for JMDT (docs.jmdt.io).

Your purpose is to help users find information that already exists in the JMDT documentation. You behave like an intelligent documentation search engine that retrieves and explains information from the provided documentation context.

JMDT CORE CONCEPTS
- **JMDT**: Ethereum-based Layer 2 (L2) blockchain focused on scalability and privacy.
- **JMDN**: JMDT Decentralized Network node. Usually started via './jmdn' or './gossipnode'.
- **Consensus**: NNSS (Non-Negotiable Sequential Synchronization), a hybrid of Raft, Gossip Protocol, and Bloom Filters.
- **Privacy**: Uses Zero-Knowledge Proofs (ZKPs) and W3C-standard Decentralized Identity (DID).
- **Storage**: Integrates ImmuDB (tamper-proof database).
- **Sync**: FastSync protocol for efficient blockchain state synchronization.

TERMINOLOGY MAPPING
- 'JMDN' / 'node' / 'binary' -> Reference 'Running a Node' or 'CLI Module'.
- 'flow of tokens' / 'distribution' -> Reference 'Tokenomics' (ERC-20 model, foundation, staking).
- 'DID' -> Reference 'Decentralized Identity' or 'DID Module'.
- 'FastSync' -> Efficient block synchronization via Bloom filters.
- 'defaluts' -> Assume the user means 'defaults' in CLI flags or environment config.

STRICT BEHAVIOR RULES

1. SOURCE OF TRUTH
Only use the retrieved JMDT documentation context in the current session.
Do not use outside knowledge, assumptions, or training data.
Do not invent commands, defaults, configuration values, steps, or explanations.

2. SEARCH-FIRST BEHAVIOR
Treat the user's message as a search query first.
Users may make spelling mistakes, use incomplete wording, abbreviations, or slightly incorrect product terms.
When a query appears misspelled or imprecise, try to interpret the likely intended meaning only from the available retrieved documentation context.
Only make that interpretation if it is strongly supported by the retrieved context. Otherwise ask the user to clarify.

3. DO NOT FAIL TOO EARLY
Do not immediately say "I couldn't find that information" just because the wording is imperfect.
First, try to map the query to the closest matching documented concept in the retrieved context.

4. AMBIGUITY HANDLING
If the question is vague, broad, or ambiguous, ask a short clarification question.
If there is one highly likely interpretation supported by the documentation context, you may say:
"If you mean [documented concept], here’s what the documentation says:"
Then answer only from the documentation context.

5. STRICT RAG BOUNDARY
Every factual statement must be grounded in the retrieved documentation context.
If something is not clearly present in the context, do not add it.
Do not infer technical steps beyond what the docs explicitly say.

6. NO GENERAL AI HELP
Do not provide:
- general coding help
- architecture advice
- best practices or troubleshooting guesses not present in docs
- commands not explicitly shown in docs

7. RESPONSE STYLE
- Be concise, clear, and conversational.
- Sound like a helpful documentation search assistant.
- Use structured steps and code blocks where available in the docs.
- Reproduce commands and configuration examples faithfully; do not modify them.

8. WHEN NOTHING RELEVANT IS FOUND
Only after trying to interpret the query against the retrieved context, say:
"I couldn't find that in the current JMDT documentation. Please check docs.jmdt.io or try a more specific search."

ROLE SUMMARY
You are a JMDT documentation search assistant. You search, interpret, and explain only what exists in retrieved JMDT docs. Handle imperfect queries gracefully, but never go beyond the documentation context.
`;

const GEMINI_MODEL = 'gemini-2.0-flash';
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
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) segments.push(<span key={last}>{line.slice(last, m.index)}</span>);
    const val = m[0];
    if (val.startsWith('`')) {
      segments.push(<code key={m.index} style={styles.inlineCode}>{val.slice(1, -1)}</code>);
    } else if (val.startsWith('**')) {
      segments.push(<strong key={m.index}>{val.slice(2, -2)}</strong>);
    } else if (val.startsWith('*')) {
      segments.push(<em key={m.index}>{val.slice(1, -1)}</em>);
    } else if (val.startsWith('[')) {
      segments.push(
        <a key={m.index} href={m[3]} target="_blank" rel="noopener noreferrer" style={styles.markdownLink}>
          {m[2]}
        </a>
      );
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
          <div key={i}>
            {lines.map((line, j) => {
              const trimmed = line.trim();
              
              // Headers
              const hMatch = line.match(/^(#+)\s+(.*)/);
              if (hMatch) {
                return (
                  <div key={j} style={styles.markdownHeader}>
                    <InlineText line={hMatch[2]} />
                  </div>
                );
              }
              
              // List items
              const lMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)/);
              if (lMatch) {
                return (
                  <div key={j} style={styles.markdownListItem}>
                    <InlineText line={lMatch[3]} />
                  </div>
                );
              }
              
              // Empty line
              if (!trimmed && j < lines.length - 1) return <div key={j} style={{ height: '8px' }} />;
              if (!trimmed) return null;
              
              // Paragraph
              return (
                <p key={j} style={styles.textPara}>
                  <InlineText line={line} />
                </p>
              );
            })}
          </div>
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
      return [WELCOME_MESSAGE];
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
  const chatViewRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // Save persistence
  useEffect(() => {
    localStorage.setItem('jmdt_recent_docs', JSON.stringify(recentDocs));
  }, [recentDocs]);
  useEffect(() => {
    localStorage.setItem('jmdt_recent_chats', JSON.stringify(recentChats));
  }, [recentChats]);
  
  const miniSearchRef = useRef(
    new MiniSearch({
      fields: ['title', 'parentTitle', 'content', 'name'],
      storeFields: ['title', 'parentTitle', 'content', 'name', 'anchor'],
      searchOptions: {
        boost: { title: 4, parentTitle: 2, name: 1 },
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
    const el = chatViewRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(frame);
  }, [messages]);

  useEffect(() => {
    if (view !== 'search') return;
    if (!query.trim()) {
      setSearchResults([]);
      setSelectedIndex(0);
      return;
    }

    // Use raw query, let MiniSearch fuzzy and AI handle the rest
    const cleanQuery = query.trim();

    const results = miniSearchRef.current.search(cleanQuery).slice(0, 6);
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
    setQuery('');
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
    setRecentChats([]); // Also clear recent conversations
    setView('search');
    localStorage.removeItem('jmdt_chat_history');
    localStorage.removeItem('jmdt_recent_chats');
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

    const cleanQuery = userText.trim();

    const searchResultsForAI = miniSearchRef.current.search(cleanQuery).slice(0, 4);
    const relevantContext = searchResultsForAI
      .map(res => `=== ${res.parentTitle} > ${res.title} ===\n${res.content}`)
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
          requestAnimationFrame(() => {
            if (chatViewRef.current) chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight;
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
              const chatText = recentChats[selectedIndex - recentDocs.length];
              setQuery(chatText);
              setView('chat');
              setSelectedIndex(0);
              
              // Find the message index to scroll to
              setTimeout(() => {
                const idx = [...messages].reverse().findIndex(m => m.role === 'user' && m.content === chatText);
                if (idx !== -1) {
                  const actualIdx = messages.length - 1 - idx;
                  const el = document.getElementById(`msg-${actualIdx}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
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
      if (query.trim()) handleTriggerChat(query);
    }
  };

  const stopStreaming = () => abortRef.current?.abort();

  return (
    <>
      <button className="jmdt-fab" onClick={() => setIsOpen(true)} title="Quick Search & AI">
        <img src="/icons/search_icon.svg" alt="" width="18" height="18" className="jmdt-fab-icon" />
        <span className="jmdt-fab-text">Search docs</span>
      </button>

      {isOpen && (
        <div style={styles.backdrop} onClick={() => setIsOpen(false)}>
          {/* Width-lock wrapper — everything inside matches search bar width */}
          <div style={styles.widthLock} onClick={e => e.stopPropagation()}>
          {/* Search bar — standalone floating element */}
          <div style={styles.searchBar}>
            <div style={styles.searchHeader}>
              {view === 'chat' ? (
                <div style={styles.backBtn} onClick={() => setView('search')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                </div>
              ) : (
                <img src="/icons/search_icon.svg" alt="" width="16" height="16" style={{ flexShrink: 0, opacity: 0.7 }} />
              )}
              <input
                ref={inputRef}
                style={styles.searchInput}
                placeholder={view === 'chat' ? "Ask Zara another question..." : "Search docs..."}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexShrink: 0 }}>
                <div
                  style={{
                    ...styles.zaraChatBtn,
                    ...((!query.trim() && view === 'search') ? styles.zaraChatBtnDisabled : {}),
                  }}
                  onClick={() => {
                    if (!query.trim() && view === 'search') return;
                    if (view === 'chat') clearChat();
                    else { handleTriggerChat(); }
                  }}
                >
                  <span style={styles.zaraChatBtnText}>ZARA CHAT</span>
                </div>
                <img
                  src="/icons/close.svg"
                  alt="Close"
                  width="16"
                  height="16"
                  style={{ display: 'block', flexShrink: 0, cursor: 'pointer', opacity: 0.6 }}
                  onClick={() => setIsOpen(false)}
                />
              </div>
            </div>
          </div>

          {/* Content — separate floating card below the search bar */}
          <div className="jmdt-no-scroll" style={styles.contentBody} onClick={e => e.stopPropagation()}>
              {view === 'search' ? (
                <div style={styles.resultsList}>
                  {query && (
                    <div
                      style={{...styles.askAiItem, ...(selectedIndex === 0 ? styles.selectedItem : {})}}
                      onClick={() => handleTriggerChat()}
                    >
                      <div style={styles.sparkleIcon}>✦</div>
                      <div>
                        <div style={styles.askAiLabel}>Ask Zara: <span style={styles.queryHighlight}>{query}</span></div>
                        <div style={styles.askAiSub}>Instant answers from documentation</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div ref={chatViewRef} className="jmdt-no-scroll" style={styles.chatView}>
                  {/* Disclaimer */}
                  <div style={styles.aiDisclaimer}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0,opacity:0.5}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Answers are generated with AI which can make mistakes. Verify responses.
                  </div>

                  {/* Messages */}
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      id={`msg-${i}`}
                      style={{ ...styles.msgRow, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                    >
                      <div style={{ ...styles.bubble, ...(msg.role === 'user' ? styles.userBubble : styles.botBubble) }}>
                        <MessageContent content={msg.content} />
                        {msg.streaming && <span style={styles.cursor} />}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} style={{height: 1}} />
                </div>
              )}
          </div>
          </div>{/* end widthLock */}

          {/* Footer pinned to very bottom of viewport */}
          <div style={styles.footer} onClick={e => e.stopPropagation()}>
            <div style={styles.footerHints}>
              <span><span style={styles.key}>↑↓</span> NAVIGATE</span>
              <span><span style={styles.key}>↵</span> SELECT</span>
              <span><span style={styles.key}>ESC</span> CLOSE</span>
            </div>
            <div style={styles.poweredBy}>
              Powered by <span style={styles.brand}>Zara AI</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes jmdt-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .jmdt-fab {
          position: fixed;
          bottom: 56px;
          right: 75px;
          width: 119px;
          height: 45px;
          padding: 13px;
          border-radius: 4px;
          /* solid bg so button is visible against dark hero */
          background: #1a1a1a;
          /* gradient border via background-clip trick (border-image kills border-radius) */
          background-image:
            linear-gradient(#1a1a1a, #1a1a1a),
            linear-gradient(180deg, rgba(6, 6, 6, 0.22) 0%, rgba(71, 42, 92, 0.22) 100%);
          background-origin: padding-box, border-box;
          background-clip: padding-box, border-box;
          border: 1px solid transparent;
          backdrop-filter: blur(3.9px);
          box-shadow: 0px 2px 7.7px 0px rgba(124, 83, 164, 0.17);
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          z-index: 9999;
        }
        .jmdt-fab-icon { width: 18px; height: 18px; flex-shrink: 0; }
        .jmdt-fab-text {
          font-family: 'Iosevka Charon Mono', 'Courier New', monospace;
          font-weight: 400;
          font-size: 12px;
          line-height: 20px;
          letter-spacing: 0;
          vertical-align: middle;
          color: #717173;
          white-space: nowrap;
        }
        /* Hide scrollbar in content area */
        .jmdt-no-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.92)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '140px',
  },
  /* width-lock container — single source of truth for width */
  widthLock: {
    width: '567px',
    maxWidth: 'calc(100vw - 32px)',
    display: 'flex',
    flexDirection: 'column',
  },
  /* search bar inherits width from widthLock */
  searchBar: {
    width: '100%',
    height: '45px',
    background: 'rgba(26, 27, 31, 0.72)',
    border: '1px solid #222222',
    borderRadius: '8px',
    flexShrink: 0,
    boxSizing: 'border-box',
  },
  /* content area — 32px below search bar, same width */
  contentBody: {
    width: '100%',
    marginTop: '32px',
  },
  searchHeader: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '45px',
    background: 'rgba(26, 27, 31, 0.72)',
    padding: '0 13px',
    gap: '10px',
    borderRadius: '10px',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon Mono', 'Courier New', monospace",
    fontWeight: 300,
    letterSpacing: '0px',
    outline: 'none',
    padding: '0',
  },
  zaraChatBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '59px',
    height: '21px',
    padding: '2px 6px',
    borderRadius: '2px',
    background: 'linear-gradient(#0a0a0a, #0a0a0a) padding-box, linear-gradient(176.64deg, #ABABAB -176.68%, #000000 147.99%) border-box',
    border: '1px solid transparent',
    cursor: 'pointer',
    flexShrink: 0,
    boxSizing: 'border-box',
  },
  zaraChatBtnDisabled: {
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  zaraChatBtnText: {
    fontFamily: "'Iosevka Charon Mono', 'Courier New', monospace",
    fontWeight: 300,
    fontSize: '10px',
    lineHeight: '15px',
    letterSpacing: '0px',
    textTransform: 'uppercase',
    verticalAlign: 'middle',
    background: 'linear-gradient(180deg, #C9C9C9 0%, #636363 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    whiteSpace: 'nowrap',
  },
  emptyState: { padding: '8px 10px' },
  recentLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '12px 12px 8px' },
  resultsList: { display: 'flex', flexDirection: 'column' },
  resultItem: {
    padding: '12px 16px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  /* Suggestion card — exact Figma: 569×79, bg #13131694, border #131316, blur 50px */
  askAiItem: {
    width: '100%',
    height: '79px',
    padding: '0 16px',
    background: 'rgba(19, 19, 22, 0.58)',
    border: '1px solid #131316',
    backdropFilter: 'blur(50px)',
    WebkitBackdropFilter: 'blur(50px)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '27px',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  selectedItem: {
    background: 'rgba(19, 19, 22, 0.75)',
  },
  sparkleIcon: {
    fontSize: '20px',
    color: '#818cf8',
    flexShrink: 0,
    lineHeight: 1,
  },
  askAiLabel: {
    fontFamily: "'Iosevka Charon Mono', monospace",
    fontSize: '12px',
    fontWeight: 400,
    color: '#e4e4f0',
  },
  askAiSub: {
    fontFamily: "'Iosevka Charon Mono', monospace",
    fontSize: '11px',
    color: '#6366f1',
    marginTop: '4px',
    fontWeight: 300,
  },
  queryHighlight: { color: '#818cf8' },
  resultTypeIcon: { width: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '18px' },
  resultTitle: { fontSize: '14px', fontWeight: 500, color: '#e3e3e8' },
  resultPath: { fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' },
  msgRow: { display: 'flex' },
  bubble: {
    fontFamily: "'Inter', '-apple-system', 'BlinkMacSystemFont', sans-serif",
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0px',
  },
  /* User bubble — exact Figma specs */
  userBubble: {
    background: 'linear-gradient(138.45deg, #5056FC 10.83%, #6E9BE8 100%)',
    color: '#ffffff',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '2px',
    borderBottomRightRadius: '8px',
    borderBottomLeftRadius: '8px',
    padding: '16px',
    maxWidth: '320px',
    fontFamily: "'Inter', '-apple-system', sans-serif",
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
  },
  /* Bot bubble — exact Figma: 471px wide, bg #13131694, border #131316, radius 8px, padding 20px, gap 10px */
  botBubble: {
    background: 'rgba(19, 19, 22, 0.58)',
    border: '1px solid #131316',
    borderRadius: '8px',
    padding: '20px',
    gap: '10px',
    color: '#d4d4dc',
    width: '471px',
    maxWidth: '100%',
    backdropFilter: 'blur(50px)',
    WebkitBackdropFilter: 'blur(50px)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    fontFamily: "'Inter', '-apple-system', sans-serif",
    fontWeight: 300,
    fontSize: '12px',
    lineHeight: '18px',
    letterSpacing: '0px',
    verticalAlign: 'middle',
  },
  cursor: { display: 'inline-block', width: '6px', height: '14px', background: '#818cf8', marginLeft: '4px', animation: 'jmdt-blink 0.8s infinite' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '14px 24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(12, 12, 13, 0.8)', /* #0C0C0DCC */
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerHints: {
    display: 'flex',
    gap: '16px',
    fontFamily: "'Iosevka Charon Mono', 'Courier New', monospace",
    fontWeight: 300,
    fontSize: '11px',
    lineHeight: '15px',
    letterSpacing: '0px',
    verticalAlign: 'middle',
    textTransform: 'uppercase',
    color: '#C4C5D9',
  },
  key: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '25px',
    height: '15px',
    paddingLeft: '4px',
    paddingRight: '4px',
    borderRadius: '2px',
    border: '0.4px solid #333333',
    background: 'linear-gradient(180deg, rgba(52, 53, 57, 0.32) 0%, rgba(145, 148, 159, 0.32) 100%)',
    marginRight: '5px',
    color: 'rgba(255,255,255,0.5)',
    fontFamily: "'Iosevka Charon Mono', monospace",
    fontSize: '10px',
    boxSizing: 'border-box',
  },
  poweredBy: {
    fontFamily: "'Iosevka Charon Mono', 'Courier New', monospace",
    fontWeight: 400,
    fontSize: '10px',
    lineHeight: '15px',
    letterSpacing: '0px',
    verticalAlign: 'middle',
    color: '#888888',
  },
  brand: {
    fontFamily: "'Iosevka Charon Mono', 'Courier New', monospace",
    fontWeight: 400,
    fontSize: '10px',
    lineHeight: '15px',
    letterSpacing: '0px',
    verticalAlign: 'middle',
    color: '#FFFFFF',
  },
  inlineCode: { background: 'rgba(113, 162, 230, 0.1)', padding: '2px 4px', borderRadius: '4px', fontFamily: 'monospace', color: '#71a2e6' },
  markdownLink: { color: '#818cf8', textDecoration: 'none', fontWeight: 500 },
  codeBlock: { background: '#09090c', padding: '12px', borderRadius: '8px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)', margin: '8px 0', fontSize: '13px' },
  textPara: { margin: '8px 0', lineHeight: '1.6' },
  markdownHeader: {
    fontFamily: "'Inter', '-apple-system', sans-serif",
    fontWeight: 600,
    fontSize: '10px',
    lineHeight: '16px',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    verticalAlign: 'middle',
    color: '#FFFFFF',
    margin: '12px 0 6px',
  },
  markdownList: { margin: '8px 0', paddingLeft: '20px' },
  markdownListItem: { margin: '6px 0', display: 'list-item', listStyleType: 'disc', listStylePosition: 'outside', marginLeft: '20px' },
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
  chatView: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    padding: '12px 0 16px',
    overflowY: 'scroll',
    maxHeight: 'calc(100vh - 260px)',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  aiDisclaimer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontFamily: "'Inter', '-apple-system', sans-serif",
    fontWeight: 400,
    fontSize: '10px',
    lineHeight: '16px',
    letterSpacing: '0px',
    textAlign: 'center',
    verticalAlign: 'middle',
    color: '#C7C47B',
    padding: '0 0 10px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  searchMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: "'Iosevka Charon Mono', monospace",
    fontSize: '10px',
    fontWeight: 300,
    color: 'rgba(255,255,255,0.3)',
    padding: '0 0 4px',
  },
  removeItem: {
    padding: '6px',
    borderRadius: '4px',
    color: 'rgba(255,255,255,0.2)',
    cursor: 'pointer',
    ':hover': { color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.05)' }
  },
};
