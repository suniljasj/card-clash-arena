import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Navigation } from "../components/game/Navigation";
import { usePlayer } from "../lib/stores/usePlayer";
import { useStore } from "../lib/stores/useStore";
import { GameScreen } from "../App";
import { 
  ShoppingCart, 
  Coins, 
  Gem, 
  Gift, 
  Star,
  Package,
  Sparkles,
  Clock,
  Percent
} from "lucide-react";

interface StoreScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

export default function StoreScreen({ onNavigate }: StoreScreenProps) {
  const { player, spendGold, spendGems, addCard } = usePlayer();
  const { items, dailyDeals, refreshDailyDeals, openCardPack } = useStore();
  const [purchaseModal, setPurchaseModal] = useState<any>(null);
  const [packOpenModal, setPackOpenModal] = useState<string[] | null>(null);

  useEffect(() => {
    // Initialize daily deals if empty
    if (dailyDeals.length === 0) {
      refreshDailyDeals();
    }
  }, [dailyDeals.length, refreshDailyDeals]);

  const handlePurchase = (item: any) => {
    if (item.type === "pack") {
      setPurchaseModal(item);
    } else {
      // Direct purchase for currency/cosmetics
      if (item.currency === "gold") {
        if (spendGold(item.price)) {
          // Handle currency purchase or cosmetic unlock
          if (item.id.includes("gold")) {
            const goldAmount = parseInt(item.description.match(/\d+/)?.[0] || "0");
            // This would normally add gold, but we just spent it to buy gold (gems -> gold conversion)
          }
        }
      } else {
        if (spendGems(item.price)) {
          // Handle currency purchase
          if (item.id.includes("gold")) {
            const goldAmount = parseInt(item.description.match(/\d+/)?.[0] || "0");
            // Add gold from gem purchase
          }
        }
      }
    }
  };

  const confirmPurchase = (item: any) => {
    let success = false;
    
    if (item.currency === "gold") {
      success = spendGold(item.price);
    } else {
      success = spendGems(item.price);
    }

    if (success) {
      // Open pack
      const cards = openCardPack(item.id);
      
      // Add cards to player collection
      cards.forEach(cardId => {
        addCard(cardId);
      });

      setPackOpenModal(cards);
    }
    
    setPurchaseModal(null);
  };

  const canAfford = (item: any) => {
    if (!player) return false;
    if (item.currency === "gold") {
      return player.gold >= item.price;
    } else {
      return player.gems >= item.price;
    }
  };

  if (!player) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Card Store</h1>
            <p className="text-gray-300">Expand your collection with new cards and packs</p>
          </div>
          
          {/* Currency Display */}
          <div className="flex items-center gap-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
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

        {/* Daily Deals */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                Daily Deals
              </CardTitle>
              <Badge className="bg-orange-600 text-white animate-pulse">
                Limited Time!
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {dailyDeals.map(deal => (
                <div key={deal.id} className="relative bg-gradient-to-br from-orange-600/20 to-red-600/20 p-4 rounded-lg border border-orange-500/30">
                  {deal.discount && (
                    <div className="absolute -top-2 -right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      {deal.discount}% OFF
                    </div>
                  )}

                  <div className="text-center space-y-3">
                    <Package className="w-12 h-12 mx-auto text-orange-400" />
                    <div>
                      <h3 className="text-white font-bold">{deal.name}</h3>
                      <p className="text-sm text-gray-300">{deal.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2">
                      {deal.currency === "gold" ? (
                        <Coins className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <Gem className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="text-white font-bold">
                        {Math.round(deal.price * (1 - (deal.discount || 0) / 100))}
                      </span>
                      {deal.discount && (
                        <span className="text-gray-400 line-through text-sm">
                          {deal.price}
                        </span>
                      )}
                    </div>

                    <Button
                      onClick={() => handlePurchase(deal)}
                      disabled={!canAfford({...deal, price: Math.round(deal.price * (1 - (deal.discount || 0) / 100))})}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card Packs */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              Card Packs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {items.filter(item => item.type === "pack").map(pack => (
                <div key={pack.id} className="bg-white/5 p-6 rounded-lg border border-white/10 text-center space-y-4">
                  <div className="text-4xl">📦</div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{pack.name}</h3>
                    <p className="text-gray-300 text-sm mt-1">{pack.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      {pack.currency === "gold" ? (
                        <Coins className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <Gem className="w-5 h-5 text-blue-400" />
                      )}
                      <span className="text-white font-bold text-xl">{pack.price}</span>
                    </div>

                    {pack.rarity && (
                      <Badge className={`
                        ${pack.rarity === "basic" && "bg-gray-600"}
                        ${pack.rarity === "premium" && "bg-blue-600"}
                        ${pack.rarity === "legendary" && "bg-yellow-600"}
                      `}>
                        {pack.rarity} guaranteed
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => handlePurchase(pack)}
                    disabled={!canAfford(pack)}
                    className={`w-full ${
                      pack.id === "legendary_pack" 
                        ? "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700" 
                        : pack.id === "premium_pack"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : "bg-gray-600 hover:bg-gray-700"
                    } text-white`}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {canAfford(pack) ? "Buy Pack" : "Not enough currency"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Currency Packs */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-400" />
              Currency Packs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {items.filter(item => item.type === "currency").map(currency => (
                <div key={currency.id} className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-6 rounded-lg border border-green-500/30 text-center space-y-4">
                  <div className="text-4xl">
                    {currency.id.includes("gold") ? "💰" : "💎"}
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold text-lg">{currency.name}</h3>
                    <p className="text-gray-300">{currency.description}</p>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Gem className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-bold text-xl">{currency.price}</span>
                  </div>

                  <Button
                    onClick={() => handlePurchase(currency)}
                    disabled={!canAfford(currency)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {canAfford(currency) ? "Purchase" : "Not enough gems"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Confirmation Modal */}
      {purchaseModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-black/90 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Confirm Purchase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-white font-bold text-lg">{purchaseModal.name}</h3>
                <p className="text-gray-300 text-sm">{purchaseModal.description}</p>
              </div>

              <div className="bg-white/10 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Price:</span>
                  <div className="flex items-center gap-2">
                    {purchaseModal.currency === "gold" ? (
                      <Coins className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Gem className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-white font-bold">{purchaseModal.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPurchaseModal(null)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => confirmPurchase(purchaseModal)}
                  disabled={!canAfford(purchaseModal)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pack Opening Modal */}
      {packOpenModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-black/90 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-center text-white flex items-center justify-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                Pack Opened!
                <Star className="w-6 h-6 text-yellow-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-300">You received the following cards:</p>
              </div>

              <div className="grid grid-cols-5 gap-4">
                {packOpenModal.map((cardId, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div className="w-16 h-24 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                      {cardId.split('_')[0].toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {cardId.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setPackOpenModal(null)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Awesome!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Navigation currentScreen="store" onNavigate={onNavigate} />
    </div>
  );
}
