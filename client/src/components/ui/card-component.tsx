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

const rarityBorders = {
  common: "border-amber-400/80",
  rare: "border-amber-500",
  epic: "border-amber-600", 
  legendary: "border-yellow-500"
};

const rarityGlow = {
  common: "shadow-amber-300/50",
  rare: "shadow-amber-400/60",
  epic: "shadow-amber-500/70",
  legendary: "shadow-yellow-400/80"
};

const rarityAccents = {
  common: "bg-gradient-to-br from-amber-400/20 to-amber-600/20",
  rare: "bg-gradient-to-br from-blue-500/20 to-blue-700/20",
  epic: "bg-gradient-to-br from-purple-500/20 to-purple-700/20",
  legendary: "bg-gradient-to-br from-yellow-400/20 to-yellow-600/20"
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
    small: "w-20 h-28",
    medium: "w-32 h-44", 
    large: "w-40 h-56"
  };

  const textSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base"
  };

  const manaSizes = {
    small: "w-5 h-5 text-xs",
    medium: "w-7 h-7 text-sm",
    large: "w-8 h-8 text-base"
  };

  const statSizes = {
    small: "w-4 h-4 text-xs",
    medium: "w-6 h-6 text-sm", 
    large: "w-7 h-7 text-base"
  };

  return (
    <div
      className={cn(
        "relative cursor-pointer transition-all duration-300 group",
        sizeClasses[size],
        !isPlayable && "opacity-60 cursor-not-allowed",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
      onClick={!disabled ? onClick : undefined}
      onDoubleClick={!disabled ? onDoubleClick : undefined}
    >
      {/* Ornate Golden Border Frame */}
      <div className={cn(
        "absolute inset-0 rounded-lg border-4 border-double transition-all duration-300",
        rarityBorders[card.rarity],
        isSelected && "shadow-2xl scale-105",
        !disabled && "group-hover:shadow-xl group-hover:scale-105",
        rarityGlow[card.rarity]
      )}>
        {/* Inner ornate decoration */}
        <div className="absolute inset-1 rounded-md border border-amber-300/30"></div>
        
        {/* Corner decorations */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-amber-400 rounded-tl-lg"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-amber-400 rounded-tr-lg"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-amber-400 rounded-bl-lg"></div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-amber-400 rounded-br-lg"></div>
      </div>

      {/* Card Background with Artwork */}
      <div className="absolute inset-2 rounded-md overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black">
        {/* Artwork Area */}
        <div className="relative h-3/5 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className={cn("text-white font-bold tracking-wider", textSizes[size])}>
            {card.name.split(' ').map(word => word[0]).join('')}
          </div>
          
          {/* Rarity accent overlay */}
          <div className={cn("absolute inset-0", rarityAccents[card.rarity])}></div>
        </div>

        {/* Card Name Banner */}
        <div className="relative h-2/5 bg-gradient-to-br from-slate-900 to-black border-t border-amber-400/30">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
          
          <div className="h-full flex flex-col justify-center items-center px-2 py-1">
            <div className={cn(
              "font-bold text-white text-center truncate w-full leading-tight",
              textSizes[size]
            )}>
              {card.name}
            </div>
            
            {size !== "small" && card.description && (
              <div className="text-xs text-gray-300 text-center mt-1 line-clamp-2 leading-tight">
                {card.description}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mana Cost */}
      <div className={cn(
        "absolute -top-2 -left-2 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold border-2 border-amber-300 z-20 shadow-lg",
        manaSizes[size]
      )}>
        {card.manaCost}
      </div>

      {/* Attack/Health Stats for Creatures */}
      {card.type === "creature" && card.attack !== undefined && card.health !== undefined && size !== "small" && (
        <>
          {/* Attack */}
          <div className={cn(
            "absolute -bottom-2 -left-2 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-full flex items-center justify-center font-bold border-2 border-amber-300 z-20 shadow-lg",
            statSizes[size]
          )}>
            {card.attack}
          </div>
          
          {/* Health */}
          <div className={cn(
            "absolute -bottom-2 -right-2 bg-gradient-to-br from-green-600 to-green-800 text-white rounded-full flex items-center justify-center font-bold border-2 border-amber-300 z-20 shadow-lg",
            statSizes[size]
          )}>
            {card.health}
          </div>
        </>
      )}

      {/* Spell Type Indicator */}
      {card.type === "spell" && size !== "small" && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-purple-600 to-purple-800 text-white px-2 py-1 rounded-full text-xs font-bold border border-amber-300 z-20 shadow-lg">
          SPELL
        </div>
      )}

      {/* Card Count */}
      {showCount && showCount > 1 && (
        <div className={cn(
          "absolute -top-2 -right-2 bg-gradient-to-br from-gray-700 to-gray-900 text-yellow-400 rounded-full flex items-center justify-center font-bold border-2 border-amber-300 z-20 shadow-lg",
          manaSizes[size]
        )}>
          {showCount}
        </div>
      )}

      {/* Disabled Overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center z-30">
          <span className="text-white text-xs font-bold">DISABLED</span>
        </div>
      )}
    </div>
  );
}
