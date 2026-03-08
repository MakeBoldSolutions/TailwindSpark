import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AIVariant } from '../types/chat-api';
import { useSignalR } from './useSignalR';

const signalRMocks = vi.hoisted(() => {
  const mockConnection = {
    on: vi.fn(),
    onreconnecting: vi.fn(),
    onreconnected: vi.fn(),
    onclose: vi.fn(),
    start: vi.fn(() => Promise.resolve()),
    stop: vi.fn(() => Promise.resolve()),
    invoke: vi.fn(() => Promise.resolve()),
  };

  class MockHubConnectionBuilder {
    withUrl = vi.fn().mockReturnThis();
    withAutomaticReconnect = vi.fn().mockReturnThis();
    configureLogging = vi.fn().mockReturnThis();
    build = vi.fn(() => mockConnection);
  }

  return { mockConnection, MockHubConnectionBuilder };
});

vi.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder: signalRMocks.MockHubConnectionBuilder,
  HttpTransportType: { WebSockets: 1, ServerSentEvents: 2, LongPolling: 4 },
  LogLevel: { Information: 1 },
}));

const mockVariant: AIVariant = {
  definitionId: 1,
  name: 'Test',
  description: 'Test variant',
  created: '2025-01-01T00:00:00Z',
  updated: '2025-01-15T00:00:00Z',
  urlEncodedName: 'test',
  outputType: 1,
  prompt: 'You are a test.',
  promptHash: 'abc',
  definitionType: 'Conversational',
  definitionTypes: ['Conversational'],
  role: 1,
  model: 'gpt-4o',
  temperature: '0.7',
  definitionResponses: [],
  conversationId: '00000000-0000-0000-0000-000000000001',
  slug: 'test',
};

describe('useSignalR', () => {
  it('starts disconnected with no variant', () => {
    const { result } = renderHook(() => useSignalR(null));
    expect(result.current.connectionStatus).toBe('disconnected');
    expect(result.current.messages).toEqual([]);
  });

  it('exposes expected interface', () => {
    const { result } = renderHook(() => useSignalR(null));
    expect(typeof result.current.sendMessage).toBe('function');
    expect(typeof result.current.clearMessages).toBe('function');
    expect(result.current.isAssistantTyping).toBe(false);
    expect(result.current.connectionError).toBeNull();
  });

  it('provides sendMessage function with variant', async () => {
    const { result } = renderHook(() => useSignalR(mockVariant));
    expect(typeof result.current.sendMessage).toBe('function');

    await waitFor(() => expect(result.current.connectionStatus).toBe('connected'));
  });

  it('provides clearMessages function with variant', async () => {
    const { result } = renderHook(() => useSignalR(mockVariant));
    expect(typeof result.current.clearMessages).toBe('function');

    await waitFor(() => expect(result.current.connectionStatus).toBe('connected'));
  });

  it('initializes with empty messages', async () => {
    const { result } = renderHook(() => useSignalR(mockVariant));
    expect(result.current.messages).toEqual([]);

    await waitFor(() => expect(result.current.connectionStatus).toBe('connected'));
  });
});
