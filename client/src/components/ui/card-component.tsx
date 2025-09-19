import { Card } from "../../types/game";
import { cn } from "../../lib/utils";

interface CardComponentProps {
  card: Card;
  className?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  isSelected?: boolean;
  isPlayable?: boolean;
  showCount?: number;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

const rarityColors = {
  common: "border-gray-400 bg-gray-100",
  rare: "border-blue-400 bg-blue-100",
  epic: "border-purple-400 bg-purple-100",
  legendary: "border-yellow-400 bg-yellow-100"
};

const rarityGlow = {
  common: "shadow-gray-300",
  rare: "shadow-blue-400",
  epic: "shadow-purple-400",
  legendary: "shadow-yellow-400"
};

export function CardComponent({
  card,
  className,
  onClick,
  onDoubleClick,
  isSelected = false,
  isPlayable = true,
  showCount,
  size = "medium",
  disabled = false
}: CardComponentProps) {
  const sizeClasses = {
    small: "w-16 h-24",
    medium: "w-24 h-36",
    large: "w-32 h-48"
  };

  const textSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base"
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 cursor-pointer transition-all duration-200",
        sizeClasses[size],
        rarityColors[card.rarity],
        isSelected && "card-selected",
        !isSelected && !disabled && "card-hover",
        !isPlayable && "opacity-60 cursor-not-allowed",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
      onClick={!disabled ? onClick : undefined}
      onDoubleClick={!disabled ? onDoubleClick : undefined}
    >
      {/* Card Image Background */}
      <div className="absolute inset-0 rounded-lg overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
        <div className="w-full h-full flex items-center justify-center text-white font-bold">
          {card.name.split(' ').map(word => word[0]).join('')}
        </div>
      </div>

      {/* Mana Cost */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white z-10">
        {card.manaCost}
      </div>

      {/* Card Count */}
      {showCount && showCount > 1 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white z-10">
          {showCount}
        </div>
      )}

      {/* Card Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-1 rounded-b-lg">
        <div className={cn("font-bold truncate", textSizes[size])}>
          {card.name}
        </div>
        
        {size !== "small" && (
          <div className="flex justify-between items-center">
            {card.type === "creature" && (
              <>
                <span className="text-xs bg-red-600 px-1 rounded">{card.attack}</span>
                <span className="text-xs bg-green-600 px-1 rounded">{card.health}</span>
              </>
            )}
            {card.type === "spell" && (
              <span className="text-xs bg-purple-600 px-1 rounded">Spell</span>
            )}
          </div>
        )}
      </div>

      {/* Rarity Glow Effect */}
      {isSelected && (
        <div className={cn(
          "absolute inset-0 rounded-lg pointer-events-none",
          "shadow-lg",
          rarityGlow[card.rarity]
        )} />
      )}

      {/* Disabled Overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">Disabled</span>
        </div>
      )}
    </div>
  );
}
