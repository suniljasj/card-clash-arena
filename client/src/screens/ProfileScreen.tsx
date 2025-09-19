import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Navigation } from "../components/game/Navigation";
import { usePlayer } from "../lib/stores/usePlayer";
import { useAuth } from "../lib/stores/useAuth";
import { GameScreen } from "../App";
import { 
  Crown, 
  Trophy, 
  Star, 
  Coins, 
  Gem,
  Target,
  Calendar,
  Award,
  Edit3,
  Save,
  User,
  BarChart3,
  Flame,
  Shield
} from "lucide-react";

interface ProfileScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

const AVATAR_OPTIONS = [
  { id: "warrior", name: "Warrior", icon: "⚔️" },
  { id: "mage", name: "Mage", icon: "🔮" },
  { id: "archer", name: "Archer", icon: "🏹" },
  { id: "knight", name: "Knight", icon: "🛡️" },
  { id: "assassin", name: "Assassin", icon: "🗡️" },
  { id: "paladin", name: "Paladin", icon: "✨" },
  { id: "necromancer", name: "Necromancer", icon: "💀" },
  { id: "druid", name: "Druid", icon: "🌿" }
];

const ACHIEVEMENTS = [
  { id: "first_win", name: "First Victory", description: "Win your first battle", icon: "🎯", rarity: "common" },
  { id: "deck_builder", name: "Deck Builder", description: "Create your first custom deck", icon: "📚", rarity: "common" },
  { id: "collector_novice", name: "Novice Collector", description: "Own 25 different cards", icon: "📇", rarity: "rare" },
  { id: "collector_expert", name: "Expert Collector", description: "Own 50 different cards", icon: "📊", rarity: "epic" },
  { id: "battle_veteran", name: "Battle Veteran", description: "Play 100 battles", icon: "⚔️", rarity: "epic" },
  { id: "win_streak", name: "Unstoppable", description: "Win 10 battles in a row", icon: "🔥", rarity: "legendary" },
  { id: "legendary_owner", name: "Legend Collector", description: "Own 5 legendary cards", icon: "👑", rarity: "legendary" }
];

export default function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { player, updatePlayer } = usePlayer();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  if (!player || !user) return null;

  const handleEdit = () => {
    setEditedName(player.username);
    setSelectedAvatar(player.avatar);
    setIsEditing(true);
  };

  const handleSave = () => {
    updatePlayer({
      username: editedName,
      avatar: selectedAvatar
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName("");
    setSelectedAvatar("");
    setIsEditing(false);
  };

  const experienceToNextLevel = player.level < 10 ? 
    [0, 100, 250, 450, 700, 1000, 1400, 1850, 2350, 2900, 3500][player.level] - player.experience : 0;
  
  const experienceProgress = experienceToNextLevel > 0 ? 
    ((player.experience / [0, 100, 250, 450, 700, 1000, 1400, 1850, 2350, 2900, 3500][player.level]) * 100) : 100;

  const unlockedAchievements = ACHIEVEMENTS.filter(achievement => 
    player.achievements.includes(achievement.id)
  );

  const lockedAchievements = ACHIEVEMENTS.filter(achievement => 
    !player.achievements.includes(achievement.id)
  );

  const rarityColors = {
    common: "border-gray-400 bg-gray-100 text-gray-800",
    rare: "border-blue-400 bg-blue-100 text-blue-800",
    epic: "border-purple-400 bg-purple-100 text-purple-800",
    legendary: "border-yellow-400 bg-yellow-100 text-yellow-800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Player Profile</h1>
          <p className="text-gray-300">Manage your profile and view your achievements</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Profile Info Card */}
            <Card className="bg-black/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  {/* Avatar */}
                  <div className="text-center">
                    <Avatar className="w-24 h-24 border-4 border-blue-500 mb-2">
                      <AvatarFallback className="bg-blue-600 text-white text-2xl">
                        {(isEditing ? selectedAvatar : player.avatar) || player.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {AVATAR_OPTIONS.map(option => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedAvatar(option.id)}
                            className={`w-8 h-8 rounded border-2 flex items-center justify-center text-sm ${
                              selectedAvatar === option.id 
                                ? "border-blue-500 bg-blue-500/20" 
                                : "border-gray-600 bg-gray-800"
                            }`}
                          >
                            {option.icon}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm">Username</label>
                      {isEditing ? (
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      ) : (
                        <div className="text-white text-xl font-bold">{player.username}</div>
                      )}
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <div className="text-white">{user.email}</div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm">Member Since</label>
                      <div className="text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Level & Rank */}
                  <div className="text-center space-y-4">
                    <div>
                      <div className="flex items-center gap-2 justify-center mb-2">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <span className="text-white text-xl font-bold">Level {player.level}</span>
                      </div>
                      
                      {experienceToNextLevel > 0 && (
                        <div className="w-32">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>{player.experience} XP</span>
                            <span>{experienceToNextLevel} to go</span>
                          </div>
                          <Progress value={experienceProgress} className="h-2" />
                        </div>
                      )}
                    </div>

                    <Badge className="bg-yellow-600 text-white">
                      {player.rank}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Currency & Collection */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Currencies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-600/20 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-semibold">Gold</span>
                    </div>
                    <span className="text-white font-bold">{player.gold.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                    <div className="flex items-center gap-2">
                      <Gem className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-semibold">Gems</span>
                    </div>
                    <span className="text-white font-bold">{player.gems}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Collection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Cards:</span>
                    <span className="text-white font-bold">{player.ownedCards.length}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Active Deck:</span>
                    <span className="text-white">{player.activeDeckId ? "Custom Deck" : "Default"}</span>
                  </div>

                  <Button
                    onClick={() => onNavigate("collection")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    View Collection
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{player.wins}</div>
                  <div className="text-sm text-gray-400">Total Wins</div>
                </CardContent>
              </Card>

              <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Shield className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{player.losses}</div>
                  <div className="text-sm text-gray-400">Total Losses</div>
                </CardContent>
              </Card>

              <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {player.totalGames > 0 ? Math.round((player.wins / player.totalGames) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-400">Win Rate</div>
                </CardContent>
              </Card>

              <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{player.totalGames}</div>
                  <div className="text-sm text-gray-400">Games Played</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats */}
            <Card className="bg-black/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Battle Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Best Win Streak:</span>
                    <span className="text-white font-bold">Coming Soon</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Favorite Card Type:</span>
                    <span className="text-white font-bold">Coming Soon</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Average Game Length:</span>
                    <span className="text-white font-bold">Coming Soon</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Total Damage Dealt:</span>
                    <span className="text-white font-bold">Coming Soon</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {/* Unlocked Achievements */}
            <Card className="bg-black/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Unlocked Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {unlockedAchievements.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {unlockedAchievements.map(achievement => (
                      <div key={achievement.id} className="flex items-center gap-4 p-4 bg-green-600/20 rounded-lg border border-green-500/30">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-bold">{achievement.name}</h3>
                            <Badge className={rarityColors[achievement.rarity]}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-sm">{achievement.description}</p>
                        </div>
                        <Award className="w-6 h-6 text-yellow-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No achievements unlocked yet.</p>
                    <p className="text-sm mt-2">Start playing to earn your first achievement!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Locked Achievements */}
            {lockedAchievements.length > 0 && (
              <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Locked Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {lockedAchievements.map(achievement => (
                      <div key={achievement.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600/30 opacity-60">
                        <div className="text-2xl grayscale">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-gray-300 font-bold">{achievement.name}</h3>
                            <Badge className={`opacity-50 ${rarityColors[achievement.rarity]}`}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                        </div>
                        <div className="w-6 h-6 border-2 border-gray-600 rounded" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Navigation currentScreen="profile" onNavigate={onNavigate} />
    </div>
  );
}
