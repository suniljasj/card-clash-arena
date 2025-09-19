import { useState } from "react";
import { CardComponent } from "../ui/card-component";
import { Button } from "../ui/button";
import { Card } from "../../types/game";
import { cn } from "../../lib/utils";

interface CardHandProps {
  cards: Card[];
  selectedCard: Card | null;
  onCardSelect: (card: Card | null) => void;
  onCardPlay: (card: Card) => void;
  playerMana: number;
  isPlayerTurn: boolean;
  className?: string;
}

export function CardHand({
  cards,
  selectedCard,
  onCardSelect,
  onCardPlay,
  playerMana,
  isPlayerTurn,
  className
}: CardHandProps) {
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);

  const isCardPlayable = (card: Card) => {
    return isPlayerTurn && playerMana >= card.manaCost;
  };

  return (
    <div className={cn("relative", className)}>
      {/* Card Details Popup */}
      {hoveredCard && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-50">
          <div className="bg-black/90 text-white p-4 rounded-lg border border-white/20 max-w-xs">
            <h3 className="font-bold text-lg mb-2">{hoveredCard.name}</h3>
            <p className="text-sm text-gray-300 mb-2">{hoveredCard.description}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-blue-600 px-2 py-1 rounded">
                {hoveredCard.manaCost} Mana
              </span>
              
              {hoveredCard.type === "creature" && (
                <>
                  <span className="bg-red-600 px-2 py-1 rounded">
                    {hoveredCard.attack} Attack
                  </span>
                  <span className="bg-green-600 px-2 py-1 rounded">
                    {hoveredCard.health} Health
                  </span>
                </>
              )}
              
              <span className={cn(
                "px-2 py-1 rounded capitalize",
                hoveredCard.rarity === "common" && "bg-gray-600",
                hoveredCard.rarity === "rare" && "bg-blue-600",
                hoveredCard.rarity === "epic" && "bg-purple-600",
                hoveredCard.rarity === "legendary" && "bg-yellow-600"
              )}>
                {hoveredCard.rarity}
              </span>
            </div>

            {hoveredCard.keywords && hoveredCard.keywords.length > 0 && (
              <div className="mt-2">
                <span className="text-xs text-gray-400">Keywords: </span>
                <span className="text-xs text-blue-300">
                  {hoveredCard.keywords.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hand Cards */}
      <div className="flex justify-center items-end gap-2 p-4 bg-black/60 backdrop-blur-sm rounded-t-lg border-t border-white/20">
        {cards.map((card, index) => {
          const isSelected = selectedCard?.id === card.id;
          const isPlayable = isCardPlayable(card);

          return (
            <div
              key={`${card.id}-${index}`}
              className={cn(
                "transform transition-all duration-200",
                isSelected && "scale-110 -translate-y-4",
                !isSelected && hoveredCard?.id === card.id && "scale-105 -translate-y-2"
              )}
              onMouseEnter={() => setHoveredCard(card)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardComponent
                card={card}
                isSelected={isSelected}
                isPlayable={isPlayable}
                disabled={!isPlayerTurn}
                onClick={() => {
                  if (isSelected) {
                    onCardSelect(null);
                  } else if (isPlayable) {
                    onCardSelect(card);
                  }
                }}
                onDoubleClick={() => {
                  if (isPlayable) {
                    onCardPlay(card);
                  }
                }}
                size="medium"
              />
            </div>
          );
        })}

        {cards.length === 0 && (
          <div className="text-gray-400 text-center py-8">
            No cards in hand
          </div>
        )}
      </div>

      {/* Play Card Button */}
      {selectedCard && isCardPlayable(selectedCard) && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={() => onCardPlay(selectedCard)}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            Play {selectedCard.name}
          </Button>
        </div>
      )}

      {/* Turn Indicator */}
      <div className="absolute -top-8 right-4">
        <div className={cn(
          "px-3 py-1 rounded-full text-sm font-bold",
          isPlayerTurn 
            ? "bg-green-600 text-white" 
            : "bg-red-600 text-white"
        )}>
          {isPlayerTurn ? "Your Turn" : "Opponent's Turn"}
        </div>
      </div>
    </div>
  );
}
