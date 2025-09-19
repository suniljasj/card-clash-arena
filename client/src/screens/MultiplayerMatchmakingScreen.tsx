import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { LoadingSpinner } from "../components/ui/loading-spinner";
import { Navigation } from "../components/game/Navigation";
import { usePlayer } from "../lib/stores/usePlayer";
import { useWebSocket } from "../lib/stores/useWebSocket";
import { GameScreen } from "../App";
import { 
  Sword, 
  Clock, 
  Target, 
  Users,
  Zap,
  Crown,
  Wifi,
  WifiOff
} from "lucide-react";

interface MultiplayerMatchmakingScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

export default function MultiplayerMatchmakingScreen({ onNavigate }: MultiplayerMatchmakingScreenProps) {
  const { player } = usePlayer();
  const { 
    isConnected, 
    isAuthenticated, 
    isInQueue, 
    opponent,
    currentRoomId,
    lastError,
    connect, 
    disconnect,
    joinMatchmakingQueue, 
    leaveMatchmakingQueue,
    setOnBattleFound,
    setOnOpponentDisconnected
  } = useWebSocket();

  const [searchTime, setSearchTime] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    // Connect to WebSocket when component mounts
    if (player && !isConnected) {
      setConnectionStatus('connecting');
      connect(player.userId);
    }

    return () => {
      // Clean up when component unmounts
      if (isInQueue) {
        leaveMatchmakingQueue();
      }
    };
  }, [player, isConnected, connect, isInQueue, leaveMatchmakingQueue]);

  useEffect(() => {
    if (isConnected && isAuthenticated) {
      setConnectionStatus('connected');
    } else if (!isConnected) {
      setConnectionStatus('disconnected');
    }
  }, [isConnected, isAuthenticated]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isInQueue) {
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);
    } else {
      setSearchTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInQueue]);

  // Set up battle found handler
  useEffect(() => {
    setOnBattleFound((data: any) => {
      // Navigate to multiplayer battle screen
      onNavigate("multiplayer-battle");
    });

    setOnOpponentDisconnected(() => {
      // Handle opponent disconnection
      alert("Your opponent has disconnected. Returning to matchmaking.");
    });
  }, [setOnBattleFound, setOnOpponentDisconnected, onNavigate]);

  const handleConnectToggle = () => {
    if (isConnected) {
      disconnect();
    } else if (player) {
      setConnectionStatus('connecting');
      connect(player.userId);
    }
  };

  const handleJoinQueue = () => {
    if (isAuthenticated && !isInQueue) {
      joinMatchmakingQueue();
    }
  };

  const handleLeaveQueue = () => {
    if (isInQueue) {
      leaveMatchmakingQueue();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connecting':
        return <LoadingSpinner className="w-4 h-4" />;
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-400" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-400" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
    }
  };

  if (!player) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Multiplayer Arena</h1>
          <p className="text-gray-300">Battle against real players worldwide</p>
        </div>

        {/* Connection Status */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-center text-white flex items-center justify-center gap-2">
              {getConnectionIcon()}
              {getConnectionText()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {lastError && (
              <p className="text-red-400 mb-4">{lastError}</p>
            )}
            
            {!isConnected && (
              <Button
                onClick={handleConnectToggle}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={connectionStatus === 'connecting'}
              >
                {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect to Server'}
              </Button>
            )}

            {isConnected && !isAuthenticated && (
              <p className="text-yellow-400">Authenticating...</p>
            )}
          </CardContent>
        </Card>

        {/* Matchmaking Status */}
        {isAuthenticated && (
          <Card className="bg-black/60 backdrop-blur-sm border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-center text-white">
                {!isInQueue && "Ready for Multiplayer Battle"}
                {isInQueue && "Searching for Opponent..."}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Not Searching State */}
              {!isInQueue && (
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-blue-600 text-white text-xl">
                        {player.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-white">
                      <p className="font-bold text-lg">{player.username}</p>
                      <p className="text-sm text-gray-300">Level {player.level} • {player.rank}</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleJoinQueue}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                  >
                    <Sword className="w-5 h-5 mr-2" />
                    Find Opponent
                  </Button>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                      <p className="text-white font-bold">Real Players</p>
                      <p className="text-gray-300 text-sm">Battle against human opponents</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                      <p className="text-white font-bold">Real-time</p>
                      <p className="text-gray-300 text-sm">Live turn-based combat</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Searching State */}
              {isInQueue && (
                <div className="text-center space-y-6">
                  <LoadingSpinner className="w-16 h-16 mx-auto text-blue-400" />
                  
                  <div className="space-y-2">
                    <p className="text-white text-xl font-bold">Searching...</p>
                    <div className="flex items-center justify-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(searchTime)}</span>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white font-bold mb-2">Finding the perfect opponent</p>
                    <p className="text-gray-300 text-sm">We're matching you with a player of similar skill level</p>
                  </div>

                  <Button
                    onClick={handleLeaveQueue}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel Search
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Player Stats */}
        {isAuthenticated && (
          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Your Multiplayer Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">{player.wins}</p>
                  <p className="text-gray-300 text-sm">Wins</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">{player.losses}</p>
                  <p className="text-gray-300 text-sm">Losses</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {player.totalGames > 0 ? Math.round((player.wins / player.totalGames) * 100) : 0}%
                  </p>
                  <p className="text-gray-300 text-sm">Win Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Navigation currentScreen="multiplayer-matchmaking" onNavigate={onNavigate} />
    </div>
  );
}