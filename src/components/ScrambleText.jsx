import React, { useEffect, useRef, useState } from 'react';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default function ScrambleText({
  text,
  highlight,
  baseColor = '#a0a0a0',
  highlightColor = '#ffffff',
  className,
  style,
  triggerOnHover = true,
  triggerOnMount = false,
  cursor,
}) {
  const resolvedCursor = cursor ?? (triggerOnHover ? 'pointer' : 'inherit');
  const [scrambled, setScrambled] = useState(null);
  const frameRef = useRef(null);
  const queueRef = useRef([]);
  const frameCountRef = useRef(0);
  const runningRef = useRef(false);

  const tick = () => {
    let output = '';
    let complete = 0;
    const queue = queueRef.current;
    const f = frameCountRef.current;
    for (let i = 0; i < queue.length; i++) {
      const q = queue[i];
      if (f >= q.end) {
        complete++;
        output += q.to;
      } else if (f >= q.start) {
        if (!q.char || Math.random() < 0.28) {
          q.char = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        output += q.char;
      } else {
        output += q.from;
      }
    }
    if (complete === queue.length) {
      runningRef.current = false;
      setScrambled(null);
      return;
    }
    setScrambled(output);
    frameCountRef.current = f + 1;
    frameRef.current = requestAnimationFrame(tick);
  };

  const scramble = () => {
    if (runningRef.current) return;
    runningRef.current = true;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    const oldText = scrambled ?? text;
    const length = Math.max(oldText.length, text.length);
    const queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = text[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + 8 + Math.floor(Math.random() * 20);
      queue.push({ from, to, start, end });
    }
    queueRef.current = queue;
    frameCountRef.current = 0;
    setScrambled(text);
    tick();
  };

  useEffect(() => {
    if (triggerOnMount) scramble();
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSettled = () => {
    if (!highlight) return text;
    const idx = text.indexOf(highlight);
    if (idx < 0) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ color: highlightColor }}>{highlight}</span>
        {text.slice(idx + highlight.length)}
      </>
    );
  };

  return (
    <span
      className={className}
      style={{ color: baseColor, ...style, cursor: resolvedCursor }}
      onMouseEnter={() => { if (triggerOnHover) scramble(); }}
    >
      {scrambled !== null
        ? scrambled.split('').map((char, i) => (
            <span key={i} style={{ color: i % 2 === 0 ? baseColor : '#ffffff' }}>
              {char}
            </span>
          ))
        : renderSettled()}
    </span>
  );
}
