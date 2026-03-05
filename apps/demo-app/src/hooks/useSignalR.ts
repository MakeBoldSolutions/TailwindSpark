import { useCallback, useEffect, useRef, useState } from 'react';
import type { AIVariant, ChatMessage, SignalRConnectionStatus } from '../types/chat-api';
import {
    SIGNALR_CONFIG,
    createAssistantMessage,
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

export function useSignalR(variant: AIVariant | null): UseSignalRReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<SignalRConnectionStatus>('disconnected');
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connectionRef = useRef<any>(null);

  const getUserName = (): string => {
    return localStorage.getItem(SIGNALR_CONFIG.USER_NAME_KEY) ?? SIGNALR_CONFIG.DEFAULT_USER_NAME;
  };

  // Connect to SignalR hub
  useEffect(() => {
    if (!variant) {
      setConnectionStatus('disconnected');
      return;
    }

    let cancelled = false;

    const connect = async () => {
      setConnectionStatus('connecting');
      setConnectionError(null);

      try {
        const signalR = await import('@microsoft/signalr');
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(SIGNALR_CONFIG.HUB_URL)
          .withAutomaticReconnect(SIGNALR_CONFIG.RETRY_DELAYS)
          .build();

        connection.on(SIGNALR_CONFIG.METHODS.RECEIVE_MESSAGE, (msg: {
          id: string;
          variantId: string;
          role: string;
          content: string;
          timestamp: number;
        }) => {
          if (cancelled) return;
          setMessages(prev => {
            const existing = prev.find(m => m.id === msg.id);
            if (existing) {
              return prev.map(m =>
                m.id === msg.id ? { ...m, content: sanitizeMessageContent(msg.content), streaming: false } : m,
              );
            }
            return [
              ...prev,
              {
                id: msg.id,
                variant_id: msg.variantId,
                role: msg.role as ChatMessage['role'],
                content: sanitizeMessageContent(msg.content),
                timestamp: msg.timestamp,
              },
            ];
          });
          setIsAssistantTyping(false);
        });

        connection.on(SIGNALR_CONFIG.METHODS.RECEIVE_CHUNK, (chunk: {
          messageId: string;
          chunk: string;
          isFinal: boolean;
        }) => {
          if (cancelled) return;
          setMessages(prev =>
            prev.map(m =>
              m.id === chunk.messageId
                ? { ...m, content: m.content + sanitizeMessageContent(chunk.chunk), streaming: !chunk.isFinal }
                : m,
            ),
          );
          if (chunk.isFinal) setIsAssistantTyping(false);
        });

        connection.on(SIGNALR_CONFIG.METHODS.STREAM_COMPLETE, (data: { messageId: string }) => {
          if (cancelled) return;
          setMessages(prev =>
            prev.map(m => (m.id === data.messageId ? { ...m, streaming: false } : m)),
          );
          setIsAssistantTyping(false);
        });

        connection.on(SIGNALR_CONFIG.METHODS.ERROR, (error: { message: string }) => {
          if (cancelled) return;
          setConnectionError(error.message);
          setIsAssistantTyping(false);
        });

        connection.onreconnecting(() => {
          if (!cancelled) setConnectionStatus('reconnecting');
        });

        connection.onreconnected(() => {
          if (!cancelled) setConnectionStatus('connected');
        });

        connection.onclose(() => {
          if (!cancelled) setConnectionStatus('disconnected');
        });

        await connection.start();
        if (!cancelled) {
          connectionRef.current = connection;
          setConnectionStatus('connected');
        } else {
          await connection.stop();
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
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [variant]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!variant || !connectionRef.current || !isMessageValid(content)) return;

      const userMsg = createUserMessage(variant.id, content);
      const assistantMsg = createAssistantMessage(variant.id);

      setMessages(prev => [...prev, userMsg, assistantMsg]);
      setIsAssistantTyping(true);

      connectionRef.current
        .invoke(SIGNALR_CONFIG.METHODS.SEND_MESSAGE, {
          userName: getUserName(),
          variantId: variant.id,
          message: content,
        })
        .catch(() => {
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMsg.id
                ? { ...m, content: 'Failed to send message. Please try again.', streaming: false, error: 'send_failed' }
                : m,
            ),
          );
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
    connectionStatus,
    isAssistantTyping,
    connectionError,
    sendMessage,
    clearMessages,
  };
}
