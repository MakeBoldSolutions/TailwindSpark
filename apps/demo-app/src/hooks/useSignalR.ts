import type { HubConnection } from '@microsoft/signalr';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    createConnection,
    onReceiveChunk,
    onReceiveMessage,
    sendMessage as sendChatMessage,
    startConnection,
    stopConnection,
} from '../services/chat.service';
import type { AIVariant, ChatMessage, SignalRConnectionStatus } from '../types/chat-api';
import {
    SIGNALR_CONFIG,
    createUserMessage,
    isMessageValid,
    sanitizeMessageContent,
} from '../types/chat-api';

interface UseSignalRReturn {
  messages: ChatMessage[];
  connectionStatus: SignalRConnectionStatus;
  isAssistantTyping: boolean;
  connectionError: string | null;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
}

/**
 * Manages the SignalR chat connection state for a selected AI variant.
 *
 * @param variant - Selected AI variant or null when the chat is closed
 * @returns SignalR chat state and actions
 */
export function useSignalR(variant: AIVariant | null): UseSignalRReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<SignalRConnectionStatus>('disconnected');
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const connectionRef = useRef<HubConnection | null>(null);

  const getUserName = (): string => {
    return localStorage.getItem(SIGNALR_CONFIG.USER_NAME_KEY) ?? SIGNALR_CONFIG.DEFAULT_USER_NAME;
  };

  // Connect to SignalR hub
  useEffect(() => {
    if (!variant) {
      return;
    }

    let cancelled = false;

    const connect = async () => {
      setConnectionStatus('connecting');
      setConnectionError(null);

      try {
        const connection = createConnection();

        // Server sends ReceiveMessage(user: string, messageChunk: string)
        // Chunks stream in and are appended; a 1s debounce marks streaming complete
        let streamTimer: ReturnType<typeof setTimeout> | null = null;

        const handleIncomingMessage = (_user: string, messageChunk: string) => {
          if (cancelled) return;
          const chunk = sanitizeMessageContent(messageChunk);

          setMessages(prev => {
            // Find the last assistant message that is still streaming
            const lastIdx = prev.length - 1;
            const lastMsg = prev[lastIdx];
            if (lastMsg && lastMsg.role === 'assistant' && lastMsg.streaming) {
              // Append chunk to existing streaming message
              return prev.map((m, i) =>
                i === lastIdx ? { ...m, content: m.content + chunk } : m,
              );
            }
            // No streaming message found — create a new assistant message
            return [
              ...prev,
              {
                id: crypto.randomUUID(),
                variant_id: variant.conversationId,
                role: 'assistant' as const,
                content: chunk,
                timestamp: Date.now(),
                streaming: true,
              },
            ];
          });

          // Reset the debounce timer — after 1s of silence, mark streaming complete
          if (streamTimer) clearTimeout(streamTimer);
          streamTimer = setTimeout(() => {
            if (cancelled) return;
            setMessages(prev =>
              prev.map(m => (m.streaming ? { ...m, streaming: false } : m)),
            );
            setIsAssistantTyping(false);
          }, 1000);
        };

        onReceiveMessage(connection, handleIncomingMessage);
        onReceiveChunk(connection, handleIncomingMessage);

        connection.onreconnecting(() => {
          if (!cancelled) setConnectionStatus('reconnecting');
        });

        connection.onreconnected(() => {
          if (!cancelled) setConnectionStatus('connected');
        });

        connection.onclose(() => {
          if (!cancelled) setConnectionStatus('disconnected');
        });

        await startConnection(connection);
        if (!cancelled) {
          connectionRef.current = connection;
          setConnectionStatus('connected');
        } else {
          await stopConnection(connection);
        }
      } catch {
        if (!cancelled) {
          setConnectionStatus('disconnected');
          setConnectionError('Unable to connect to chat service. The service may be offline.');
        }
      }
    };

    connect();

    return () => {
      cancelled = true;
      if (connectionRef.current) {
        void stopConnection(connectionRef.current);
        connectionRef.current = null;
      }
      setConnectionStatus('disconnected');
    };
  }, [variant]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!variant || !connectionRef.current || !isMessageValid(content)) return;

      const userMsg = createUserMessage(variant.conversationId, content);

      setMessages(prev => [...prev, userMsg]);
      setIsAssistantTyping(true);

      const conversationId = new Date().getTime().toString();
      const activeConnection = connectionRef.current;

      if (!activeConnection) {
        return;
      }

      void sendChatMessage(
        activeConnection,
        getUserName(),
        content,
        variant.name,
        conversationId,
      )
        .catch(() => {
          setMessages(prev => [
            ...prev,
            {
              id: crypto.randomUUID(),
              variant_id: variant.conversationId,
              role: 'assistant' as const,
              content: 'Failed to send message. Please try again.',
              timestamp: Date.now(),
              error: 'send_failed',
            },
          ]);
          setIsAssistantTyping(false);
        });
    },
    [variant],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    connectionStatus: variant ? connectionStatus : 'disconnected',
    isAssistantTyping,
    connectionError,
    sendMessage,
    clearMessages,
  };
}
