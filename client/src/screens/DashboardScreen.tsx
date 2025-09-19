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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-700/20 via-transparent to-transparent"></div>
      
      {/* Game Logo/Title */}
      <div className="relative text-center pt-8 mb-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
          <div className="flex items-center gap-2">
            <Sword className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold tracking-wider">CARD CLASH</h1>
            <Sword className="w-8 h-8 text-amber-400 scale-x-[-1]" />
          </div>
        </div>
        <div className="text-lg font-semibold text-amber-300 tracking-widest mt-1">LEGENDS ARENA</div>
      </div>

      {/* Header */}
      <div className="relative px-6">
        {/* Audio Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMute}
          className="absolute top-0 right-4 bg-black/50 border-amber-400/40 text-amber-300 hover:bg-amber-400/20 hover:border-amber-400"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>

        {/* Player Info Header */}
        <div className="flex items-center gap-6 bg-gradient-to-r from-black/60 via-purple-900/60 to-black/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-amber-400/30 shadow-2xl">
          <Avatar className="w-20 h-20 border-4 border-amber-400 shadow-lg shadow-amber-400/50">
            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-white text-2xl font-bold">
              {player.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-amber-300 tracking-wide">{player.username}</h1>
              <Badge variant="outline" className="text-amber-400 border-amber-400 bg-amber-400/10 px-3 py-1">
                {player.rank}
              </Badge>
            </div>

            {/* Level and Experience */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-bold text-lg">Level {player.level}</span>
              </div>
              {experienceToNextLevel > 0 && (
                <div className="flex-1 max-w-xs">
                  <div className="flex justify-between text-sm text-amber-200/80 mb-1">
                    <span>{player.experience} XP</span>
                    <span>{experienceToNextLevel} to next level</span>
                  </div>
                  <div className="h-3 bg-purple-900/60 rounded-full overflow-hidden border border-amber-400/30">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500"
                      style={{ width: `${experienceProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Currency */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 bg-amber-400/10 px-4 py-2 rounded-full border border-amber-400/30">
                <Coins className="w-6 h-6 text-amber-400" />
                <span className="text-amber-300 font-bold text-lg">{player.gold.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3 bg-blue-400/10 px-4 py-2 rounded-full border border-blue-400/30">
                <Gem className="w-6 h-6 text-blue-400" />
                <span className="text-blue-300 font-bold text-lg">{player.gems}</span>
              </div>
            </div>
          </div>

          {/* Win/Loss Stats */}
          <div className="text-center bg-purple-900/40 px-4 py-3 rounded-xl border border-amber-400/20">
            <div className="text-2xl font-bold text-amber-300 mb-1">{player.wins}W / {player.losses}L</div>
            <div className="text-sm text-gray-400">
              {player.totalGames > 0 ? `${Math.round((player.wins / player.totalGames) * 100)}% Win Rate` : 'No battles yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Buttons Grid */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-6">
          <Button
            onClick={() => onNavigate("matchmaking")}
            className="h-24 bg-gradient-to-br from-red-700 via-red-600 to-orange-600 hover:from-red-800 hover:via-red-700 hover:to-orange-700 text-white font-bold text-xl border-4 border-amber-400/50 rounded-2xl shadow-2xl shadow-red-600/30 transition-all duration-300 hover:scale-105 hover:shadow-red-600/50"
          >
            <div className="flex flex-col items-center gap-2">
              <Sword className="w-8 h-8" />
              <span>BATTLE ARENA</span>
            </div>
          </Button>
          <Button
            onClick={() => onNavigate("deck-builder")}
            className="h-24 bg-gradient-to-br from-blue-700 via-purple-600 to-indigo-600 hover:from-blue-800 hover:via-purple-700 hover:to-indigo-700 text-white font-bold text-xl border-4 border-amber-400/50 rounded-2xl shadow-2xl shadow-purple-600/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-600/50"
          >
            <div className="flex flex-col items-center gap-2">
              <Star className="w-8 h-8" />
              <span>DECK BUILDER</span>
            </div>
          </Button>
        </div>

        {/* Secondary Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <Button
            onClick={() => onNavigate("collection")}
            className="h-20 bg-gradient-to-br from-emerald-700 via-green-600 to-teal-600 hover:from-emerald-800 hover:via-green-700 hover:to-teal-700 text-white font-bold text-lg border-4 border-amber-400/50 rounded-2xl shadow-2xl shadow-green-600/30 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center gap-1">
              <Trophy className="w-6 h-6" />
              <span>CARD COLLECTION</span>
            </div>
          </Button>
          <Button
            onClick={() => onNavigate("store")}
            className="h-20 bg-gradient-to-br from-amber-700 via-yellow-600 to-orange-600 hover:from-amber-800 hover:via-yellow-700 hover:to-orange-700 text-white font-bold text-lg border-4 border-amber-400/50 rounded-2xl shadow-2xl shadow-amber-600/30 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center gap-1">
              <Gift className="w-6 h-6" />
              <span>STORE</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="px-6 space-y-6">
        {/* Daily Quests Preview */}
        <Card className="bg-gradient-to-br from-black/70 via-purple-900/40 to-black/70 backdrop-blur-sm border-2 border-amber-400/30 rounded-2xl shadow-2xl shadow-purple-900/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-amber-300 flex items-center gap-2 text-xl font-bold">
                <Trophy className="w-6 h-6 text-amber-400" />
                Daily Quests
              </CardTitle>
              {completedQuests > 0 && (
                <Badge className="bg-gradient-to-br from-red-600 to-red-800 text-white border border-amber-400/50 px-3 py-1 text-sm font-bold">
                  {completedQuests} Ready!
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quests.filter(q => q.type === "daily").slice(0, 2).map(quest => (
                <div key={quest.id} className="flex items-center justify-between p-4 bg-purple-900/30 rounded-xl border border-amber-400/20">
                  <div className="flex-1">
                    <h4 className="text-amber-300 font-bold text-lg">{quest.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-3 bg-purple-900/60 rounded-full overflow-hidden border border-amber-400/30">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500"
                          style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-amber-200 font-bold">{quest.progress}/{quest.maxProgress}</span>
                    </div>
                  </div>
                  {quest.isCompleted && !quest.isClaimed && (
                    <Badge className="bg-gradient-to-br from-green-600 to-green-800 text-white border border-amber-400/50 ml-4 px-3 py-1 font-bold">
                      Complete!
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate("quests")}
              className="w-full mt-6 border-2 border-amber-400/50 text-amber-300 hover:bg-amber-400/20 hover:border-amber-400 font-bold text-lg py-3 rounded-xl"
            >
              View All Quests
            </Button>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="bg-gradient-to-br from-black/70 via-purple-900/40 to-black/70 backdrop-blur-sm border-2 border-amber-400/30 rounded-2xl shadow-2xl shadow-purple-900/20">
          <CardHeader>
            <CardTitle className="text-amber-300 flex items-center gap-2 text-xl font-bold">
              <Star className="w-6 h-6 text-purple-400" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {player.achievements.length > 0 ? (
              <div className="space-y-3">
                {player.achievements.slice(-3).map(achievement => (
                  <div key={achievement} className="flex items-center gap-3 p-4 bg-purple-900/30 rounded-xl border border-amber-400/20">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-300 capitalize font-bold text-lg">{achievement.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-amber-200/80 text-center py-6">No achievements yet. Start playing to earn them!</p>
            )}
            <Button
              variant="outline"
              onClick={() => onNavigate("profile")}
              className="w-full mt-6 border-2 border-amber-400/50 text-amber-300 hover:bg-amber-400/20 hover:border-amber-400 font-bold text-lg py-3 rounded-xl"
            >
              View Profile
            </Button>
          </CardContent>
        </Card>

        {/* Store Preview */}
        <Card className="bg-gradient-to-br from-black/70 via-purple-900/40 to-black/70 backdrop-blur-sm border-2 border-amber-400/30 rounded-2xl shadow-2xl shadow-purple-900/20">
          <CardHeader>
            <CardTitle className="text-amber-300 flex items-center gap-2 text-xl font-bold">
              <Gift className="w-6 h-6 text-green-400" />
              Store Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl border-2 border-blue-500/50 shadow-lg">
                <div>
                  <h4 className="text-amber-300 font-bold text-lg">Basic Card Pack</h4>
                  <p className="text-sm text-blue-300">5 random cards</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 bg-amber-400/20 px-3 py-2 rounded-full border border-amber-400/50">
                    <Coins className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-300 font-bold text-lg">100</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-xl border-2 border-purple-500/50 shadow-lg">
                <div>
                  <h4 className="text-amber-300 font-bold text-lg">Premium Pack</h4>
                  <p className="text-sm text-purple-300">5 cards with rare guarantee</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 bg-amber-400/20 px-3 py-2 rounded-full border border-amber-400/50">
                    <Coins className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-300 font-bold text-lg">200</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => onNavigate("store")}
              className="w-full mt-6 bg-gradient-to-br from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold text-lg py-3 rounded-xl border-2 border-amber-400/50 shadow-xl transition-all duration-300 hover:scale-105"
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
