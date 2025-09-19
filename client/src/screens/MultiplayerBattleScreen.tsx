import { useEffect, useState } from "react";
import { useWebSocket } from "../lib/stores/useWebSocket";
import { usePlayer } from "../lib/stores/usePlayer";
import { PlayerHUD } from "../components/game/PlayerHUD";
import { CardHand } from "../components/game/CardHand";
import { BattleField } from "../components/game/BattleField";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { GameScreen } from "../App";
import type { Card as GameCard, BattleCard } from "@/types/game";
import { MessageSquare, Volume2, VolumeX, Wifi, WifiOff } from "lucide-react";

interface MultiplayerBattleScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

interface MultiplayerGameState {
  player1: {
    health: number;
    mana: number;
    maxMana: number;
    deck: string[];
    hand: BattleCard[];
    field: BattleCard[];
    graveyard: BattleCard[];
  };
  player2: {
    health: number;
    mana: number;
    maxMana: number;
    deck: string[];
    hand: BattleCard[];
    field: BattleCard[];
    graveyard: BattleCard[];
  };
}

export default function MultiplayerBattleScreen({ onNavigate }: MultiplayerBattleScreenProps) {
  const { player: gamePlayer } = usePlayer();
  const { 
    isConnected, 
    currentRoomId, 
    opponent,
    sendBattleAction,
    endTurn: sendEndTurn,
    setOnBattleAction,
    setOnTurnChanged,
    setOnOpponentDisconnected
  } = useWebSocket();

  const [gameState, setGameState] = useState<MultiplayerGameState | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [selectedCard, setSelectedCard] = useState<BattleCard | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [turnTimer, setTurnTimer] = useState(75);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    // Set up WebSocket event handlers
    setOnBattleAction((data: any) => {
      // Update game state based on battle action
      setBattleLog(prev => [...prev, `${data.playerId === gamePlayer?.id ? 'You' : opponent?.username} performed ${data.action}`]);
      
      if (data.gameState) {
        setGameState(data.gameState);
      }
    });

    setOnTurnChanged((data: any) => {
      const myTurn = data.currentTurn === 'player1'; // Assuming we're always player1 for simplicity
      setIsMyTurn(myTurn);
      setTurnTimer(75); // Reset turn timer
      
      setBattleLog(prev => [...prev, `${myTurn ? 'Your' : opponent?.username + "'s"} turn begins!`]);
    });

    setOnOpponentDisconnected(() => {
      setBattleLog(prev => [...prev, "Opponent disconnected! You win by default."]);
      // Navigate back to matchmaking after a delay
      setTimeout(() => {
        onNavigate("multiplayer-matchmaking");
      }, 3000);
    });

    return () => {
      // Clean up handlers
      setOnBattleAction(() => {});
      setOnTurnChanged(() => {});
      setOnOpponentDisconnected(() => {});
    };
  }, [gamePlayer?.id, opponent?.username, setOnBattleAction, setOnTurnChanged, setOnOpponentDisconnected, onNavigate]);

  // Turn timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isMyTurn && turnTimer > 0) {
      interval = setInterval(() => {
        setTurnTimer(prev => {
          if (prev <= 1) {
            // Auto-end turn when timer expires
            handleEndTurn();
            return 75;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMyTurn, turnTimer]);

  const handleCardPlay = (card: GameCard) => {
    if (!isMyTurn || !isConnected || !currentRoomId) return;
    
    sendBattleAction('play_card', card.id);
    setSelectedCard(null);
  };

  const handleCardAttack = (attacker: BattleCard, target?: BattleCard) => {
    if (!isMyTurn || !isConnected || !currentRoomId) return;
    
    sendBattleAction('attack', attacker.id, target?.instanceId);
  };

  const handleCardSelect = (card: GameCard | null) => {
    setSelectedCard(card as BattleCard | null);
  };

  const handleEndTurn = () => {
    if (!isMyTurn || !isConnected || !currentRoomId) return;
    
    sendEndTurn();
    setSelectedCard(null);
  };

  const handleSurrender = () => {
    if (confirm("Are you sure you want to surrender?")) {
      sendBattleAction('surrender');
      onNavigate("multiplayer-matchmaking");
    }
  };

  // Show connection error if disconnected
  if (!isConnected || !currentRoomId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-black/60 backdrop-blur-sm border-white/20 p-8 text-center">
          <WifiOff className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-white text-2xl font-bold mb-4">Connection Lost</h2>
          <p className="text-gray-300 mb-6">You've been disconnected from the multiplayer battle.</p>
          <Button
            onClick={() => onNavigate("multiplayer-matchmaking")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Return to Matchmaking
          </Button>
        </Card>
      </div>
    );
  }

  // Show loading if game state not yet received
  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-black/60 backdrop-blur-sm border-white/20 p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-white text-2xl font-bold mb-4">Loading Battle</h2>
          <p className="text-gray-300">Preparing multiplayer battle with {opponent?.username}</p>
        </Card>
      </div>
    );
  }

  const playerState = gameState.player1; // Assuming we're always player1
  const opponentState = gameState.player2;

  // Mock player objects for existing components
  const battlePlayer = {
    id: "player",
    username: gamePlayer?.username || "Player",
    health: playerState.health,
    maxHealth: 30,
    mana: playerState.mana,
    maxMana: playerState.maxMana,
    deck: playerState.deck,
    hand: playerState.hand,
    field: playerState.field,
    graveyard: playerState.graveyard
  };

  const battleOpponent = {
    id: "opponent",
    username: opponent?.username || "Opponent",
    health: opponentState.health,
    maxHealth: 30,
    mana: opponentState.mana,
    maxMana: opponentState.maxMana,
    deck: opponentState.deck,
    hand: opponentState.hand,
    field: opponentState.field,
    graveyard: opponentState.graveyard
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-black/60 backdrop-blur-sm border-b border-white/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Wifi className="w-5 h-5 text-green-400" />
          <span className="text-white font-bold">Multiplayer Battle</span>
          <span className="text-gray-300">vs {opponent?.username}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className="text-white hover:bg-white/10"
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSurrender}
            className="text-red-400 hover:bg-red-400/10"
          >
            Surrender
          </Button>
        </div>
      </div>

      {/* Battle Log (Optional) */}
      {battleLog.length > 0 && (
        <Card className="mx-4 mt-4 bg-black/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-white font-bold text-sm">Battle Log</span>
            </div>
            <ScrollArea className="h-20">
              <div className="space-y-1">
                {battleLog.slice(-5).map((log, index) => (
                  <p key={index} className="text-gray-300 text-xs">{log}</p>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Player HUD */}
      <PlayerHUD
        player={battlePlayer}
        opponent={battleOpponent}
        currentTurn={isMyTurn ? "player" : "opponent"}
        turnTimer={turnTimer}
        onEndTurn={handleEndTurn}
        isPlayerTurn={isMyTurn}
        className="flex-shrink-0"
      />

      {/* Battle Field */}
      <BattleField
        playerField={battlePlayer.field}
        opponentField={battleOpponent.field}
        selectedCard={selectedCard}
        onCardSelect={(card: BattleCard | null) => setSelectedCard(card)}
        onCardAttack={handleCardAttack}
        isPlayerTurn={isMyTurn}
        className="flex-1 min-h-0"
      />

      {/* Player Hand */}
      <CardHand
        cards={battlePlayer.hand as GameCard[]}
        selectedCard={selectedCard as GameCard | null}
        onCardSelect={handleCardSelect}
        onCardPlay={handleCardPlay}
        playerMana={battlePlayer.mana}
        isPlayerTurn={isMyTurn}
        className="flex-shrink-0"
      />
    </div>
  );
}