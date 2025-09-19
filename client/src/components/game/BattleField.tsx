import { CardComponent } from "../ui/card-component";
import { Card } from "../../types/game";
import { cn } from "../../lib/utils";

interface BattleFieldCard extends Card {
  instanceId: string;
  currentHealth: number;
  currentAttack: number;
  canAttack: boolean;
  hasAttackedThisTurn: boolean;
}

interface BattleFieldProps {
  playerField: BattleFieldCard[];
  opponentField: BattleFieldCard[];
  selectedCard: BattleFieldCard | null;
  onCardSelect: (card: BattleFieldCard | null) => void;
  onCardAttack: (attacker: BattleFieldCard, target?: BattleFieldCard) => void;
  isPlayerTurn: boolean;
  className?: string;
}

export function BattleField({
  playerField,
  opponentField,
  selectedCard,
  onCardSelect,
  onCardAttack,
  isPlayerTurn,
  className
}: BattleFieldProps) {
  const handleCardClick = (card: BattleFieldCard, isPlayerCard: boolean) => {
    if (!isPlayerTurn) return;

    if (isPlayerCard && card.canAttack && !card.hasAttackedThisTurn) {
      // Select attacking card
      onCardSelect(card);
    } else if (!isPlayerCard && selectedCard && selectedCard.canAttack) {
      // Attack opponent card
      onCardAttack(selectedCard, card);
      onCardSelect(null);
    }
  };

  const handleDirectAttack = () => {
    if (selectedCard && selectedCard.canAttack && opponentField.length === 0) {
      onCardAttack(selectedCard);
      onCardSelect(null);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Opponent Field */}
      <div className="flex-1 bg-red-900/20 border-b-2 border-red-500/50 p-4">
        <div className="text-center text-red-300 mb-2 text-sm font-bold">
          Opponent's Field
        </div>
        
        <div className="flex justify-center items-center gap-2 h-full min-h-[120px]">
          {opponentField.length > 0 ? (
            opponentField.map((card) => (
              <div
                key={card.instanceId}
                className={cn(
                  "relative transition-all duration-300",
                  selectedCard && selectedCard.canAttack && "cursor-pointer hover:scale-105"
                )}
                onClick={() => handleCardClick(card, false)}
              >
                <CardComponent
                  card={card}
                  size="medium"
                  className="border-red-400"
                />
                
                {/* Health/Attack Overlay */}
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  <div className="bg-red-600 text-white text-xs px-1 py-0.5 rounded">
                    {card.currentAttack}
                  </div>
                  <div className="bg-green-600 text-white text-xs px-1 py-0.5 rounded">
                    {card.currentHealth}
                  </div>
                </div>

                {/* Damage Animation */}
                {card.currentHealth < (card.health || 0) && (
                  <div className="absolute inset-0 bg-red-500/30 rounded-lg animate-pulse" />
                )}
              </div>
            ))
          ) : (
            <div 
              className={cn(
                "text-gray-400 text-center cursor-pointer border-2 border-dashed border-gray-600 rounded-lg p-8 w-full max-w-md",
                selectedCard && selectedCard.canAttack && "border-yellow-500 hover:bg-yellow-500/10"
              )}
              onClick={handleDirectAttack}
            >
              {selectedCard && selectedCard.canAttack 
                ? "Click to attack opponent directly!" 
                : "No creatures on field"
              }
            </div>
          )}
        </div>
      </div>

      {/* Player Field */}
      <div className="flex-1 bg-blue-900/20 border-t-2 border-blue-500/50 p-4">
        <div className="flex justify-center items-center gap-2 h-full min-h-[120px]">
          {playerField.length > 0 ? (
            playerField.map((card) => {
              const isSelected = selectedCard?.instanceId === card.instanceId;
              const canSelect = isPlayerTurn && card.canAttack && !card.hasAttackedThisTurn;

              return (
                <div
                  key={card.instanceId}
                  className={cn(
                    "relative transition-all duration-300",
                    canSelect && "cursor-pointer hover:scale-105",
                    isSelected && "scale-110 z-10"
                  )}
                  onClick={() => handleCardClick(card, true)}
                >
                  <CardComponent
                    card={card}
                    size="medium"
                    isSelected={isSelected}
                    className={cn(
                      "border-blue-400",
                      canSelect && "hover:border-yellow-400",
                      card.hasAttackedThisTurn && "opacity-60"
                    )}
                  />
                  
                  {/* Health/Attack Overlay */}
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <div className="bg-red-600 text-white text-xs px-1 py-0.5 rounded">
                      {card.currentAttack}
                    </div>
                    <div className="bg-green-600 text-white text-xs px-1 py-0.5 rounded">
                      {card.currentHealth}
                    </div>
                  </div>

                  {/* Status Indicators */}
                  {!card.canAttack && !card.hasAttackedThisTurn && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                      Summoning Sickness
                    </div>
                  )}

                  {card.hasAttackedThisTurn && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-xs px-2 py-1 rounded">
                      Attacked
                    </div>
                  )}

                  {/* Damage Animation */}
                  {card.currentHealth < (card.health || 0) && (
                    <div className="absolute inset-0 bg-red-500/30 rounded-lg animate-pulse" />
                  )}

                  {/* Attack Ready Glow */}
                  {canSelect && (
                    <div className="absolute inset-0 rounded-lg shadow-lg shadow-yellow-400/50 animate-pulse" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-gray-400 text-center border-2 border-dashed border-gray-600 rounded-lg p-8 w-full max-w-md">
              No creatures on field
            </div>
          )}
        </div>

        <div className="text-center text-blue-300 mt-2 text-sm font-bold">
          Your Field
        </div>
      </div>

      {/* Attack Instructions */}
      {selectedCard && selectedCard.canAttack && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white p-4 rounded-lg border border-yellow-500 z-20">
          <div className="text-center">
            <div className="font-bold text-yellow-400 mb-2">
              {selectedCard.name} is ready to attack!
            </div>
            <div className="text-sm text-gray-300">
              Click an enemy creature to attack it,<br />
              or click the empty area to attack directly.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
