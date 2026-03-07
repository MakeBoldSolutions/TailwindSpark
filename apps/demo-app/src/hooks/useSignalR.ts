import { useCallback, useEffect, useRef, useState } from 'react';
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
          .withUrl(SIGNALR_CONFIG.HUB_URL, {
            withCredentials: false,
            timeout: 30000,
            transport:
              signalR.HttpTransportType.WebSockets |
              signalR.HttpTransportType.ServerSentEvents |
              signalR.HttpTransportType.LongPolling,
          })
          .withAutomaticReconnect(SIGNALR_CONFIG.RETRY_DELAYS)
          .configureLogging(signalR.LogLevel.Information)
          .build();

        // Server sends ReceiveMessage(user: string, messageChunk: string)
        // Chunks stream in and are appended; a 1s debounce marks streaming complete
        let streamTimer: ReturnType<typeof setTimeout> | null = null;

        connection.on(SIGNALR_CONFIG.METHODS.RECEIVE_MESSAGE, (_user: string, messageChunk: string) => {
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

      const userMsg = createUserMessage(variant.conversationId, content);

      setMessages(prev => [...prev, userMsg]);
      setIsAssistantTyping(true);

      const conversationId = new Date().getTime().toString();

      connectionRef.current
        .invoke(
          SIGNALR_CONFIG.METHODS.SEND_MESSAGE,
          getUserName(),
          content,
          conversationId,
          variant.name,
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
    connectionStatus,
    isAssistantTyping,
    connectionError,
    sendMessage,
    clearMessages,
  };
}
