export interface Card {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  attack?: number;
  health?: number;
  type: "creature" | "spell" | "support";
  rarity: "common" | "rare" | "epic" | "legendary";
  image: string;
  effect?: string;
  keywords?: string[];
  lore?: string;
}

export interface Deck {
  id: string;
  name: string;
  cardIds: string[];
  createdAt: Date;
  lastModified: Date;
}

export interface BattleRewards {
  experience: number;
  gold: number;
  cards?: string[];
  gems?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface CardFilter {
  rarity?: string;
  type?: string;
  manaCost?: number[];
  search?: string;
  owned?: boolean;
}

export interface BattleCard extends Card {
  instanceId: string;
  currentHealth: number;
  currentAttack: number;
  canAttack: boolean;
  hasAttackedThisTurn: boolean;
}

export interface BattleStats {
  wins: number;
  losses: number;
  totalGames: number;
  winRate: number;
  averageGameLength: number;
  favoriteCard?: string;
}
