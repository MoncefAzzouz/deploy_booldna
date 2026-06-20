import { Response } from "express";

type LongPollPayload = {
  success: boolean;
  data: {
    hasUpdates: boolean;
    notifications: unknown[];
    pollTimeout: boolean;
    timestamp: string;
  };
};

type PendingConnection = {
  connectionId: string;
  userId: number;
  response: Response;
  timeoutHandle: NodeJS.Timeout;
};

class LongPollingManager {
  private connections: Map<string, PendingConnection> = new Map();
  private userConnectionIndex: Map<number, Set<string>> = new Map();

  registerConnection(userId: number, response: Response, timeoutMs: number) {
    const connectionId = `${userId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const timeoutHandle = setTimeout(() => {
      this.respondAndRemove(connectionId, {
        success: true,
        data: {
          hasUpdates: false,
          notifications: [],
          pollTimeout: true,
          timestamp: new Date().toISOString(),
        },
      });
    }, timeoutMs);

    const connection: PendingConnection = {
      connectionId,
      userId,
      response,
      timeoutHandle,
    };

    this.connections.set(connectionId, connection);

    const userConnections =
      this.userConnectionIndex.get(userId) || new Set<string>();
    userConnections.add(connectionId);
    this.userConnectionIndex.set(userId, userConnections);

    return connectionId;
  }

  notifyUser(userId: number, notifications: unknown[]) {
    const connectionIds = this.userConnectionIndex.get(userId);

    if (!connectionIds || connectionIds.size === 0) {
      return;
    }

    for (const connectionId of connectionIds) {
      this.respondAndRemove(connectionId, {
        success: true,
        data: {
          hasUpdates: true,
          notifications,
          pollTimeout: false,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  removeConnection(connectionId: string) {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      return;
    }

    clearTimeout(connection.timeoutHandle);
    this.connections.delete(connectionId);

    const userConnections = this.userConnectionIndex.get(connection.userId);
    if (!userConnections) {
      return;
    }

    userConnections.delete(connectionId);
    if (userConnections.size === 0) {
      this.userConnectionIndex.delete(connection.userId);
      return;
    }

    this.userConnectionIndex.set(connection.userId, userConnections);
  }

  private respondAndRemove(connectionId: string, payload: LongPollPayload) {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      return;
    }

    clearTimeout(connection.timeoutHandle);

    if (!connection.response.headersSent) {
      connection.response.status(200).json(payload);
    }

    this.removeConnection(connectionId);
  }
}

export const longPollingManager = new LongPollingManager();
