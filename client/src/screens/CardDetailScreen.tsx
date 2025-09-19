import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CardComponent } from "../components/ui/card-component";
import { usePlayer } from "../lib/stores/usePlayer";
import { getCardById } from "../lib/stores/useCards";
import { GameScreen } from "../App";
import { 
  ArrowLeft, 
  Sword, 
  Shield, 
  Zap, 
  Star,
  BookOpen,
  Plus,
  Minus
} from "lucide-react";

interface CardDetailScreenProps {
  cardId: string;
  onNavigate: (screen: GameScreen) => void;
}

export default function CardDetailScreen({ cardId, onNavigate }: CardDetailScreenProps) {
  const { player, addCard, removeCard } = usePlayer();
  const card = getCardById(cardId);

  if (!card || !player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
          <Button onClick={() => onNavigate("collection")}>
            Return to Collection
          </Button>
        </div>
      </div>
    );
  }

  const isOwned = player.ownedCards.includes(cardId);
  const cardCount = player.cardCounts[cardId] || 0;

  const rarityColors = {
    common: "border-gray-400 bg-gray-100 text-gray-800",
    rare: "border-blue-400 bg-blue-100 text-blue-800",
    epic: "border-purple-400 bg-purple-100 text-purple-800",
    legendary: "border-yellow-400 bg-yellow-100 text-yellow-800"
  };

  const rarityGradients = {
    common: "from-gray-600 to-gray-800",
    rare: "from-blue-600 to-blue-800",
    epic: "from-purple-600 to-purple-800",
    legendary: "from-yellow-600 to-yellow-800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("collection")}
          className="bg-black/50 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="p-6 pt-16">
        <div className="max-w-4xl mx-auto">
          {/* Main Card Display */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Card Visual */}
            <div className="flex justify-center">
              <div className="relative">
                <CardComponent
                  card={card}
                  size="large"
                  className="w-64 h-96 shadow-2xl"
                />
                
                {card.rarity === "legendary" && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                )}

                {!isOwned && (
                  <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-2xl font-bold mb-2">Not Owned</div>
                      <div className="text-sm">Find this card in packs!</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Info */}
            <div className="space-y-6">
              {/* Name and Rarity */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{card.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={`${rarityColors[card.rarity]} capitalize`}>
                    {card.rarity}
                  </Badge>
                  <Badge variant="outline" className="text-white border-white/30 capitalize">
                    {card.type}
                  </Badge>
                </div>
                
                {isOwned && (
                  <div className="text-green-400 font-semibold">
                    Owned: {cardCount} {cardCount === 1 ? "copy" : "copies"}
                  </div>
                )}
              </div>

              {/* Description */}
              <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <p className="text-gray-300 leading-relaxed">{card.description}</p>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Card Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                      <Zap className="w-6 h-6 text-blue-400" />
                      <div>
                        <div className="text-sm text-gray-400">Mana Cost</div>
                        <div className="text-xl font-bold text-white">{card.manaCost}</div>
                      </div>
                    </div>

                    {card.type === "creature" && (
                      <>
                        <div className="flex items-center gap-3 p-3 bg-red-600/20 rounded-lg border border-red-500/30">
                          <Sword className="w-6 h-6 text-red-400" />
                          <div>
                            <div className="text-sm text-gray-400">Attack</div>
                            <div className="text-xl font-bold text-white">{card.attack}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-green-600/20 rounded-lg border border-green-500/30">
                          <Shield className="w-6 h-6 text-green-400" />
                          <div>
                            <div className="text-sm text-gray-400">Health</div>
                            <div className="text-xl font-bold text-white">{card.health}</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Keywords */}
              {card.keywords && card.keywords.length > 0 && (
                <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {card.keywords.map((keyword) => (
                        <Badge 
                          key={keyword} 
                          variant="outline" 
                          className="text-blue-400 border-blue-400/50"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Admin Controls (for testing) */}
              {isOwned && (
                <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Collection Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCard(cardId, 1)}
                        disabled={cardCount <= 0}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <span className="text-white font-bold">{cardCount}</span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addCard(cardId, 1)}
                        className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Lore Section */}
          {card.lore && (
            <Card className="bg-black/60 backdrop-blur-sm border-white/20 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  Lore
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed italic text-lg">
                  "{card.lore}"
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => onNavigate("collection")}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Back to Collection
            </Button>
            
            <Button
              onClick={() => onNavigate("deck-builder")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!isOwned}
            >
              Add to Deck
            </Button>
            
            <Button
              onClick={() => onNavigate("store")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Find in Store
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
