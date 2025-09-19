import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Card, BattleCard } from "@/types/game";

interface Player {
  id: string;
  username: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  deck: Card[];
  hand: BattleCard[];
  field: BattleCard[];
  graveyard: BattleCard[];
}

interface BattleState {
  player: Player | null;
  opponent: Player | null;
  currentTurn: "player" | "opponent";
  turnTimer: number;
  gamePhase: "setup" | "playing" | "ended";
  winner: "player" | "opponent" | null;
  selectedCard: BattleCard | null;
  targetCard: BattleCard | null;
  isMatchmaking: boolean;
  battleLog: string[];
  
  // Actions
  initializeBattle: (playerDeck: Card[], opponentDeck: Card[]) => void;
  startTurn: () => void;
  endTurn: () => void;
  playCard: (card: BattleCard, target?: BattleCard) => boolean;
  attackWithCard: (attacker: BattleCard, target?: BattleCard) => void;
  selectCard: (card: BattleCard | null) => void;
  setTarget: (target: BattleCard | null) => void;
  drawCard: (playerId: "player" | "opponent") => void;
  takeDamage: (playerId: "player" | "opponent", damage: number) => void;
  endBattle: (winner: "player" | "opponent") => void;
  addToLog: (message: string) => void;
  resetBattle: () => void;
}

const STARTING_HEALTH = 30;
const STARTING_MANA = 1;
const MAX_MANA = 10;
const HAND_SIZE = 5;
const TURN_TIME = 75; // seconds

function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createBattleCard(card: Card): BattleCard {
  return {
    ...card,
    instanceId: Math.random().toString(36).substr(2, 9),
    currentHealth: card.health || 0,
    currentAttack: card.attack || 0,
    canAttack: false,
    hasAttackedThisTurn: false
  };
}

export const useBattle = create<BattleState>()(
  subscribeWithSelector((set, get) => ({
    player: null,
    opponent: null,
    currentTurn: "player",
    turnTimer: TURN_TIME,
    gamePhase: "setup",
    winner: null,
    selectedCard: null,
    targetCard: null,
    isMatchmaking: false,
    battleLog: [],

    initializeBattle: (playerDeck: Card[], opponentDeck: Card[]) => {
      const shuffledPlayerDeck = shuffleDeck(playerDeck);
      const shuffledOpponentDeck = shuffleDeck(opponentDeck);

      const player: Player = {
        id: "player",
        username: "Player",
        health: STARTING_HEALTH,
        maxHealth: STARTING_HEALTH,
        mana: STARTING_MANA,
        maxMana: STARTING_MANA,
        deck: shuffledPlayerDeck.slice(HAND_SIZE),
        hand: shuffledPlayerDeck.slice(0, HAND_SIZE).map(createBattleCard),
        field: [],
        graveyard: []
      };

      const opponent: Player = {
        id: "opponent",
        username: "Opponent",
        health: STARTING_HEALTH,
        maxHealth: STARTING_HEALTH,
        mana: STARTING_MANA,
        maxMana: STARTING_MANA,
        deck: shuffledOpponentDeck.slice(HAND_SIZE),
        hand: shuffledOpponentDeck.slice(0, HAND_SIZE).map(createBattleCard),
        field: [],
        graveyard: []
      };

      set({
        player,
        opponent,
        gamePhase: "playing",
        currentTurn: "player",
        turnTimer: TURN_TIME,
        battleLog: ["Battle begins!"]
      });
    },

    startTurn: () => {
      const { player, opponent, currentTurn } = get();
      if (!player || !opponent) return;

      const currentPlayer = currentTurn === "player" ? player : opponent;
      
      // Increase max mana and restore mana
      currentPlayer.maxMana = Math.min(MAX_MANA, currentPlayer.maxMana + 1);
      currentPlayer.mana = currentPlayer.maxMana;

      // Draw a card
      get().drawCard(currentTurn);

      // Reset card attack status
      currentPlayer.field.forEach(card => {
        card.canAttack = true;
        card.hasAttackedThisTurn = false;
      });

      set({
        turnTimer: TURN_TIME,
        battleLog: [...get().battleLog, `${currentPlayer.username}'s turn begins!`]
      });
    },

    endTurn: () => {
      const newTurn = get().currentTurn === "player" ? "opponent" : "player";
      set({ currentTurn: newTurn });
      
      // Start the next turn
      setTimeout(() => {
        get().startTurn();
      }, 500);
    },

    playCard: (card: BattleCard, target?: BattleCard) => {
      const { player, opponent, currentTurn } = get();
      if (!player || !opponent || currentTurn !== "player") return false;

      if (player.mana < card.manaCost) return false;

      // Remove card from hand
      player.hand = player.hand.filter(c => c.instanceId !== card.instanceId);
      player.mana -= card.manaCost;

      if (card.type === "creature") {
        // Summon creature to field
        card.canAttack = false; // Summoning sickness
        player.field.push(card);
      } else if (card.type === "spell") {
        // Apply spell effect
        if (card.effect === "damage" && target) {
          const damage = card.attack || 0;
          target.currentHealth -= damage;
          
          if (target.currentHealth <= 0) {
            // Remove dead creature
            opponent.field = opponent.field.filter(c => c.instanceId !== target.instanceId);
            opponent.graveyard.push(target);
          }
        } else if (card.effect === "heal" && target) {
          const healing = card.attack || 0;
          target.currentHealth = Math.min(target.health || 0, target.currentHealth + healing);
        }
        
        // Spell goes to graveyard
        player.graveyard.push(card);
      }

      get().addToLog(`Player plays ${card.name}`);
      return true;
    },

    attackWithCard: (attacker: BattleCard, target?: BattleCard) => {
      const { player, opponent } = get();
      if (!player || !opponent || !attacker.canAttack || attacker.hasAttackedThisTurn) return;

      if (target) {
        // Attack creature
        target.currentHealth -= attacker.currentAttack;
        attacker.currentHealth -= target.currentAttack;

        get().addToLog(`${attacker.name} attacks ${target.name}`);

        // Check for deaths
        if (target.currentHealth <= 0) {
          opponent.field = opponent.field.filter(c => c.instanceId !== target.instanceId);
          opponent.graveyard.push(target);
        }

        if (attacker.currentHealth <= 0) {
          player.field = player.field.filter(c => c.instanceId !== attacker.instanceId);
          player.graveyard.push(attacker);
        }
      } else {
        // Attack player directly
        opponent.health -= attacker.currentAttack;
        get().addToLog(`${attacker.name} attacks ${opponent.username} for ${attacker.currentAttack} damage`);

        if (opponent.health <= 0) {
          get().endBattle("player");
          return;
        }
      }

      attacker.hasAttackedThisTurn = true;
      attacker.canAttack = false;
    },

    selectCard: (card: BattleCard | null) => {
      set({ selectedCard: card });
    },

    setTarget: (target: BattleCard | null) => {
      set({ targetCard: target });
    },

    drawCard: (playerId: "player" | "opponent") => {
      const { player, opponent } = get();
      if (!player || !opponent) return;

      const currentPlayer = playerId === "player" ? player : opponent;

      if (currentPlayer.deck.length > 0 && currentPlayer.hand.length < 10) {
        const drawnCard = createBattleCard(currentPlayer.deck[0]);
        currentPlayer.hand.push(drawnCard);
        currentPlayer.deck = currentPlayer.deck.slice(1);
      }
    },

    takeDamage: (playerId: "player" | "opponent", damage: number) => {
      const { player, opponent } = get();
      if (!player || !opponent) return;

      if (playerId === "player") {
        player.health -= damage;
        if (player.health <= 0) {
          get().endBattle("opponent");
        }
      } else {
        opponent.health -= damage;
        if (opponent.health <= 0) {
          get().endBattle("player");
        }
      }
    },

    endBattle: (winner: "player" | "opponent") => {
      set({
        gamePhase: "ended",
        winner,
        battleLog: [...get().battleLog, `${winner === "player" ? "Player" : "Opponent"} wins!`]
      });
    },

    addToLog: (message: string) => {
      set(state => ({
        battleLog: [...state.battleLog, message]
      }));
    },

    resetBattle: () => {
      set({
        player: null,
        opponent: null,
        currentTurn: "player",
        turnTimer: TURN_TIME,
        gamePhase: "setup",
        winner: null,
        selectedCard: null,
        targetCard: null,
        battleLog: []
      });
    }
  }))
);
