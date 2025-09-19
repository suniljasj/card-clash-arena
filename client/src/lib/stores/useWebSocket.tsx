import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface WebSocketState {
  ws: WebSocket | null;
  isConnected: boolean;
  isAuthenticated: boolean;
  isInQueue: boolean;
  currentRoomId: string | null;
  opponent: { username: string } | null;
  reconnectAttempts: number;
  lastError: string | null;
  
  // Actions
  connect: (userId: number) => void;
  disconnect: () => void;
  joinMatchmakingQueue: () => void;
  leaveMatchmakingQueue: () => void;
  sendBattleAction: (action: string, cardId?: string, targetId?: string) => void;
  endTurn: () => void;
  
  // Event handlers
  onMessage: (message: any) => void;
  onBattleFound: ((data: any) => void) | null;
  onBattleAction: ((data: any) => void) | null;
  onTurnChanged: ((data: any) => void) | null;
  onOpponentDisconnected: (() => void) | null;
  
  setOnBattleFound: (handler: (data: any) => void) => void;
  setOnBattleAction: (handler: (data: any) => void) => void;
  setOnTurnChanged: (handler: (data: any) => void) => void;
  setOnOpponentDisconnected: (handler: () => void) => void;
}

const WEBSOCKET_URL = `ws://${window.location.host}/ws`;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;

export const useWebSocket = create<WebSocketState>()(
  subscribeWithSelector((set, get) => ({
    ws: null,
    isConnected: false,
    isAuthenticated: false,
    isInQueue: false,
    currentRoomId: null,
    opponent: null,
    reconnectAttempts: 0,
    lastError: null,
    onBattleFound: null,
    onBattleAction: null,
    onTurnChanged: null,
    onOpponentDisconnected: null,

    connect: (userId: number) => {
      const state = get();
      
      // Close existing connection
      if (state.ws) {
        state.ws.close();
      }

      try {
        const ws = new WebSocket(WEBSOCKET_URL);
        
        ws.onopen = () => {
          console.log("WebSocket connected");
          set({ 
            ws, 
            isConnected: true, 
            reconnectAttempts: 0,
            lastError: null 
          });
          
          // Authenticate
          ws.send(JSON.stringify({
            type: 'authenticate',
            data: { userId }
          }));
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          get().onMessage(message);
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
          set({ 
            isConnected: false, 
            isAuthenticated: false,
            isInQueue: false,
            currentRoomId: null,
            opponent: null
          });
          
          // Auto-reconnect if not intentional
          const currentState = get();
          if (currentState.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            setTimeout(() => {
              set(state => ({ reconnectAttempts: state.reconnectAttempts + 1 }));
              get().connect(userId);
            }, RECONNECT_DELAY);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          set({ lastError: "Connection error" });
        };

        set({ ws });
      } catch (error) {
        console.error("Failed to create WebSocket:", error);
        set({ lastError: "Failed to connect" });
      }
    },

    disconnect: () => {
      const { ws } = get();
      if (ws) {
        ws.close();
      }
      set({ 
        ws: null, 
        isConnected: false, 
        isAuthenticated: false,
        isInQueue: false,
        currentRoomId: null,
        opponent: null,
        reconnectAttempts: MAX_RECONNECT_ATTEMPTS // Prevent auto-reconnect
      });
    },

    joinMatchmakingQueue: () => {
      const { ws, isAuthenticated } = get();
      if (ws && isAuthenticated) {
        ws.send(JSON.stringify({
          type: 'join_queue'
        }));
      }
    },

    leaveMatchmakingQueue: () => {
      const { ws, isAuthenticated } = get();
      if (ws && isAuthenticated) {
        ws.send(JSON.stringify({
          type: 'leave_queue'
        }));
      }
    },

    sendBattleAction: (action: string, cardId?: string, targetId?: string) => {
      const { ws, currentRoomId } = get();
      if (ws && currentRoomId) {
        ws.send(JSON.stringify({
          type: 'battle_action',
          data: { action, cardId, targetId }
        }));
      }
    },

    endTurn: () => {
      const { ws, currentRoomId } = get();
      if (ws && currentRoomId) {
        ws.send(JSON.stringify({
          type: 'end_turn'
        }));
      }
    },

    onMessage: (message: any) => {
      const { type, data } = message;
      const state = get();

      switch (type) {
        case 'authenticated':
          console.log("Authenticated with server");
          set({ isAuthenticated: true });
          break;

        case 'queue_joined':
          console.log("Joined matchmaking queue, position:", data.queuePosition);
          set({ isInQueue: true });
          break;

        case 'queue_left':
          console.log("Left matchmaking queue");
          set({ isInQueue: false });
          break;

        case 'battle_found':
          console.log("Battle found:", data);
          set({ 
            isInQueue: false,
            currentRoomId: data.roomId,
            opponent: data.opponent
          });
          
          if (state.onBattleFound) {
            state.onBattleFound(data);
          }
          break;

        case 'battle_action':
          console.log("Battle action received:", data);
          if (state.onBattleAction) {
            state.onBattleAction(data);
          }
          break;

        case 'turn_changed':
          console.log("Turn changed:", data);
          if (state.onTurnChanged) {
            state.onTurnChanged(data);
          }
          break;

        case 'opponent_disconnected':
          console.log("Opponent disconnected");
          set({ 
            currentRoomId: null,
            opponent: null
          });
          
          if (state.onOpponentDisconnected) {
            state.onOpponentDisconnected();
          }
          break;

        case 'error':
          console.error("WebSocket error:", data.message);
          set({ lastError: data.message });
          break;

        default:
          console.log("Unknown message type:", type);
      }
    },

    setOnBattleFound: (handler: (data: any) => void) => {
      set({ onBattleFound: handler });
    },

    setOnBattleAction: (handler: (data: any) => void) => {
      set({ onBattleAction: handler });
    },

    setOnTurnChanged: (handler: (data: any) => void) => {
      set({ onTurnChanged: handler });
    },

    setOnOpponentDisconnected: (handler: () => void) => {
      set({ onOpponentDisconnected: handler });
    }
  }))
);