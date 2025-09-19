import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { CardComponent } from "../components/ui/card-component";
import { Navigation } from "../components/game/Navigation";
import { usePlayer } from "../lib/stores/usePlayer";
import { useCards, getCardById } from "../lib/stores/useCards";
import { CARDS } from "../data/cards";
import { GameScreen } from "../App";
import { 
  Plus, 
  Save, 
  Trash2, 
  Search,
  Edit,
  Copy,
  BarChart3,
  Zap
} from "lucide-react";

interface DeckBuilderScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

const MAX_DECK_SIZE = 30;
const MIN_DECK_SIZE = 20;

export default function DeckBuilderScreen({ onNavigate }: DeckBuilderScreenProps) {
  const { player } = usePlayer();
  const { decks, createDeck, updateDeck, deleteDeck, setActiveDeck, getActiveDeck } = useCards();
  
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [deckCards, setDeckCards] = useState<string[]>([]);
  const [deckName, setDeckName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isEditing, setIsEditing] = useState(false);

  // Load active deck or create new one
  useEffect(() => {
    const activeDeck = getActiveDeck();
    if (activeDeck) {
      setSelectedDeckId(activeDeck.id);
      setDeckCards([...activeDeck.cardIds]);
      setDeckName(activeDeck.name);
    } else {
      // Create new deck
      setDeckCards([]);
      setDeckName("New Deck");
      setIsEditing(true);
    }
  }, []);

  const availableCards = CARDS.filter(card => {
    if (!player || !player.ownedCards.includes(card.id)) return false;
    
    if (searchTerm && !card.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedRarity !== "all" && card.rarity !== selectedRarity) return false;
    if (selectedType !== "all" && card.type !== selectedType) return false;
    
    return true;
  });

  const getCardCountInDeck = (cardId: string): number => {
    return deckCards.filter(id => id === cardId).length;
  };

  const canAddCard = (cardId: string): boolean => {
    const countInDeck = getCardCountInDeck(cardId);
    const ownedCount = player?.cardCounts[cardId] || 0;
    return deckCards.length < MAX_DECK_SIZE && countInDeck < Math.min(3, ownedCount);
  };

  const addCardToDeck = (cardId: string) => {
    if (canAddCard(cardId)) {
      setDeckCards([...deckCards, cardId]);
    }
  };

  const removeCardFromDeck = (cardId: string) => {
    const index = deckCards.findIndex(id => id === cardId);
    if (index !== -1) {
      const newCards = [...deckCards];
      newCards.splice(index, 1);
      setDeckCards(newCards);
    }
  };

  const saveDeck = () => {
    if (deckCards.length < MIN_DECK_SIZE) {
      alert(`Deck must have at least ${MIN_DECK_SIZE} cards`);
      return;
    }

    if (selectedDeckId) {
      // Update existing deck
      updateDeck(selectedDeckId, { name: deckName, cardIds: deckCards });
    } else {
      // Create new deck
      const newDeckId = createDeck(deckName, deckCards);
      setSelectedDeckId(newDeckId);
      setActiveDeck(newDeckId);
    }
    
    setIsEditing(false);
  };

  const loadDeck = (deckId: string) => {
    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      setSelectedDeckId(deckId);
      setDeckCards([...deck.cardIds]);
      setDeckName(deck.name);
      setIsEditing(false);
      setActiveDeck(deckId);
    }
  };

  const duplicateDeck = () => {
    const newName = `${deckName} (Copy)`;
    const newDeckId = createDeck(newName, deckCards);
    setSelectedDeckId(newDeckId);
    setDeckName(newName);
    setActiveDeck(newDeckId);
  };

  const deleteDeckHandler = () => {
    if (selectedDeckId && confirm("Are you sure you want to delete this deck?")) {
      deleteDeck(selectedDeckId);
      setSelectedDeckId(null);
      setDeckCards([]);
      setDeckName("New Deck");
      setIsEditing(true);
    }
  };

  // Calculate mana curve
  const manaCurve = Array.from({ length: 11 }, (_, i) => {
    return deckCards.filter(cardId => {
      const card = getCardById(cardId);
      return card && card.manaCost === i;
    }).length;
  });

  const avgManaCost = deckCards.length > 0 ? 
    deckCards.reduce((sum, cardId) => {
      const card = getCardById(cardId);
      return sum + (card?.manaCost || 0);
    }, 0) / deckCards.length : 0;

  if (!player) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Deck Builder</h1>
            <p className="text-gray-300">Create and customize your battle deck</p>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedDeckId || ""} onValueChange={loadDeck}>
              <SelectTrigger className="w-48 bg-black/60 border-white/20 text-white">
                <SelectValue placeholder="Select a deck" />
              </SelectTrigger>
              <SelectContent>
                {decks.map(deck => (
                  <SelectItem key={deck.id} value={deck.id}>
                    {deck.name} ({deck.cardIds.length} cards)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Deck Area */}
          <div className="lg:col-span-1">
            <Card className="bg-black/60 backdrop-blur-sm border-white/20 mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={deckName}
                        onChange={(e) => setDeckName(e.target.value)}
                        className="text-lg font-bold bg-transparent border-none text-white p-0 h-auto"
                        placeholder="Deck Name"
                      />
                    ) : (
                      <CardTitle className="text-white">{deckName}</CardTitle>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    {selectedDeckId && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={duplicateDeck}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={deleteDeckHandler}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <Badge 
                    variant={deckCards.length >= MIN_DECK_SIZE ? "default" : "destructive"}
                    className="text-white"
                  >
                    {deckCards.length}/{MAX_DECK_SIZE}
                  </Badge>
                  
                  {deckCards.length < MIN_DECK_SIZE && (
                    <span className="text-red-400">
                      Need {MIN_DECK_SIZE - deckCards.length} more cards
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Deck Cards */}
                <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                  {Array.from(new Set(deckCards)).map(cardId => {
                    const card = getCardById(cardId);
                    const count = getCardCountInDeck(cardId);
                    
                    if (!card) return null;
                    
                    return (
                      <div key={cardId} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <CardComponent
                          card={card}
                          size="small"
                          showCount={count}
                        />
                        
                        <div className="flex-1">
                          <div className="text-white font-semibold text-sm">{card.name}</div>
                          <div className="text-xs text-gray-400">
                            {card.manaCost} mana • {card.type}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addCardToDeck(cardId)}
                            disabled={!canAddCard(cardId)}
                            className="w-6 h-6 p-0 border-green-500/30 text-green-400 hover:bg-green-500/10"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCardFromDeck(cardId)}
                            className="w-6 h-6 p-0 border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {deckCards.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      <p>Your deck is empty</p>
                      <p className="text-sm">Add cards from your collection</p>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <Button
                  onClick={saveDeck}
                  disabled={deckCards.length < MIN_DECK_SIZE}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Deck
                </Button>
              </CardContent>
            </Card>

            {/* Deck Stats */}
            <Card className="bg-black/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Deck Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Mana:</span>
                    <span className="text-white">{avgManaCost.toFixed(1)}</span>
                  </div>

                  {/* Mana Curve */}
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      Mana Curve
                    </h4>
                    <div className="space-y-1">
                      {manaCurve.map((count, cost) => (
                        <div key={cost} className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400 w-8">{cost}:</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${(count / Math.max(...manaCurve, 1)) * 100}%` }}
                            />
                          </div>
                          <span className="text-white w-6 text-right">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Type Distribution */}
                  <div>
                    <h4 className="text-white font-semibold mb-2">Card Types</h4>
                    {["creature", "spell", "support"].map(type => {
                      const count = deckCards.filter(cardId => {
                        const card = getCardById(cardId);
                        return card?.type === type;
                      }).length;

                      return (
                        <div key={type} className="flex justify-between text-sm">
                          <span className="text-gray-400 capitalize">{type}:</span>
                          <span className="text-white">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card Collection */}
          <div className="lg:col-span-2">
            <Card className="bg-black/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Your Collection</CardTitle>
                
                {/* Filters */}
                <div className="flex gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search cards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

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
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {availableCards.map(card => {
                    const inDeck = getCardCountInDeck(card.id);
                    const owned = player.cardCounts[card.id] || 0;
                    const canAdd = canAddCard(card.id);

                    return (
                      <div key={card.id} className="relative">
                        <CardComponent
                          card={card}
                          size="small"
                          onClick={() => canAdd ? addCardToDeck(card.id) : undefined}
                          className={`${!canAdd ? "opacity-50" : "cursor-pointer hover:scale-105"}`}
                        />
                        
                        {inDeck > 0 && (
                          <div className="absolute -top-1 -right-1 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {inDeck}
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-1 text-center">
                          {owned} owned
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {availableCards.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <p>No cards found matching your filters.</p>
                    <p className="text-sm mt-2">Try adjusting your search or visit the store to get more cards!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Navigation currentScreen="deck-builder" onNavigate={onNavigate} />
    </div>
  );
}
