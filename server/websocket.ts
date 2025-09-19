import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { storage } from './dbStorage';

interface PlayerConnection {
  ws: WebSocket;
  userId: number;
  username: string;
  isInQueue: boolean;
  currentRoomId?: string;
}

interface BattleRoom {
  id: string;
  player1: PlayerConnection;
  player2: PlayerConnection;
  gameState: any;
  turn: 'player1' | 'player2';
  turnStartTime: number;
  status: 'active' | 'ended';
}

export class GameWebSocketServer {
  private wss: WebSocketServer;
  private connections = new Map<number, PlayerConnection>();
  private matchmakingQueue: PlayerConnection[] = [];
  private battleRooms = new Map<string, BattleRoom>();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.setupWebSocket();
    this.startMatchmaking();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket, request) => {
      console.log('New WebSocket connection');

      ws.on('message', async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(ws, message);
        } catch (error) {
          console.error('WebSocket message error:', error);
          this.sendError(ws, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.handleDisconnection(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  private async handleMessage(ws: WebSocket, message: any) {
    const { type, data } = message;

    switch (type) {
      case 'authenticate':
        await this.authenticatePlayer(ws, data.userId);
        break;

      case 'join_queue':
        await this.joinMatchmakingQueue(ws);
        break;

      case 'leave_queue':
        this.leaveMatchmakingQueue(ws);
        break;

      case 'battle_action':
        await this.handleBattleAction(ws, data);
        break;

      case 'end_turn':
        await this.handleEndTurn(ws);
        break;

      default:
        this.sendError(ws, 'Unknown message type');
    }
  }

  private async authenticatePlayer(ws: WebSocket, userId: number) {
    try {
      const player = await storage.getPlayer(userId);
      if (!player) {
        this.sendError(ws, 'Player not found');
        return;
      }

      // Remove existing connection if any
      if (this.connections.has(userId)) {
        const existingConnection = this.connections.get(userId)!;
        existingConnection.ws.close();
      }

      const connection: PlayerConnection = {
        ws,
        userId: player.userId,
        username: player.username,
        isInQueue: false
      };

      this.connections.set(userId, connection);
      this.send(ws, {
        type: 'authenticated',
        data: { userId: player.userId, username: player.username }
      });

      console.log(`Player ${player.username} authenticated`);
    } catch (error) {
      console.error('Authentication error:', error);
      this.sendError(ws, 'Authentication failed');
    }
  }

  private async joinMatchmakingQueue(ws: WebSocket) {
    const connection = this.findConnectionBySocket(ws);
    if (!connection) {
      this.sendError(ws, 'Not authenticated');
      return;
    }

    if (connection.isInQueue) {
      this.sendError(ws, 'Already in queue');
      return;
    }

    connection.isInQueue = true;
    this.matchmakingQueue.push(connection);

    this.send(ws, {
      type: 'queue_joined',
      data: { queuePosition: this.matchmakingQueue.length }
    });

    console.log(`${connection.username} joined matchmaking queue`);
  }

  private leaveMatchmakingQueue(ws: WebSocket) {
    const connection = this.findConnectionBySocket(ws);
    if (!connection) return;

    const index = this.matchmakingQueue.indexOf(connection);
    if (index > -1) {
      this.matchmakingQueue.splice(index, 1);
      connection.isInQueue = false;

      this.send(ws, {
        type: 'queue_left'
      });

      console.log(`${connection.username} left matchmaking queue`);
    }
  }

  private startMatchmaking() {
    setInterval(() => {
      this.processMatchmaking();
    }, 2000); // Check for matches every 2 seconds
  }

  private async processMatchmaking() {
    if (this.matchmakingQueue.length >= 2) {
      const player1 = this.matchmakingQueue.shift()!;
      const player2 = this.matchmakingQueue.shift()!;

      await this.createBattleRoom(player1, player2);
    }
  }

  private async createBattleRoom(player1: PlayerConnection, player2: PlayerConnection) {
    const roomId = Math.random().toString(36).substr(2, 9);
    
    // Get player decks
    const player1Decks = await storage.getPlayerDecks(player1.userId);
    const player2Decks = await storage.getPlayerDecks(player2.userId);
    
    const room: BattleRoom = {
      id: roomId,
      player1,
      player2,
      gameState: {
        player1: {
          health: 30,
          mana: 1,
          maxMana: 1,
          deck: player1Decks[0]?.cardIds || [],
          hand: [],
          field: [],
          graveyard: []
        },
        player2: {
          health: 30,
          mana: 1,
          maxMana: 1,
          deck: player2Decks[0]?.cardIds || [],
          hand: [],
          field: [],
          graveyard: []
        }
      },
      turn: 'player1',
      turnStartTime: Date.now(),
      status: 'active'
    };

    // Remove from queue
    player1.isInQueue = false;
    player2.isInQueue = false;
    player1.currentRoomId = roomId;
    player2.currentRoomId = roomId;

    this.battleRooms.set(roomId, room);

    // Notify both players
    this.send(player1.ws, {
      type: 'battle_found',
      data: {
        roomId,
        opponent: { username: player2.username },
        yourTurn: true,
        gameState: room.gameState
      }
    });

    this.send(player2.ws, {
      type: 'battle_found',
      data: {
        roomId,
        opponent: { username: player1.username },
        yourTurn: false,
        gameState: room.gameState
      }
    });

    console.log(`Battle room ${roomId} created: ${player1.username} vs ${player2.username}`);
  }

  private async handleBattleAction(ws: WebSocket, data: any) {
    const connection = this.findConnectionBySocket(ws);
    if (!connection || !connection.currentRoomId) {
      this.sendError(ws, 'Not in a battle');
      return;
    }

    const room = this.battleRooms.get(connection.currentRoomId);
    if (!room || room.status !== 'active') {
      this.sendError(ws, 'Battle not active');
      return;
    }

    const isPlayer1 = room.player1 === connection;
    const currentTurn = room.turn;

    // Check if it's the player's turn
    if ((isPlayer1 && currentTurn !== 'player1') || (!isPlayer1 && currentTurn !== 'player2')) {
      this.sendError(ws, 'Not your turn');
      return;
    }

    // Process the battle action (play card, attack, etc.)
    // This would contain the full battle logic
    const { action, cardId, targetId } = data;

    // Update game state based on action
    // For now, just broadcast the action to both players
    const actionMessage = {
      type: 'battle_action',
      data: {
        playerId: connection.userId,
        action,
        cardId,
        targetId,
        gameState: room.gameState
      }
    };

    this.send(room.player1.ws, actionMessage);
    this.send(room.player2.ws, actionMessage);
  }

  private async handleEndTurn(ws: WebSocket) {
    const connection = this.findConnectionBySocket(ws);
    if (!connection || !connection.currentRoomId) {
      this.sendError(ws, 'Not in a battle');
      return;
    }

    const room = this.battleRooms.get(connection.currentRoomId);
    if (!room || room.status !== 'active') {
      this.sendError(ws, 'Battle not active');
      return;
    }

    const isPlayer1 = room.player1 === connection;
    
    // Switch turns
    room.turn = room.turn === 'player1' ? 'player2' : 'player1';
    room.turnStartTime = Date.now();

    const turnMessage = {
      type: 'turn_changed',
      data: {
        currentTurn: room.turn,
        turnStartTime: room.turnStartTime
      }
    };

    this.send(room.player1.ws, turnMessage);
    this.send(room.player2.ws, turnMessage);
  }

  private handleDisconnection(ws: WebSocket) {
    const connection = this.findConnectionBySocket(ws);
    if (!connection) return;

    // Remove from queue if in queue
    if (connection.isInQueue) {
      this.leaveMatchmakingQueue(ws);
    }

    // Handle battle disconnection
    if (connection.currentRoomId) {
      const room = this.battleRooms.get(connection.currentRoomId);
      if (room) {
        // Notify opponent of disconnection
        const opponent = room.player1 === connection ? room.player2 : room.player1;
        this.send(opponent.ws, {
          type: 'opponent_disconnected'
        });

        // Clean up room
        this.battleRooms.delete(connection.currentRoomId);
      }
    }

    // Remove connection
    this.connections.delete(connection.userId);
    console.log(`Player ${connection.username} disconnected`);
  }

  private findConnectionBySocket(ws: WebSocket): PlayerConnection | null {
    for (const connection of Array.from(this.connections.values())) {
      if (connection.ws === ws) {
        return connection;
      }
    }
    return null;
  }

  private send(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private sendError(ws: WebSocket, error: string) {
    this.send(ws, {
      type: 'error',
      data: { message: error }
    });
  }

  getStats() {
    return {
      connectedPlayers: this.connections.size,
      playersInQueue: this.matchmakingQueue.length,
      activeBattles: this.battleRooms.size
    };
  }
}