import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Grip, GripHorizontal, MessageCircle, Send, X } from 'lucide-react';

const VIEWPORT_GAP = 8;
const DEFAULT_CHAT_SIZE = { width: 340, height: 440 };
const MIN_CHAT_SIZE = { width: 280, height: 330 };
const BUTTON_SIZE = 54;
const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s<]+)|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getSafeChatSize(size = DEFAULT_CHAT_SIZE) {
  const maxWidth = Math.max(MIN_CHAT_SIZE.width, window.innerWidth - VIEWPORT_GAP * 2);
  const maxHeight = Math.max(MIN_CHAT_SIZE.height, window.innerHeight - VIEWPORT_GAP * 2);

  return {
    width: clamp(size.width, MIN_CHAT_SIZE.width, maxWidth),
    height: clamp(size.height, MIN_CHAT_SIZE.height, maxHeight),
  };
}

function clampWindowPosition(position, size) {
  const maxLeft = Math.max(VIEWPORT_GAP, window.innerWidth - size.width - VIEWPORT_GAP);
  const maxTop = Math.max(VIEWPORT_GAP, window.innerHeight - size.height - VIEWPORT_GAP);

  return {
    left: clamp(position.left, VIEWPORT_GAP, maxLeft),
    top: clamp(position.top, VIEWPORT_GAP, maxTop),
  };
}

function getInitialWindowState(anchorPos) {
  const size = getSafeChatSize();
  const margin = 12;
  let left = anchorPos.x - size.width - margin;
  let top = anchorPos.y - size.height + 50;

  if (left < VIEWPORT_GAP) left = anchorPos.x + BUTTON_SIZE + margin;

  return {
    ...size,
    ...clampWindowPosition({ left, top }, size),
  };
}

function splitTrailingPunctuation(value) {
  let text = value;
  let trailing = '';

  while (/[.,!?;:]$/.test(text)) {
    trailing = text.slice(-1) + trailing;
    text = text.slice(0, -1);
  }

  return { text, trailing };
}

function renderLinkedText(content, role) {
  const parts = [];
  const linkColor = role === 'user' ? '#fff' : '#7cc4ff';
  let lastIndex = 0;
  let match;

  LINK_PATTERN.lastIndex = 0;

  while ((match = LINK_PATTERN.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    const markdownLabel = match[1];
    const markdownUrl = match[2];
    const bareUrl = match[3];
    const email = match[4];
    const rawText = markdownLabel || bareUrl || email;
    let href = markdownUrl || bareUrl || `mailto:${email}`;
    let label = rawText;
    let trailing = '';

    if (!markdownUrl) {
      const cleaned = splitTrailingPunctuation(rawText);
      label = cleaned.text;
      trailing = cleaned.trailing;
      href = bareUrl ? cleaned.text : `mailto:${cleaned.text}`;
    }

    parts.push(
      <a
        key={`link-${match.index}`}
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
        onClick={event => event.stopPropagation()}
        style={{
          color: linkColor,
          fontWeight: 600,
          textDecoration: 'underline',
          textUnderlineOffset: 2,
          overflowWrap: 'anywhere',
        }}
      >
        {label}
      </a>
    );

    if (trailing) parts.push(trailing);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
}

function AIChatWindow({ anchorPos, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Noah's AI assistant. Ask me about his projects, certifications, or leadership." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [windowState, setWindowState] = useState(() => getInitialWindowState(anchorPos));
  const [movingWindow, setMovingWindow] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const windowAction = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onPointerMove = (event) => {
      const action = windowAction.current;
      if (!action) return;

      const dx = event.clientX - action.startX;
      const dy = event.clientY - action.startY;

      if (action.type === 'drag') {
        const size = { width: action.startWidth, height: action.startHeight };
        const position = clampWindowPosition({
          left: action.startLeft + dx,
          top: action.startTop + dy,
        }, size);

        setWindowState(prev => ({ ...prev, ...position }));
        return;
      }

      const edge = action.edge;
      let width = action.startWidth;
      let height = action.startHeight;
      let left = action.startLeft;
      let top = action.startTop;

      if (edge.includes('e')) {
        const maxWidth = Math.max(MIN_CHAT_SIZE.width, window.innerWidth - action.startLeft - VIEWPORT_GAP);
        width = clamp(action.startWidth + dx, MIN_CHAT_SIZE.width, maxWidth);
      }

      if (edge.includes('s')) {
        const maxHeight = Math.max(MIN_CHAT_SIZE.height, window.innerHeight - action.startTop - VIEWPORT_GAP);
        height = clamp(action.startHeight + dy, MIN_CHAT_SIZE.height, maxHeight);
      }

      if (edge.includes('w')) {
        const right = action.startLeft + action.startWidth;
        const maxWidth = Math.max(MIN_CHAT_SIZE.width, right - VIEWPORT_GAP);
        width = clamp(action.startWidth - dx, MIN_CHAT_SIZE.width, maxWidth);
        left = right - width;
      }

      if (edge.includes('n')) {
        const bottom = action.startTop + action.startHeight;
        const maxHeight = Math.max(MIN_CHAT_SIZE.height, bottom - VIEWPORT_GAP);
        height = clamp(action.startHeight - dy, MIN_CHAT_SIZE.height, maxHeight);
        top = bottom - height;
      }

      const size = getSafeChatSize({ width, height });
      const position = clampWindowPosition({ left, top }, size);
      setWindowState({ ...size, ...position });
    };

    const endInteraction = () => {
      if (!windowAction.current) return;

      windowAction.current = null;
      setMovingWindow(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    const onResize = () => {
      setWindowState(prev => {
        const size = getSafeChatSize(prev);
        return { ...size, ...clampWindowPosition(prev, size) };
      });
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endInteraction);
    window.addEventListener('pointercancel', endInteraction);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endInteraction);
      window.removeEventListener('pointercancel', endInteraction);
      window.removeEventListener('resize', onResize);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  const startWindowDrag = useCallback((event) => {
    if (event.button !== undefined && event.button !== 0) return;

    windowAction.current = {
      type: 'drag',
      startX: event.clientX,
      startY: event.clientY,
      startLeft: windowState.left,
      startTop: windowState.top,
      startWidth: windowState.width,
      startHeight: windowState.height,
    };

    setMovingWindow(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    event.preventDefault();
  }, [windowState]);

  const startWindowResize = useCallback((event, edge) => {
    if (event.button !== undefined && event.button !== 0) return;

    windowAction.current = {
      type: 'resize',
      edge,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: windowState.left,
      startTop: windowState.top,
      startWidth: windowState.width,
      startHeight: windowState.height,
    };

    setMovingWindow(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = `${edge}-resize`;
    event.preventDefault();
    event.stopPropagation();
  }, [windowState]);

  const handleSend = useCallback(async () => {
    const userMessage = input.trim();
    if (!userMessage || loading) return;

    setInput('');
    setLoading(true);

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const text = await response.text();
        setMessages(prev => [...prev, { role: 'assistant', content: text || 'AI chat is temporarily unavailable. Please try again later.' }]);
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
        for (const line of lines) {
          const jsonStr = line.replace('data: ', '');
          if (jsonStr === '[DONE]') break;
          try {
            const data = JSON.parse(jsonStr);
            const text = data.choices?.[0]?.delta?.content || '';
            assistantContent += text;
            setMessages(prev => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last.role === 'assistant') {
                updated[updated.length - 1] = { ...last, content: assistantContent };
              }
              return updated;
            });
          } catch (e) {}
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading]);

  const resizeHandles = [
    { edge: 'n', style: { top: 0, left: 14, right: 14, height: 7, cursor: 'n-resize' } },
    { edge: 's', style: { bottom: 0, left: 14, right: 14, height: 7, cursor: 's-resize' } },
    { edge: 'e', style: { right: 0, top: 14, bottom: 14, width: 7, cursor: 'e-resize' } },
    { edge: 'w', style: { left: 0, top: 14, bottom: 14, width: 7, cursor: 'w-resize' } },
    { edge: 'ne', style: { top: 0, right: 0, width: 16, height: 16, cursor: 'ne-resize' } },
    { edge: 'nw', style: { top: 0, left: 0, width: 16, height: 16, cursor: 'nw-resize' } },
    { edge: 'se', style: { bottom: 0, right: 0, width: 16, height: 16, cursor: 'se-resize' } },
    { edge: 'sw', style: { bottom: 0, left: 0, width: 16, height: 16, cursor: 'sw-resize' } },
  ];

  return (
    <div style={{
      position: 'fixed',
      left: windowState.left,
      top: windowState.top,
      width: windowState.width,
      height: windowState.height,
      minWidth: MIN_CHAT_SIZE.width,
      minHeight: MIN_CHAT_SIZE.height,
      background: 'rgba(18,18,20,0.97)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      borderRadius: 16,
      boxShadow: movingWindow
        ? '0 20px 54px rgba(0,0,0,0.66), 0 0 0 1px rgba(92,174,255,0.28)'
        : '0 16px 48px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'chatIn 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      zIndex: 90,
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      transition: movingWindow ? 'none' : 'box-shadow 0.18s ease',
    }}>
      <div
        onPointerDown={startWindowDrag}
        style={{
          padding: '10px 12px 10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: movingWindow ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.035)',
          cursor: movingWindow ? 'grabbing' : 'grab',
          flexShrink: 0,
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: 'linear-gradient(135deg, #2491ff, #0a6ed9)',
            boxShadow: '0 5px 14px rgba(20,124,229,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}>N</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>Noah's AI</div>
            <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Ask me anything about Noah</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <GripHorizontal size={16} color="rgba(255,255,255,0.26)" aria-hidden="true" />
          <button
            onClick={onClose}
            onPointerDown={event => event.stopPropagation()}
            aria-label="Close chat"
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.48)', cursor: 'pointer', padding: 5, borderRadius: 7, display: 'flex', alignItems: 'center', transition: 'color 0.15s, background 0.15s' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.48)';
              e.currentTarget.style.background = 'none';
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '11px 12px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '84%',
            background: msg.role === 'user'
              ? 'linear-gradient(180deg, #1687f5 0%, #0d71d8 100%)'
              : 'rgba(255,255,255,0.085)',
            color: '#fff',
            borderRadius: msg.role === 'user' ? '13px 13px 4px 13px' : '13px 13px 13px 4px',
            padding: '8px 11px',
            fontSize: 12.5,
            lineHeight: 1.48,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
            boxShadow: msg.role === 'user' ? '0 6px 16px rgba(20,124,229,0.22)' : 'none',
          }}>
            {msg.content ? renderLinkedText(msg.content, msg.role) : (loading && msg.role === 'assistant' ? (
              <span style={{ opacity: 0.5 }}>...</span>
            ) : '')}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{
        position: 'relative',
        padding: '9px 10px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        gap: 8,
        background: 'rgba(0,0,0,0.3)',
        flexShrink: 0,
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Ask about Noah..."
          style={{
            flex: 1,
            minWidth: 0,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            padding: '8px 11px',
            color: '#fff',
            fontSize: 12.5,
            outline: 'none',
            fontFamily: 'inherit',
          }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          aria-label="Send message"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: loading || !input.trim()
              ? 'rgba(255,255,255,0.1)'
              : 'linear-gradient(180deg, #1687f5 0%, #0d71d8 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: loading || !input.trim() ? 'rgba(255,255,255,0.32)' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s, transform 0.15s, box-shadow 0.15s',
            boxShadow: loading || !input.trim() ? 'none' : '0 5px 14px rgba(20,124,229,0.28)',
            flexShrink: 0,
          }}
        >
          <Send size={14} />
        </button>
        <Grip
          size={13}
          color="rgba(255,255,255,0.28)"
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 3,
            bottom: 3,
            pointerEvents: 'none',
          }}
        />
      </div>

      {resizeHandles.map(handle => (
        <div
          key={handle.edge}
          onPointerDown={event => startWindowResize(event, handle.edge)}
          style={{
            position: 'absolute',
            zIndex: 4,
            touchAction: 'none',
            ...handle.style,
          }}
        />
      ))}

      <style>{`
        @keyframes chatIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function AIChatBubble() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(() => ({
    x: window.innerWidth - BUTTON_SIZE - 16,
    y: window.innerHeight - BUTTON_SIZE - 16,
  }));
  const [hovered, setHovered] = useState(false);
  const [draggingButton, setDraggingButton] = useState(false);
  const dragState = useRef(null);

  const clampButtonPosition = useCallback((x, y) => ({
    x: clamp(x, BUTTON_SIZE / 2 + VIEWPORT_GAP, window.innerWidth - BUTTON_SIZE / 2 - VIEWPORT_GAP),
    y: clamp(y, BUTTON_SIZE / 2 + VIEWPORT_GAP, window.innerHeight - BUTTON_SIZE / 2 - VIEWPORT_GAP),
  }), []);

  useEffect(() => {
    const onResize = () => {
      setPos(prev => clampButtonPosition(prev.x, prev.y));
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [clampButtonPosition]);

  const onPointerDown = useCallback((event) => {
    if (event.button !== undefined && event.button !== 0) return;

    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPos: pos,
      moved: false,
    };

    setDraggingButton(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }, [pos]);

  const onPointerMove = useCallback((event) => {
    const drag = dragState.current;
    if (!drag) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.hypot(dx, dy) > 4) drag.moved = true;

    setPos(clampButtonPosition(
      drag.startPos.x + dx,
      drag.startPos.y + dy
    ));
  }, [clampButtonPosition]);

  const finishPointer = useCallback((event) => {
    const drag = dragState.current;
    if (!drag) return;

    dragState.current = null;
    setDraggingButton(false);
    event.currentTarget.releasePointerCapture?.(drag.pointerId);

    if (!drag.moved) {
      setOpen(current => !current);
    }
  }, []);

  return (
    <>
      <button
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="Ask Noah's AI"
        aria-label={open ? "Close Noah's AI chat" : "Open Noah's AI chat"}
        style={{
          position: 'fixed',
          left: pos.x - BUTTON_SIZE / 2,
          top: pos.y - BUTTON_SIZE / 2,
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: '50%',
          background: open
            ? 'linear-gradient(135deg, #0b76e8, #075fbd)'
            : 'linear-gradient(135deg, #2795ff, #0b73df)',
          border: '1px solid rgba(255,255,255,0.28)',
          boxShadow: open || hovered
            ? '0 9px 28px rgba(20,124,229,0.48), inset 0 1px 0 rgba(255,255,255,0.22)'
            : '0 7px 22px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: draggingButton ? 'grabbing' : 'grab',
          zIndex: 100,
          transform: draggingButton ? 'scale(0.96)' : hovered ? 'scale(1.04)' : 'scale(1)',
          transition: draggingButton ? 'none' : 'background 0.18s, box-shadow 0.18s, transform 0.18s',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        {open
          ? <X size={23} color="#fff" />
          : <MessageCircle size={23} color="#fff" />}
      </button>

      {open && <AIChatWindow anchorPos={pos} onClose={() => setOpen(false)} />}
    </>
  );
}
