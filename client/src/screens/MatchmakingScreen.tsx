import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { LoadingSpinner } from "../components/ui/loading-spinner";
import { Navigation } from "../components/game/Navigation";
import { usePlayer } from "../lib/stores/usePlayer";
import { useBattle } from "../lib/stores/useBattle";
import { useCards, getCardById } from "../lib/stores/useCards";
import { CARDS } from "../data/cards";
import { GameScreen } from "../App";
import { 
  Sword, 
  Clock, 
  Target, 
  Users,
  Zap,
  Crown
} from "lucide-react";

interface MatchmakingScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

export default function MatchmakingScreen({ onNavigate }: MatchmakingScreenProps) {
  const { player } = usePlayer();
  const { initializeBattle } = useBattle();
  const { getActiveDeck } = useCards();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [matchFound, setMatchFound] = useState(false);
  const [opponent, setOpponent] = useState<any>(null);

  // Mock opponent data
  const mockOpponents = [
    { username: "DragonSlayer", level: 12, rank: "Silver", wins: 145, losses: 89 },
    { username: "SpellMaster", level: 8, rank: "Bronze", wins: 67, losses: 45 },
    { username: "ShadowKnight", level: 15, rank: "Gold", wins: 234, losses: 167 },
    { username: "FireMage", level: 10, rank: "Silver", wins: 98, losses: 76 },
    { username: "IceQueen", level: 18, rank: "Gold", wins: 287, losses: 198 }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSearching && !matchFound) {
      interval = setInterval(() => {
        setSearchTime(prev => {
          const newTime = prev + 1;
          
          // Simulate finding a match after 3-8 seconds
          if (newTime >= 3 && Math.random() > 0.7) {
            setMatchFound(true);
            const randomOpponent = mockOpponents[Math.floor(Math.random() * mockOpponents.length)];
            setOpponent(randomOpponent);
            
            // Start battle after showing opponent for 2 seconds
            setTimeout(() => {
              startBattle();
            }, 2000);
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSearching, matchFound]);

  const startSearch = () => {
    setIsSearching(true);
    setSearchTime(0);
    setMatchFound(false);
    setOpponent(null);
  };

  const cancelSearch = () => {
    setIsSearching(false);
    setSearchTime(0);
    setMatchFound(false);
    setOpponent(null);
  };

  const startBattle = () => {
    // Get player's active deck or create a default one
    const activeDeck = getActiveDeck();
    let playerCards = activeDeck ? 
      activeDeck.cardIds.map(id => getCardById(id)).filter(Boolean) : 
      CARDS.slice(0, 10);

    // Create opponent deck (random cards)
    const opponentCards = [...CARDS].sort(() => Math.random() - 0.5).slice(0, 10);

    initializeBattle(playerCards, opponentCards);
    onNavigate("battle");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!player) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Battle Arena</h1>
          <p className="text-gray-300">Find an opponent and prove your worth</p>
        </div>

        {/* Matchmaking Status */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-center text-white">
              {!isSearching && !matchFound && "Ready to Battle"}
              {isSearching && !matchFound && "Searching for Opponent..."}
              {matchFound && "Match Found!"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Not Searching State */}
            {!isSearching && !matchFound && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sword className="w-12 h-12 text-white" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-white text-lg">Enter the arena and face other duelists</p>
                  <p className="text-gray-400">Your rank: <span className="text-yellow-400">{player.rank}</span></p>
                </div>

                <Button
                  onClick={startSearch}
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold px-8 py-4"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Find Match
                </Button>
              </div>
            )}

            {/* Searching State */}
            {isSearching && !matchFound && (
              <div className="text-center space-y-6">
                <div className="relative">
                  <LoadingSpinner size="large" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-400 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-white text-lg">Searching for a worthy opponent...</p>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(searchTime)}</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={cancelSearch}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel Search
                  </Button>
                </div>
              </div>
            )}

            {/* Match Found State */}
            {matchFound && opponent && (
              <div className="text-center space-y-6">
                <div className="text-green-400 text-xl font-bold animate-pulse">
                  Opponent Found!
                </div>

                <div className="flex items-center justify-center gap-8">
                  {/* Player */}
                  <div className="text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-2 border-2 border-blue-500">
                      <AvatarFallback className="bg-blue-600 text-white text-lg">
                        {player.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-white font-bold">{player.username}</div>
                    <div className="text-sm text-gray-400">Level {player.level}</div>
                    <div className="text-xs text-yellow-400">{player.rank}</div>
                  </div>

                  {/* VS */}
                  <div className="text-4xl font-bold text-red-500 animate-pulse">VS</div>

                  {/* Opponent */}
                  <div className="text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-2 border-2 border-red-500">
                      <AvatarFallback className="bg-red-600 text-white text-lg">
                        {opponent.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-white font-bold">{opponent.username}</div>
                    <div className="text-sm text-gray-400">Level {opponent.level}</div>
                    <div className="text-xs text-yellow-400">{opponent.rank}</div>
                  </div>
                </div>

                <div className="text-gray-400 text-sm">
                  Entering battle in 2 seconds...
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Player Stats */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              Your Battle Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{player.wins}</div>
                <div className="text-sm text-gray-400">Wins</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{player.losses}</div>
                <div className="text-sm text-gray-400">Losses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {player.totalGames > 0 ? Math.round((player.wins / player.totalGames) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deck Preview */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Battle Deck
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Active Deck:</span>
                <span className="text-white">
                  {getActiveDeck()?.name || "Default Deck"}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Cards:</span>
                <span className="text-white">
                  {getActiveDeck()?.cardIds.length || 10} cards
                </span>
              </div>

              <Button
                variant="outline"
                onClick={() => onNavigate("deck-builder")}
                className="w-full border-white/20 text-white hover:bg-white/10"
                disabled={isSearching}
              >
                Change Deck
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation 
        currentScreen="matchmaking" 
        onNavigate={onNavigate}
        canGoBack={!isSearching}
      />
    </div>
  );
}
