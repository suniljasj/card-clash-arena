import { useEffect, useState } from "react";
import { useBattle } from "../lib/stores/useBattle";
import { usePlayer } from "../lib/stores/usePlayer";
import { useAudio } from "../lib/stores/useAudio";
import { PlayerHUD } from "../components/game/PlayerHUD";
import { CardHand } from "../components/game/CardHand";
import { BattleField } from "../components/game/BattleField";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { GameScreen } from "../App";
import type { Card as GameCard, BattleCard } from "@/types/game";
import { MessageSquare, Volume2, VolumeX } from "lucide-react";

interface BattleArenaScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

export default function BattleArenaScreen({ onNavigate }: BattleArenaScreenProps) {
  const { 
    player: battlePlayer, 
    opponent, 
    currentTurn, 
    turnTimer,
    gamePhase,
    winner,
    selectedCard,
    battleLog,
    playCard,
    attackWithCard,
    selectCard,
    endTurn,
    resetBattle
  } = useBattle();

  const { player: gamePlayer, addExperience, addGold, updatePlayer } = usePlayer();
  const { playHit, playSuccess, isMuted, toggleMute } = useAudio();
  const [showBattleLog, setShowBattleLog] = useState(false);

  // Handle battle end
  useEffect(() => {
    if (gamePhase === "ended" && winner) {
      // Play victory/defeat sound
      if (winner === "player") {
        playSuccess();
      } else {
        playHit();
      }

      // Update player stats and rewards
      setTimeout(() => {
        if (gamePlayer) {
          const isVictory = winner === "player";
          const experienceGained = isVictory ? 100 : 50;
          const goldGained = isVictory ? 75 : 25;

          addExperience(experienceGained);
          addGold(goldGained);
          
          updatePlayer({
            wins: gamePlayer.wins + (isVictory ? 1 : 0),
            losses: gamePlayer.losses + (isVictory ? 0 : 1),
            totalGames: gamePlayer.totalGames + 1
          });

          // Navigate to victory/defeat screen
          onNavigate(isVictory ? "victory" : "defeat");
        }
      }, 2000);
    }
  }, [gamePhase, winner]);

  // AI opponent logic
  useEffect(() => {
    if (currentTurn === "opponent" && gamePhase === "playing" && opponent) {
      const timer = setTimeout(() => {
        // Simple AI: play random card or end turn
        if (opponent.hand.length > 0 && Math.random() > 0.3) {
          const playableCards = opponent.hand.filter(card => card.manaCost <= opponent.mana);
          if (playableCards.length > 0) {
            const randomCard = playableCards[Math.floor(Math.random() * playableCards.length)];
            playCard(randomCard);
            playHit();
          }
        }
        
        // Sometimes attack with creatures
        const attackingCreatures = opponent.field.filter(card => card.canAttack && !card.hasAttackedThisTurn);
        if (attackingCreatures.length > 0 && Math.random() > 0.5) {
          const attacker = attackingCreatures[0];
          // Attack player directly or random player creature
          if (battlePlayer && battlePlayer.field.length > 0 && Math.random() > 0.6) {
            const target = battlePlayer.field[Math.floor(Math.random() * battlePlayer.field.length)];
            attackWithCard(attacker, target);
          } else {
            attackWithCard(attacker);
          }
          playHit();
        }

        // End turn after 2-4 seconds
        setTimeout(endTurn, 2000 + Math.random() * 2000);
      }, 1000 + Math.random() * 2000);

      return () => clearTimeout(timer);
    }
  }, [currentTurn, gamePhase, opponent, battlePlayer]);

  const handleCardPlay = (card: any) => {
    if (playCard(card)) {
      playHit();
      selectCard(null);
    }
  };

  const handleCardAttack = (attacker: any, target?: any) => {
    attackWithCard(attacker, target);
    playHit();
    selectCard(null);
  };

  const handleEndTurn = () => {
    endTurn();
    selectCard(null);
  };

  const handleQuitBattle = () => {
    resetBattle();
    onNavigate("dashboard");
  };

  if (!battlePlayer || !opponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Battle not initialized</h2>
          <Button onClick={() => onNavigate("dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex flex-col">
      {/* Battle End Overlay */}
      {gamePhase === "ended" && winner && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className={`w-full max-w-md mx-4 ${
            winner === "player" 
              ? "bg-gradient-to-br from-green-600 to-emerald-700" 
              : "bg-gradient-to-br from-red-600 to-rose-700"
          }`}>
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                {winner === "player" ? "Victory!" : "Defeat!"}
              </h2>
              <p className="text-white/90 mb-6">
                {winner === "player" 
                  ? "Congratulations! You have emerged victorious!" 
                  : "Better luck next time. Learn from this battle!"
                }
              </p>
              <div className="text-sm text-white/70">
                Calculating rewards...
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMute}
          className="bg-black/50 border-white/20 text-white hover:bg-white/20"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBattleLog(!showBattleLog)}
          className="bg-black/50 border-white/20 text-white hover:bg-white/20"
        >
          <MessageSquare className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleQuitBattle}
          className="bg-red-600/50 border-red-400/20 text-white hover:bg-red-600/70"
        >
          Forfeit
        </Button>
      </div>

      {/* Battle Log */}
      {showBattleLog && (
        <Card className="absolute top-16 right-4 w-80 max-h-60 bg-black/90 backdrop-blur-sm border-white/20 z-40">
          <CardContent className="p-4">
            <h3 className="text-white font-bold mb-2">Battle Log</h3>
            <ScrollArea className="h-40">
              <div className="space-y-1">
                {battleLog.map((message, index) => (
                  <div key={index} className="text-xs text-gray-300">
                    {message}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Player HUD */}
      <PlayerHUD
        player={battlePlayer}
        opponent={opponent}
        currentTurn={currentTurn}
        turnTimer={turnTimer}
        onEndTurn={handleEndTurn}
        isPlayerTurn={currentTurn === "player" && gamePhase === "playing"}
        className="flex-shrink-0"
      />

      {/* Battle Field */}
      <BattleField
        playerField={battlePlayer.field}
        opponentField={opponent.field}
        selectedCard={selectedCard}
        onCardSelect={selectCard}
        onCardAttack={handleCardAttack}
        isPlayerTurn={currentTurn === "player" && gamePhase === "playing"}
        className="flex-1 min-h-0"
      />

      {/* Player Hand */}
      <CardHand
        cards={battlePlayer.hand as GameCard[]}
        selectedCard={selectedCard as GameCard | null}
        onCardSelect={(card: GameCard | null) => selectCard(card as BattleCard | null)}
        onCardPlay={handleCardPlay}
        playerMana={battlePlayer.mana}
        isPlayerTurn={currentTurn === "player" && gamePhase === "playing"}
        className="flex-shrink-0"
      />
    </div>
  );
}
