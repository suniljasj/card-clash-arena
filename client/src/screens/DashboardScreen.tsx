import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Navigation } from "../components/game/Navigation";
import { usePlayer } from "../lib/stores/usePlayer";
import { useAuth } from "../lib/stores/useAuth";
import { useQuests } from "../lib/stores/useQuests";
import { useAudio } from "../lib/stores/useAudio";
import { GameScreen } from "../App";
import { 
  Sword, 
  Trophy, 
  Coins, 
  Gem, 
  Star, 
  Crown,
  Gift,
  Zap,
  Volume2,
  VolumeX
} from "lucide-react";

interface DashboardScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

export default function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const { user } = useAuth();
  const { player, claimDailyBonus } = usePlayer();
  const { quests, initializeQuests } = useQuests();
  const { isMuted, toggleMute } = useAudio();
  const [showBonusModal, setShowBonusModal] = useState(false);

  useEffect(() => {
    initializeQuests();
    
    // Check if daily bonus is available
    if (player && player.lastLoginBonus) {
      const lastBonus = new Date(player.lastLoginBonus);
      const now = new Date();
      const canClaimBonus = now.getDate() !== lastBonus.getDate() || 
                           now.getMonth() !== lastBonus.getMonth() ||
                           now.getFullYear() !== lastBonus.getFullYear();
      
      if (canClaimBonus) {
        setShowBonusModal(true);
      }
    } else if (player && !player.lastLoginBonus) {
      setShowBonusModal(true);
    }
  }, [player, initializeQuests]);

  const handleClaimBonus = () => {
    const claimed = claimDailyBonus();
    if (claimed) {
      setShowBonusModal(false);
    }
  };

  const experienceToNextLevel = player ? 
    (player.level < 10 ? [0, 100, 250, 450, 700, 1000, 1400, 1850, 2350, 2900, 3500][player.level] - player.experience : 0) : 0;
  
  const experienceProgress = player ? 
    (experienceToNextLevel > 0 ? ((player.experience / ([0, 100, 250, 450, 700, 1000, 1400, 1850, 2350, 2900, 3500][player.level])) * 100) : 100) : 0;

  const completedQuests = quests.filter(q => q.isCompleted && !q.isClaimed).length;
  const notifications = {
    quests: completedQuests
  };

  if (!player) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      {/* Header */}
      <div className="relative p-6">
        {/* Audio Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMute}
          className="absolute top-4 right-4 bg-black/50 border-white/20 text-white hover:bg-white/20"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>

        {/* Player Info Header */}
        <div className="flex items-center gap-6 bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <Avatar className="w-20 h-20 border-4 border-blue-500">
            <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
              {player.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-white">{player.username}</h1>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                {player.rank}
              </Badge>
            </div>

            {/* Level and Experience */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-bold">Level {player.level}</span>
              </div>
              {experienceToNextLevel > 0 && (
                <div className="flex-1 max-w-xs">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>{player.experience} XP</span>
                    <span>{experienceToNextLevel} to next level</span>
                  </div>
                  <Progress value={experienceProgress} className="h-2" />
                </div>
              )}
            </div>

            {/* Currency */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">{player.gold.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-blue-400" />
                <span className="text-white font-bold">{player.gems}</span>
              </div>
            </div>
          </div>

          {/* Win/Loss Stats */}
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{player.wins}W / {player.losses}L</div>
            <div className="text-sm text-gray-400">
              {player.totalGames > 0 ? `${Math.round((player.wins / player.totalGames) * 100)}% Win Rate` : 'No battles yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => onNavigate("matchmaking")}
            className="h-20 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg"
          >
            <Sword className="w-6 h-6 mr-2" />
            Quick Battle
          </Button>
          
          <Button
            onClick={() => onNavigate("deck-builder")}
            className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg"
          >
            <Star className="w-6 h-6 mr-2" />
            Build Deck
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="px-6 space-y-6">
        {/* Daily Quests Preview */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Daily Quests
              </CardTitle>
              {completedQuests > 0 && (
                <Badge variant="destructive">{completedQuests} Ready!</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quests.filter(q => q.type === "daily").slice(0, 2).map(quest => (
                <div key={quest.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{quest.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={(quest.progress / quest.maxProgress) * 100} className="flex-1 h-2" />
                      <span className="text-xs text-gray-400">{quest.progress}/{quest.maxProgress}</span>
                    </div>
                  </div>
                  {quest.isCompleted && !quest.isClaimed && (
                    <Badge className="bg-green-600 ml-4">Complete!</Badge>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate("quests")}
              className="w-full mt-4 border-white/20 text-white hover:bg-white/10"
            >
              View All Quests
            </Button>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-400" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {player.achievements.length > 0 ? (
              <div className="space-y-2">
                {player.achievements.slice(-3).map(achievement => (
                  <div key={achievement} className="flex items-center gap-3 p-2 bg-white/5 rounded">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-white capitalize">{achievement.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No achievements yet. Start playing to earn them!</p>
            )}
            <Button
              variant="outline"
              onClick={() => onNavigate("profile")}
              className="w-full mt-4 border-white/20 text-white hover:bg-white/10"
            >
              View Profile
            </Button>
          </CardContent>
        </Card>

        {/* Store Preview */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-400" />
              Store Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
                <div>
                  <h4 className="text-white font-semibold">Basic Card Pack</h4>
                  <p className="text-sm text-gray-400">5 random cards</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-bold">100</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                <div>
                  <h4 className="text-white font-semibold">Premium Pack</h4>
                  <p className="text-sm text-gray-400">5 cards with rare guarantee</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-bold">200</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => onNavigate("store")}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
            >
              Visit Store
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Daily Bonus Modal */}
      {showBonusModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-gradient-to-br from-yellow-600 to-orange-600">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl flex items-center justify-center gap-2">
                <Gift className="w-8 h-8" />
                Daily Bonus!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-white/90">Welcome back! Claim your daily rewards:</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 bg-black/20 p-3 rounded-lg">
                  <Coins className="w-5 h-5 text-yellow-300" />
                  <span className="text-white font-bold">+100 Gold</span>
                </div>
                <div className="flex items-center justify-center gap-2 bg-black/20 p-3 rounded-lg">
                  <Gem className="w-5 h-5 text-blue-300" />
                  <span className="text-white font-bold">+5 Gems</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowBonusModal(false)}
                  className="flex-1 border-white/30 text-white hover:bg-white/10"
                >
                  Later
                </Button>
                <Button
                  onClick={handleClaimBonus}
                  className="flex-1 bg-white text-orange-600 hover:bg-white/90"
                >
                  Claim Now!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Navigation 
        currentScreen="dashboard" 
        onNavigate={onNavigate} 
        notifications={notifications}
      />
    </div>
  );
}
