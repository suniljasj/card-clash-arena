import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Crown, Heart, Zap, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

interface PlayerData {
  id: string;
  username: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  avatar?: string;
}

interface PlayerHUDProps {
  player: PlayerData;
  opponent: PlayerData;
  currentTurn: "player" | "opponent";
  turnTimer: number;
  onEndTurn: () => void;
  isPlayerTurn: boolean;
  className?: string;
}

export function PlayerHUD({
  player,
  opponent,
  currentTurn,
  turnTimer,
  onEndTurn,
  isPlayerTurn,
  className
}: PlayerHUDProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderManaOrbs = (current: number, max: number) => {
    const orbs = [];
    for (let i = 0; i < Math.max(current, max); i++) {
      orbs.push(
        <div
          key={i}
          className={cn(
            "w-6 h-6 rounded-full border-2 transition-all duration-300 mana-crystal",
            i < current 
              ? "filled" 
              : "empty"
          )}
        />
      );
    }
    return orbs;
  };

  return (
    <div className={cn("flex justify-between items-start p-4", className)}>
      {/* Opponent Info */}
      <div className="flex items-center gap-4 bg-black/60 p-4 rounded-lg backdrop-blur-sm border border-red-500/30">
        <Avatar className="w-12 h-12 border-2 border-red-500">
          <AvatarFallback className="bg-red-600 text-white">
            {opponent.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2 min-w-[150px]">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{opponent.username}</span>
            {currentTurn === "opponent" && (
              <Crown className="w-4 h-4 text-yellow-400" />
            )}
          </div>

          {/* Opponent Health */}
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" />
            <Progress 
              value={(opponent.health / opponent.maxHealth) * 100} 
              className="flex-1 h-2"
            />
            <span className="text-sm text-white font-mono">
              {opponent.health}/{opponent.maxHealth}
            </span>
          </div>

          {/* Opponent Mana */}
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <div className="flex gap-1">
              {renderManaOrbs(opponent.mana, opponent.maxMana)}
            </div>
          </div>
        </div>
      </div>

      {/* Turn Timer & Controls */}
      <div className="flex flex-col items-center gap-4">
        {/* Timer */}
        <div className="bg-black/80 p-4 rounded-lg border border-white/20 text-center">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Turn Timer</span>
          </div>
          
          <div className={cn(
            "text-2xl font-mono font-bold",
            turnTimer <= 10 ? "text-red-400 animate-pulse" : "text-white"
          )}>
            {formatTime(turnTimer)}
          </div>

          <div className="text-xs text-gray-400 mt-1">
            {currentTurn === "player" ? "Your Turn" : "Opponent's Turn"}
          </div>
        </div>

        {/* End Turn Button */}
        {isPlayerTurn && (
          <Button
            onClick={onEndTurn}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3"
            size="lg"
          >
            End Turn
          </Button>
        )}
      </div>

      {/* Player Info */}
      <div className="flex items-center gap-4 bg-black/60 p-4 rounded-lg backdrop-blur-sm border border-blue-500/30">
        <div className="space-y-2 min-w-[150px] text-right">
          <div className="flex items-center justify-end gap-2">
            {currentTurn === "player" && (
              <Crown className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-white font-bold">{player.username}</span>
          </div>

          {/* Player Health */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-white font-mono">
              {player.health}/{player.maxHealth}
            </span>
            <Progress 
              value={(player.health / player.maxHealth) * 100} 
              className="flex-1 h-2"
            />
            <Heart className="w-4 h-4 text-red-400" />
          </div>

          {/* Player Mana */}
          <div className="flex items-center justify-end gap-2">
            <div className="flex gap-1">
              {renderManaOrbs(player.mana, player.maxMana)}
            </div>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
        </div>

        <Avatar className="w-12 h-12 border-2 border-blue-500">
          <AvatarFallback className="bg-blue-600 text-white">
            {player.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
