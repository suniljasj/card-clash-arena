import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { CardComponent } from "../components/ui/card-component";
import { Navigation } from "../components/game/Navigation";
import { usePlayer } from "../lib/stores/usePlayer";
import { CARDS } from "../data/cards";
import { Card as CardType } from "../types/game";
import { GameScreen } from "../App";
import { 
  Search, 
  Filter,
  Grid3X3,
  List,
  Star,
  Eye
} from "lucide-react";

interface CardCollectionScreenProps {
  onNavigate: (screen: GameScreen, cardId?: string) => void;
}

export default function CardCollectionScreen({ onNavigate }: CardCollectionScreenProps) {
  const { player } = usePlayer();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showOnlyOwned, setShowOnlyOwned] = useState(false);

  const filteredCards = useMemo(() => {
    let cards = CARDS;

    // Filter by search term
    if (searchTerm) {
      cards = cards.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by rarity
    if (selectedRarity !== "all") {
      cards = cards.filter(card => card.rarity === selectedRarity);
    }

    // Filter by type
    if (selectedType !== "all") {
      cards = cards.filter(card => card.type === selectedType);
    }

    // Filter by ownership
    if (showOnlyOwned && player) {
      cards = cards.filter(card => player.ownedCards.includes(card.id));
    }

    return cards;
  }, [searchTerm, selectedRarity, selectedType, showOnlyOwned, player]);

  const getCardCount = (cardId: string): number => {
    return player?.cardCounts[cardId] || 0;
  };

  const isCardOwned = (cardId: string): boolean => {
    return player?.ownedCards.includes(cardId) || false;
  };

  const rarityColors = {
    common: "text-gray-400 border-gray-400",
    rare: "text-blue-400 border-blue-400", 
    epic: "text-purple-400 border-purple-400",
    legendary: "text-yellow-400 border-yellow-400"
  };

  const totalCards = CARDS.length;
  const ownedCards = player ? player.ownedCards.length : 0;
  const completionPercentage = Math.round((ownedCards / totalCards) * 100);

  if (!player) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Card Collection</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-300">
              Collect and master all {totalCards} cards
            </p>
            <Badge className="bg-blue-600 text-white">
              {ownedCards}/{totalCards} ({completionPercentage}%)
            </Badge>
          </div>
        </div>

        {/* Collection Stats */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              {["common", "rare", "epic", "legendary"].map(rarity => {
                const totalOfRarity = CARDS.filter(c => c.rarity === rarity).length;
                const ownedOfRarity = CARDS.filter(c => 
                  c.rarity === rarity && isCardOwned(c.id)
                ).length;

                return (
                  <div key={rarity} className="space-y-1">
                    <div className={`text-lg font-bold ${rarityColors[rarity as keyof typeof rarityColors].split(' ')[0]}`}>
                      {ownedOfRarity}/{totalOfRarity}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">{rarity}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Filter Row */}
            <div className="flex gap-4 flex-wrap">
              <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="creature">Creatures</SelectItem>
                  <SelectItem value="spell">Spells</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showOnlyOwned ? "default" : "outline"}
                onClick={() => setShowOnlyOwned(!showOnlyOwned)}
                className={showOnlyOwned 
                  ? "bg-blue-600 text-white" 
                  : "border-white/20 text-white hover:bg-white/10"
                }
              >
                Owned Only
              </Button>

              <div className="flex">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" 
                    ? "bg-blue-600 text-white" 
                    : "border-white/20 text-white hover:bg-white/10"
                  }
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" 
                    ? "bg-blue-600 text-white" 
                    : "border-white/20 text-white hover:bg-white/10"
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Display */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            {filteredCards.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No cards found matching your filters.</p>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                  : "space-y-3"
              }>
                {filteredCards.map((card) => {
                  const owned = isCardOwned(card.id);
                  const count = getCardCount(card.id);

                  if (viewMode === "grid") {
                    return (
                      <div key={card.id} className="relative">
                        <CardComponent
                          card={card}
                          onClick={() => onNavigate("card-detail", card.id)}
                          size="medium"
                          showCount={count}
                          className={!owned ? "opacity-50 grayscale" : ""}
                        />
                        
                        {!owned && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/80 text-white px-2 py-1 rounded text-xs">
                              Not Owned
                            </div>
                          </div>
                        )}

                        {card.rarity === "legendary" && (
                          <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={card.id}
                        onClick={() => onNavigate("card-detail", card.id)}
                        className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer hover:bg-white/5 transition-colors ${
                          owned 
                            ? "bg-white/5 border-white/10" 
                            : "bg-gray-800/50 border-gray-600/30 opacity-60"
                        }`}
                      >
                        <CardComponent
                          card={card}
                          size="small"
                          showCount={count}
                          className={!owned ? "opacity-50 grayscale" : ""}
                        />

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">{card.name}</h3>
                            <Badge className={`text-xs ${rarityColors[card.rarity]} bg-transparent`}>
                              {card.rarity}
                            </Badge>
                            {card.rarity === "legendary" && (
                              <Star className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {card.description}
                          </p>

                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span>Mana: {card.manaCost}</span>
                            {card.type === "creature" && (
                              <>
                                <span>ATK: {card.attack}</span>
                                <span>HP: {card.health}</span>
                              </>
                            )}
                            <span className="capitalize">{card.type}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {owned && count > 0 && (
                            <div className="text-xs text-gray-400 mt-1">
                              Owned: {count}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Navigation currentScreen="collection" onNavigate={onNavigate} />
    </div>
  );
}
