import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Navigation } from "../components/game/Navigation";
import { useQuests } from "../lib/stores/useQuests";
import { usePlayer } from "../lib/stores/usePlayer";
import { GameScreen } from "../App";
import { 
  Trophy, 
  Clock, 
  Calendar,
  Star,
  Coins,
  Gem,
  Gift,
  CheckCircle,
  RotateCcw,
  Target,
  Flame,
  Award,
  Zap
} from "lucide-react";

interface QuestsScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

export default function QuestsScreen({ onNavigate }: QuestsScreenProps) {
  const { quests, claimRewards, refreshDailyQuests, initializeQuests } = useQuests();
  const { addGold, addGems, addExperience, addCard } = usePlayer();
  const [claimedRewards, setClaimedRewards] = useState<any>(null);

  useEffect(() => {
    initializeQuests();
  }, [initializeQuests]);

  const handleClaimRewards = (questId: string) => {
    const rewards = claimRewards(questId);
    if (rewards) {
      // Apply rewards to player
      if (rewards.gold) addGold(rewards.gold);
      if (rewards.gems) addGems(rewards.gems);
      if (rewards.experience) addExperience(rewards.experience);
      if (rewards.cards) {
        rewards.cards.forEach(cardId => addCard(cardId));
      }
      
      setClaimedRewards(rewards);
      setTimeout(() => setClaimedRewards(null), 3000);
    }
  };

  const dailyQuests = quests.filter(q => q.type === "daily");
  const weeklyQuests = quests.filter(q => q.type === "weekly");
  const achievements = quests.filter(q => q.type === "achievement");

  const completedQuests = quests.filter(q => q.isCompleted && !q.isClaimed);
  const totalProgress = quests.reduce((sum, q) => sum + q.progress, 0);

  const getTimeUntilReset = (type: "daily" | "weekly") => {
    const now = new Date();
    if (type === "daily") {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow.getTime() - now.getTime();
    } else {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + (7 - nextWeek.getDay()));
      nextWeek.setHours(0, 0, 0, 0);
      return nextWeek.getTime() - now.getTime();
    }
  };

  const formatTimeRemaining = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const QuestCard = ({ quest, showTimer = false }: { quest: any, showTimer?: boolean }) => {
    const progressPercentage = (quest.progress / quest.maxProgress) * 100;
    
    return (
      <Card className={`bg-black/60 backdrop-blur-sm border-white/20 ${
        quest.isCompleted && !quest.isClaimed ? 'border-green-500/50 bg-green-900/20' : ''
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-bold">{quest.title}</h3>
                <Badge 
                  className={`text-xs ${
                    quest.type === "daily" 
                      ? "bg-blue-600" 
                      : quest.type === "weekly" 
                      ? "bg-purple-600" 
                      : "bg-yellow-600"
                  }`}
                >
                  {quest.type}
                </Badge>
              </div>
              <p className="text-gray-300 text-sm">{quest.description}</p>
            </div>
            
            {quest.isCompleted && !quest.isClaimed && (
              <CheckCircle className="w-6 h-6 text-green-400 ml-2" />
            )}
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-white">
                {quest.progress}/{quest.maxProgress}
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
          </div>

          {/* Rewards */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {quest.rewards.gold && (
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-bold">{quest.rewards.gold}</span>
                </div>
              )}
              {quest.rewards.gems && (
                <div className="flex items-center gap-1">
                  <Gem className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm font-bold">{quest.rewards.gems}</span>
                </div>
              )}
              {quest.rewards.experience && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 text-sm font-bold">{quest.rewards.experience}</span>
                </div>
              )}
              {quest.rewards.cards && quest.rewards.cards.length > 0 && (
                <div className="flex items-center gap-1">
                  <Gift className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-bold">{quest.rewards.cards.length}</span>
                </div>
              )}
            </div>

            {quest.isCompleted && !quest.isClaimed ? (
              <Button
                onClick={() => handleClaimRewards(quest.id)}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Gift className="w-4 h-4 mr-1" />
                Claim
              </Button>
            ) : quest.isClaimed ? (
              <Badge variant="outline" className="text-green-400 border-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Claimed
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-400 border-gray-400">
                In Progress
              </Badge>
            )}
          </div>

          {/* Timer for daily/weekly quests */}
          {showTimer && quest.expiresAt && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>
                  Resets in: {formatTimeRemaining(new Date(quest.expiresAt).getTime() - Date.now())}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Quests & Missions
          </h1>
          <p className="text-gray-300">Complete challenges to earn rewards</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{completedQuests.length}</div>
              <div className="text-sm text-gray-400">Ready to Claim</div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{totalProgress}</div>
              <div className="text-sm text-gray-400">Total Progress</div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{achievements.filter(a => a.isCompleted).length}</div>
              <div className="text-sm text-gray-400">Achievements</div>
            </CardContent>
          </Card>
        </div>

        {/* Claimed Rewards Notification */}
        {claimedRewards && (
          <Card className="mb-6 bg-green-600/20 backdrop-blur-sm border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div className="flex-1">
                  <h3 className="text-white font-bold">Rewards Claimed!</h3>
                  <div className="flex items-center gap-4 mt-1">
                    {claimedRewards.gold && (
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400">+{claimedRewards.gold}</span>
                      </div>
                    )}
                    {claimedRewards.gems && (
                      <div className="flex items-center gap-1">
                        <Gem className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400">+{claimedRewards.gems}</span>
                      </div>
                    )}
                    {claimedRewards.experience && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-400">+{claimedRewards.experience} XP</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Daily ({dailyQuests.length})
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Weekly ({weeklyQuests.length})
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Achievements ({achievements.length})
            </TabsTrigger>
          </TabsList>

          {/* Daily Quests */}
          <TabsContent value="daily" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Daily Quests</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400">
                  Resets in: {formatTimeRemaining(getTimeUntilReset("daily"))}
                </div>
                <Button
                  onClick={refreshDailyQuests}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {dailyQuests.length > 0 ? (
              <div className="space-y-4">
                {dailyQuests.map(quest => (
                  <QuestCard key={quest.id} quest={quest} showTimer />
                ))}
              </div>
            ) : (
              <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No daily quests available.</p>
                  <p className="text-sm text-gray-500 mt-2">Check back tomorrow for new challenges!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Weekly Quests */}
          <TabsContent value="weekly" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Weekly Challenges</h2>
              <div className="text-sm text-gray-400">
                Resets in: {formatTimeRemaining(getTimeUntilReset("weekly"))}
              </div>
            </div>

            {weeklyQuests.length > 0 ? (
              <div className="space-y-4">
                {weeklyQuests.map(quest => (
                  <QuestCard key={quest.id} quest={quest} showTimer />
                ))}
              </div>
            ) : (
              <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No weekly quests available.</p>
                  <p className="text-sm text-gray-500 mt-2">New weekly challenges coming soon!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Achievements</h2>

            {/* Completed Achievements */}
            {achievements.filter(a => a.isCompleted).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Unlocked ({achievements.filter(a => a.isCompleted).length})
                </h3>
                <div className="space-y-4">
                  {achievements.filter(a => a.isCompleted).map(quest => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </div>
              </div>
            )}

            {/* In Progress Achievements */}
            {achievements.filter(a => !a.isCompleted && a.progress > 0).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  In Progress ({achievements.filter(a => !a.isCompleted && a.progress > 0).length})
                </h3>
                <div className="space-y-4">
                  {achievements.filter(a => !a.isCompleted && a.progress > 0).map(quest => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </div>
              </div>
            )}

            {/* Locked Achievements */}
            {achievements.filter(a => !a.isCompleted && a.progress === 0).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-400 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Locked ({achievements.filter(a => !a.isCompleted && a.progress === 0).length})
                </h3>
                <div className="space-y-4">
                  {achievements.filter(a => !a.isCompleted && a.progress === 0).map(quest => (
                    <div key={quest.id} className="opacity-60">
                      <QuestCard quest={quest} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {achievements.length === 0 && (
              <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No achievements available yet.</p>
                  <p className="text-sm text-gray-500 mt-2">Start playing to unlock achievements!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Navigation currentScreen="quests" onNavigate={onNavigate} />
    </div>
  );
}
