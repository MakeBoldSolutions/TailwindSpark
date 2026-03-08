import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SIGNALR_CONFIG } from '../types/chat-api';
import {
    createConnection,
    onReceiveChunk,
    onReceiveMessage,
    sendMessage,
    startConnection,
    stopConnection,
} from './chat.service';

const signalRMocks = vi.hoisted(() => {
  const mockConnection = {
    on: vi.fn(),
    start: vi.fn(() => Promise.resolve()),
    stop: vi.fn(() => Promise.resolve()),
    invoke: vi.fn(() => Promise.resolve()),
  };

  const mockWithUrl = vi.fn().mockReturnThis();
  const mockWithAutomaticReconnect = vi.fn().mockReturnThis();
  const mockConfigureLogging = vi.fn().mockReturnThis();
  const mockBuild = vi.fn(() => mockConnection);

  class MockHubConnectionBuilder {
    withUrl = mockWithUrl;
    withAutomaticReconnect = mockWithAutomaticReconnect;
    configureLogging = mockConfigureLogging;
    build = mockBuild;
  }

  return {
    mockConnection,
    mockWithUrl,
    mockWithAutomaticReconnect,
    mockConfigureLogging,
    mockBuild,
    MockHubConnectionBuilder,
  };
});

vi.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder: signalRMocks.MockHubConnectionBuilder,
  HttpTransportType: { WebSockets: 1, ServerSentEvents: 2, LongPolling: 4 },
  LogLevel: { Information: 1 },
}));

describe('chat.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a connection configured for reconnects and transport fallbacks', () => {
    const connection = createConnection();

    expect(connection).toBe(signalRMocks.mockConnection);
    expect(signalRMocks.mockWithUrl).toHaveBeenCalledWith(SIGNALR_CONFIG.HUB_URL, {
      withCredentials: false,
      timeout: 30000,
      transport: 7,
    });
    expect(signalRMocks.mockWithAutomaticReconnect).toHaveBeenCalledWith(SIGNALR_CONFIG.RETRY_DELAYS);
    expect(signalRMocks.mockConfigureLogging).toHaveBeenCalled();
    expect(signalRMocks.mockBuild).toHaveBeenCalled();
  });

  it('starts and stops the connection', async () => {
    await startConnection(signalRMocks.mockConnection as never);
    await stopConnection(signalRMocks.mockConnection as never);

    expect(signalRMocks.mockConnection.start).toHaveBeenCalledOnce();
    expect(signalRMocks.mockConnection.stop).toHaveBeenCalledOnce();
  });

  it('registers receive handlers for complete messages and stream chunks', () => {
    const onMessage = vi.fn();
    const onChunk = vi.fn();

    onReceiveMessage(signalRMocks.mockConnection as never, onMessage);
    onReceiveChunk(signalRMocks.mockConnection as never, onChunk);

    expect(signalRMocks.mockConnection.on).toHaveBeenNthCalledWith(1, SIGNALR_CONFIG.METHODS.RECEIVE_MESSAGE, onMessage);
    expect(signalRMocks.mockConnection.on).toHaveBeenNthCalledWith(2, SIGNALR_CONFIG.METHODS.RECEIVE_CHUNK, onChunk);
  });

  it('sends chat messages with the expected hub payload', async () => {
    const conversationId = await sendMessage(
      signalRMocks.mockConnection as never,
      'Mark',
      'Hello there',
      'Wichita Wisdom',
      'conversation-123',
    );

    expect(conversationId).toBe('conversation-123');
    expect(signalRMocks.mockConnection.invoke).toHaveBeenCalledWith(
      SIGNALR_CONFIG.METHODS.SEND_MESSAGE,
      'Mark',
      'Hello there',
      'conversation-123',
      'Wichita Wisdom',
    );
  });
});