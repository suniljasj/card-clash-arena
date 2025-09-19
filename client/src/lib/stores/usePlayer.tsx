import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Player {
  id: string;
  username: string;
  level: number;
  experience: number;
  gold: number;
  gems: number;
  avatar: string;
  rank: string;
  wins: number;
  losses: number;
  totalGames: number;
  hasCompletedTutorial: boolean;
  lastLoginBonus: Date | null;
  achievements: string[];
  activeDeckId: string | null;
  ownedCards: string[];
  cardCounts: Record<string, number>;
}

interface PlayerState {
  player: Player | null;
  initializePlayer: (user: any) => void;
  updatePlayer: (updates: Partial<Player>) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  addExperience: (amount: number) => void;
  addCard: (cardId: string, count?: number) => void;
  removeCard: (cardId: string, count?: number) => void;
  unlockAchievement: (achievementId: string) => void;
  completeTutorial: () => void;
  claimDailyBonus: () => boolean;
}

const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1850, 2350, 2900, 3500];

export const usePlayer = create<PlayerState>()(
  persist(
    (set, get) => ({
      player: null,

      initializePlayer: (user: any) => {
        const existingPlayer = get().player;
        if (existingPlayer && existingPlayer.id === user.id) {
          return;
        }

        const newPlayer: Player = {
          id: user.id,
          username: user.username,
          level: 1,
          experience: 0,
          gold: 1000,
          gems: 50,
          avatar: "default",
          rank: "Bronze",
          wins: 0,
          losses: 0,
          totalGames: 0,
          hasCompletedTutorial: false,
          lastLoginBonus: null,
          achievements: [],
          activeDeckId: null,
          ownedCards: ["basic_warrior", "basic_mage", "basic_archer", "basic_spell", "basic_heal"],
          cardCounts: {
            "basic_warrior": 2,
            "basic_mage": 2,
            "basic_archer": 2,
            "basic_spell": 2,
            "basic_heal": 2
          }
        };

        set({ player: newPlayer });
      },

      updatePlayer: (updates: Partial<Player>) => {
        set(state => ({
          player: state.player ? { ...state.player, ...updates } : null
        }));
      },

      addGold: (amount: number) => {
        set(state => ({
          player: state.player ? {
            ...state.player,
            gold: state.player.gold + amount
          } : null
        }));
      },

      spendGold: (amount: number) => {
        const { player } = get();
        if (!player || player.gold < amount) return false;

        set(state => ({
          player: state.player ? {
            ...state.player,
            gold: state.player.gold - amount
          } : null
        }));
        return true;
      },

      addGems: (amount: number) => {
        set(state => ({
          player: state.player ? {
            ...state.player,
            gems: state.player.gems + amount
          } : null
        }));
      },

      spendGems: (amount: number) => {
        const { player } = get();
        if (!player || player.gems < amount) return false;

        set(state => ({
          player: state.player ? {
            ...state.player,
            gems: state.player.gems - amount
          } : null
        }));
        return true;
      },

      addExperience: (amount: number) => {
        set(state => {
          if (!state.player) return state;

          const newExperience = state.player.experience + amount;
          let newLevel = state.player.level;

          // Check for level up
          while (newLevel < LEVEL_THRESHOLDS.length - 1 && 
                 newExperience >= LEVEL_THRESHOLDS[newLevel]) {
            newLevel++;
          }

          return {
            player: {
              ...state.player,
              experience: newExperience,
              level: newLevel
            }
          };
        });
      },

      addCard: (cardId: string, count = 1) => {
        set(state => {
          if (!state.player) return state;

          const ownedCards = [...state.player.ownedCards];
          if (!ownedCards.includes(cardId)) {
            ownedCards.push(cardId);
          }

          const cardCounts = { ...state.player.cardCounts };
          cardCounts[cardId] = (cardCounts[cardId] || 0) + count;

          return {
            player: {
              ...state.player,
              ownedCards,
              cardCounts
            }
          };
        });
      },

      removeCard: (cardId: string, count = 1) => {
        set(state => {
          if (!state.player) return state;

          const cardCounts = { ...state.player.cardCounts };
          cardCounts[cardId] = Math.max(0, (cardCounts[cardId] || 0) - count);

          const ownedCards = state.player.ownedCards.filter(id => 
            id !== cardId || cardCounts[cardId] > 0
          );

          return {
            player: {
              ...state.player,
              ownedCards,
              cardCounts
            }
          };
        });
      },

      unlockAchievement: (achievementId: string) => {
        set(state => {
          if (!state.player || state.player.achievements.includes(achievementId)) {
            return state;
          }

          return {
            player: {
              ...state.player,
              achievements: [...state.player.achievements, achievementId]
            }
          };
        });
      },

      completeTutorial: () => {
        set(state => ({
          player: state.player ? {
            ...state.player,
            hasCompletedTutorial: true
          } : null
        }));
      },

      claimDailyBonus: () => {
        const { player } = get();
        if (!player) return false;

        const now = new Date();
        const lastBonus = player.lastLoginBonus;

        if (!lastBonus || now.getDate() !== lastBonus.getDate()) {
          set(state => ({
            player: state.player ? {
              ...state.player,
              gold: state.player.gold + 100,
              gems: state.player.gems + 5,
              lastLoginBonus: now
            } : null
          }));
          return true;
        }

        return false;
      }
    }),
    {
      name: "player-storage"
    }
  )
);
