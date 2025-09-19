import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { usePlayer } from "../lib/stores/usePlayer";
import { useQuests } from "../lib/stores/useQuests";
import { GameScreen } from "../App";
import { 
  Trophy, 
  Crown, 
  Coins, 
  Gem, 
  Star,
  Target,
  Home,
  RotateCcw,
  Gift
} from "lucide-react";

interface VictoryDefeatScreenProps {
  type: "victory" | "defeat";
  onNavigate: (screen: GameScreen) => void;
}

interface BattleReward {
  type: "gold" | "gems" | "experience" | "card";
  amount: number;
  name?: string;
}

export default function VictoryDefeatScreen({ type, onNavigate }: VictoryDefeatScreenProps) {
  const { player, addCard } = usePlayer();
  const { updateQuestProgress } = useQuests();
  const [rewards, setRewards] = useState<BattleReward[]>([]);
  const [showRewards, setShowRewards] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);

  useEffect(() => {
    // Calculate rewards based on victory/defeat
    const calculateRewards = () => {
      const baseRewards: BattleReward[] = [];
      
      if (type === "victory") {
        baseRewards.push(
          { type: "experience", amount: 100 },
          { type: "gold", amount: 75 }
        );

        // Chance for bonus rewards
        if (Math.random() > 0.7) {
          baseRewards.push({ type: "gems", amount: 5 });
        }

        // Chance for card reward
        if (Math.random() > 0.8) {
          baseRewards.push({ 
            type: "card", 
            amount: 1, 
            name: "Random Card Pack"
          });
          addCard("basic_warrior"); // Mock card reward
        }

        // Update quest progress
        updateQuestProgress("daily_battles", 1);
        updateQuestProgress("weekly_wins", 1);
      } else {
        baseRewards.push(
          { type: "experience", amount: 50 },
          { type: "gold", amount: 25 }
        );
      }

      setRewards(baseRewards);
    };

    calculateRewards();

    // Show rewards after animation
    const timer = setTimeout(() => {
      setShowRewards(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [type, addCard, updateQuestProgress]);

  // Check for level up
  useEffect(() => {
    if (player && showRewards) {
      const levelThresholds = [0, 100, 250, 450, 700, 1000, 1400, 1850, 2350, 2900, 3500];
      const currentLevel = player.level;
      const currentExp = player.experience;
      
      // Simple level up check (this is basic - in real implementation you'd track previous values)
      if (currentLevel > 1 && currentExp >= levelThresholds[currentLevel - 1]) {
        const expGained = rewards.find(r => r.type === "experience")?.amount || 0;
        const previousExp = currentExp - expGained;
        
        if (previousExp < levelThresholds[currentLevel - 1]) {
          setLeveledUp(true);
        }
      }
    }
  }, [player, showRewards, rewards]);

  const isVictory = type === "victory";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {isVictory ? (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-2000" />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </>
        )}
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Main Result Card */}
        <Card className={`mb-6 backdrop-blur-sm border-white/20 ${
          isVictory 
            ? "bg-gradient-to-br from-green-900/60 to-emerald-900/60" 
            : "bg-gradient-to-br from-red-900/60 to-rose-900/60"
        }`}>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              {isVictory ? (
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                  <Target className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            
            <CardTitle className={`text-4xl font-bold ${
              isVictory ? "text-yellow-400" : "text-red-400"
            }`}>
              {isVictory ? "Victory!" : "Defeat"}
            </CardTitle>
            
            <p className="text-gray-300 text-lg mt-2">
              {isVictory 
                ? "Congratulations! You have triumphed in battle!" 
                : "Don't give up! Every defeat is a lesson learned."
              }
            </p>
          </CardHeader>

          {showRewards && (
            <CardContent>
              <div className="space-y-6">
                {/* Battle Stats */}
                {player && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-400">{player.wins}</div>
                      <div className="text-sm text-gray-400">Total Wins</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-400">{player.losses}</div>
                      <div className="text-sm text-gray-400">Total Losses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">
                        {player.totalGames > 0 ? Math.round((player.wins / player.totalGames) * 100) : 0}%
                      </div>
                      <div className="text-sm text-gray-400">Win Rate</div>
                    </div>
                  </div>
                )}

                {/* Rewards */}
                <div className="bg-black/40 p-6 rounded-lg">
                  <h3 className="text-white font-bold text-xl mb-4 text-center flex items-center justify-center gap-2">
                    <Gift className="w-5 h-5" />
                    Battle Rewards
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {rewards.map((reward, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg animate-fade-in"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <div className="flex items-center gap-2">
                          {reward.type === "gold" && <Coins className="w-5 h-5 text-yellow-400" />}
                          {reward.type === "gems" && <Gem className="w-5 h-5 text-blue-400" />}
                          {reward.type === "experience" && <Star className="w-5 h-5 text-purple-400" />}
                          {reward.type === "card" && <Gift className="w-5 h-5 text-green-400" />}
                          
                          <span className="text-white">
                            {reward.type === "card" ? reward.name : reward.type}
                          </span>
                        </div>
                        
                        <Badge variant="outline" className="text-white border-white/30">
                          {reward.type === "card" ? "x1" : `+${reward.amount}`}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Level Up Notification */}
                {leveledUp && (
                  <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 p-4 rounded-lg text-center animate-pulse">
                    <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <h4 className="text-yellow-400 font-bold text-lg">Level Up!</h4>
                    <p className="text-white">You are now level {player?.level}!</p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Action Buttons */}
        {showRewards && (
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => onNavigate("dashboard")}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            
            <Button
              onClick={() => onNavigate("matchmaking")}
              className={`${
                isVictory 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {isVictory ? "Play Again" : "Try Again"}
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          opacity: 0;
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
