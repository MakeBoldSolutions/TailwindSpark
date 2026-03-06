import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useSignalR } from '../hooks/useSignalR';
import type { AIVariant, SignalRConnectionStatus } from '../types/chat-api';
import { formatMessageTime, SIGNALR_CONFIG } from '../types/chat-api';

interface ChatInterfaceProps {
  variant: AIVariant;
  onBack: () => void;
}

const statusColors: Record<SignalRConnectionStatus, string> = {
  connected: 'bg-green-500',
  connecting: 'bg-yellow-500 animate-pulse',
  reconnecting: 'bg-yellow-500 animate-pulse',
  disconnected: 'bg-red-500',
  disconnecting: 'bg-gray-400',
};

export default function ChatInterface({ variant, onBack }: ChatInterfaceProps) {
  const {
    messages,
    connectionStatus,
    isAssistantTyping,
    connectionError,
    sendMessage,
    clearMessages,
  } = useSignalR(variant);
  const [input, setInput] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(() => {
    return !localStorage.getItem(SIGNALR_CONFIG.USER_NAME_KEY);
  });
  const [nameInput, setNameInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAssistantTyping]);

  const handleNameSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim() || SIGNALR_CONFIG.DEFAULT_USER_NAME;
    localStorage.setItem(SIGNALR_CONFIG.USER_NAME_KEY, name);
    setShowNamePrompt(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && connectionStatus === 'connected') {
      sendMessage(input.trim());
      setInput('');
    }
  };

  if (showNamePrompt) {
    return (
      <div className="flex h-[600px] flex-col items-center justify-center rounded-lg border border-border bg-surface p-8 shadow-sm">
        <h3 className="mb-2 text-xl font-semibold text-text">Welcome to AI Chat</h3>
        <p className="mb-6 text-sm text-text-muted">Enter your name to get started</p>
        <form onSubmit={handleNameSubmit} className="flex w-full max-w-sm gap-2">
          <input
            type="text"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            placeholder="Your name..."
            maxLength={50}
            className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            autoFocus
            aria-label="Your display name"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white transition hover:bg-brand/90"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] flex-col rounded-lg border border-border bg-surface shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-md px-2 py-1 text-sm text-text-muted transition hover:bg-surface-alt hover:text-text"
            aria-label="Back to variant selection"
          >
            ← Back
          </button>
          <div>
            <h3 className="font-semibold text-text">{variant.name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className={`inline-block h-2 w-2 rounded-full ${statusColors[connectionStatus]}`} />
              {connectionStatus}
            </div>
          </div>
        </div>
        <button
          onClick={clearMessages}
          className="rounded-md px-3 py-1 text-xs text-text-muted transition hover:bg-surface-alt hover:text-text"
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {connectionError && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
          {connectionError}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-text-muted">
            Send a message to start chatting with {variant.name}
          </p>
        )}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                msg.role === 'user'
                  ? 'bg-brand text-white'
                  : 'bg-surface-alt text-text'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">
                {msg.content || (msg.streaming ? '...' : '')}
              </p>
              <span className="mt-1 block text-right text-xs opacity-60">
                {formatMessageTime(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}
        {isAssistantTyping && (
          <div className="mb-4 flex justify-start">
            <div className="rounded-lg bg-surface-alt px-4 py-2.5">
              <span className="text-sm text-text-muted">Typing...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border px-4 py-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          maxLength={SIGNALR_CONFIG.MAX_MESSAGE_LENGTH}
          placeholder={
            connectionStatus === 'connected'
              ? 'Type your message...'
              : 'Connecting...'
          }
          disabled={connectionStatus !== 'connected'}
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
          aria-label="Chat message"
        />
        <button
          type="submit"
          disabled={connectionStatus !== 'connected' || !input.trim()}
          className="rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white transition hover:bg-brand/90 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
