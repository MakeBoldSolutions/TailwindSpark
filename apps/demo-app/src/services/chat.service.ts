import {
    HttpTransportType,
    HubConnectionBuilder,
    LogLevel,
    type HubConnection,
} from '@microsoft/signalr';
import { SIGNALR_CONFIG } from '../types/chat-api';

/**
 * Creates a configured SignalR hub connection for chat streaming.
 *
 * @returns Configured hub connection instance
 */
export function createConnection(): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(SIGNALR_CONFIG.HUB_URL, {
      withCredentials: false,
      timeout: 30000,
      transport:
        HttpTransportType.WebSockets |
        HttpTransportType.ServerSentEvents |
        HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect(SIGNALR_CONFIG.RETRY_DELAYS)
    .configureLogging(LogLevel.Information)
    .build();
}

/**
 * Starts a SignalR hub connection.
 *
 * @param connection - Connection to start
 * @returns Started hub connection instance
 */
export async function startConnection(connection: HubConnection): Promise<HubConnection> {
  await connection.start();
  return connection;
}

/**
 * Registers a callback for complete or chunked assistant message events.
 *
 * @param connection - SignalR hub connection
 * @param callback - Handler for inbound message chunks
 */
export function onReceiveMessage(
  connection: HubConnection,
  callback: (_user: string, messageChunk: string) => void,
): void {
  connection.on(SIGNALR_CONFIG.METHODS.RECEIVE_MESSAGE, callback);
}

/**
 * Registers a callback for streaming chunk events.
 *
 * @param connection - SignalR hub connection
 * @param callback - Handler for inbound stream chunks
 */
export function onReceiveChunk(
  connection: HubConnection,
  callback: (_user: string, messageChunk: string) => void,
): void {
  connection.on(SIGNALR_CONFIG.METHODS.RECEIVE_CHUNK, callback);
}

/**
 * Sends a chat message to the selected AI variant.
 *
 * @param connection - Active SignalR hub connection
 * @param userName - User display name
 * @param content - Message content
 * @param variantName - Selected AI variant name
 * @param conversationId - Optional conversation identifier
 * @returns Conversation identifier used for the send operation
 */
export async function sendMessage(
  connection: HubConnection,
  userName: string,
  content: string,
  variantName: string,
  conversationId: string = Date.now().toString(),
): Promise<string> {
  await connection.invoke(
    SIGNALR_CONFIG.METHODS.SEND_MESSAGE,
    userName,
    content,
    conversationId,
    variantName,
  );

  return conversationId;
}

/**
 * Stops an active SignalR hub connection.
 *
 * @param connection - Connection to stop
 */
export async function stopConnection(connection: HubConnection | null): Promise<void> {
  if (!connection) {
    return;
  }

  await connection.stop();
}