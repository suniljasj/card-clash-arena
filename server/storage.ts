import { 
  users, 
  players, 
  decks, 
  quests, 
  battles,
  type User, 
  type InsertUser,
  type Player,
  type InsertPlayer,
  type Deck,
  type InsertDeck,
  type Quest,
  type InsertQuest,
  type Battle,
  type InsertBattle
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Player management
  getPlayer(userId: number): Promise<Player | undefined>;
  initializePlayer(userId: number, username: string): Promise<Player>;
  updatePlayer(userId: number, updates: Partial<Player>): Promise<Player | undefined>;

  // Deck management
  getPlayerDecks(userId: number): Promise<Deck[]>;
  createDeck(userId: number, name: string, cardIds: string[]): Promise<Deck>;
  updateDeck(deckId: string, updates: Partial<Deck>): Promise<Deck | undefined>;
  deleteDeck(deckId: string): Promise<void>;

  // Quest management
  getPlayerQuests(userId: number): Promise<Quest[]>;
  claimQuestRewards(questId: string, userId: number): Promise<any>;

  // Battle management
  createBattle(userId: number, deckId?: string): Promise<string>;
  endBattle(battleId: string, winner: string, playerStats: any): Promise<void>;

  // Store management
  processPurchase(userId: number, itemId: string, currency: string): Promise<any>;

  // Cards
  getAllCards(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private players: Map<number, Player>;
  private decks: Map<string, Deck>;
  private quests: Map<string, Quest>;
  private battles: Map<string, Battle>;
  private currentUserId: number;
  private currentDeckId: number;
  private currentQuestId: number;
  private currentBattleId: number;

  constructor() {
    this.users = new Map();
    this.players = new Map();
    this.decks = new Map();
    this.quests = new Map();
    this.battles = new Map();
    this.currentUserId = 1;
    this.currentDeckId = 1;
    this.currentQuestId = 1;
    this.currentBattleId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getPlayer(userId: number): Promise<Player | undefined> {
    return this.players.get(userId);
  }

  async initializePlayer(userId: number, username: string): Promise<Player> {
    const player: Player = {
      id: userId,
      userId,
      username,
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
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.players.set(userId, player);
    return player;
  }

  async updatePlayer(userId: number, updates: Partial<Player>): Promise<Player | undefined> {
    const player = this.players.get(userId);
    if (!player) return undefined;

    const updatedPlayer = { 
      ...player, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.players.set(userId, updatedPlayer);
    return updatedPlayer;
  }

  async getPlayerDecks(userId: number): Promise<Deck[]> {
    return Array.from(this.decks.values()).filter(deck => deck.userId === userId);
  }

  async createDeck(userId: number, name: string, cardIds: string[]): Promise<Deck> {
    const id = `deck_${this.currentDeckId++}`;
    const deck: Deck = {
      id,
      userId,
      name,
      cardIds,
      createdAt: new Date(),
      lastModified: new Date()
    };

    this.decks.set(id, deck);
    return deck;
  }

  async updateDeck(deckId: string, updates: Partial<Deck>): Promise<Deck | undefined> {
    const deck = this.decks.get(deckId);
    if (!deck) return undefined;

    const updatedDeck = { 
      ...deck, 
      ...updates, 
      lastModified: new Date() 
    };
    this.decks.set(deckId, updatedDeck);
    return updatedDeck;
  }

  async deleteDeck(deckId: string): Promise<void> {
    this.decks.delete(deckId);
  }

  async getPlayerQuests(userId: number): Promise<Quest[]> {
    return Array.from(this.quests.values()).filter(quest => quest.userId === userId);
  }

  async claimQuestRewards(questId: string, userId: number): Promise<any> {
    const quest = this.quests.get(questId);
    if (!quest || quest.userId !== userId || !quest.isCompleted || quest.isClaimed) {
      return null;
    }

    // Mark quest as claimed
    quest.isClaimed = true;
    this.quests.set(questId, quest);

    // Return rewards
    return quest.rewards;
  }

  async createBattle(userId: number, deckId?: string): Promise<string> {
    const battleId = `battle_${this.currentBattleId++}`;
    const battle: Battle = {
      id: battleId,
      player1Id: userId,
      player2Id: null, // AI opponent
      player1DeckId: deckId || null,
      player2DeckId: null,
      status: 'active',
      winner: null,
      startedAt: new Date(),
      endedAt: null,
      gameState: {}
    };

    this.battles.set(battleId, battle);
    return battleId;
  }

  async endBattle(battleId: string, winner: string, playerStats: any): Promise<void> {
    const battle = this.battles.get(battleId);
    if (!battle) return;

    battle.status = 'completed';
    battle.winner = winner;
    battle.endedAt = new Date();
    battle.gameState = playerStats;

    this.battles.set(battleId, battle);

    // Update player stats
    const player = this.players.get(battle.player1Id);
    if (player) {
      if (winner === 'player') {
        player.wins++;
      } else {
        player.losses++;
      }
      player.totalGames++;
      this.players.set(battle.player1Id, player);
    }
  }

  async processPurchase(userId: number, itemId: string, currency: string): Promise<any> {
    const player = this.players.get(userId);
    if (!player) throw new Error("Player not found");

    // Mock store items and prices
    const storeItems: Record<string, { price: number; currency: string; type: string }> = {
      basic_pack: { price: 100, currency: "gold", type: "pack" },
      premium_pack: { price: 200, currency: "gold", type: "pack" },
      legendary_pack: { price: 50, currency: "gems", type: "pack" },
      gold_small: { price: 10, currency: "gems", type: "currency" },
      gold_large: { price: 30, currency: "gems", type: "currency" }
    };

    const item = storeItems[itemId];
    if (!item) throw new Error("Item not found");

    // Check if player can afford
    if (item.currency === "gold" && player.gold < item.price) {
      throw new Error("Insufficient gold");
    }
    if (item.currency === "gems" && player.gems < item.price) {
      throw new Error("Insufficient gems");
    }

    // Deduct currency
    if (item.currency === "gold") {
      player.gold -= item.price;
    } else {
      player.gems -= item.price;
    }

    // Process purchase
    let result: any = { success: true };

    if (item.type === "pack") {
      // Generate random cards for pack
      const cardPool = ["basic_warrior", "basic_mage", "basic_archer", "fire_mage", "knight_defender"];
      const packCards = [];
      
      for (let i = 0; i < 5; i++) {
        const randomCard = cardPool[Math.floor(Math.random() * cardPool.length)];
        packCards.push(randomCard);
        
        // Add to player collection
        const ownedCards = (player.ownedCards as string[]) || [];
        const cardCounts = (player.cardCounts as Record<string, number>) || {};
        
        if (!ownedCards.includes(randomCard)) {
          ownedCards.push(randomCard);
        }
        cardCounts[randomCard] = (cardCounts[randomCard] || 0) + 1;
        
        player.ownedCards = ownedCards;
        player.cardCounts = cardCounts;
      }
      
      result.cards = packCards;
    } else if (item.type === "currency") {
      // Add gold from gem purchase
      if (itemId === "gold_small") {
        player.gold += 500;
        result.goldAdded = 500;
      } else if (itemId === "gold_large") {
        player.gold += 2000;
        result.goldAdded = 2000;
      }
    }

    this.players.set(userId, player);
    return result;
  }

  async getAllCards(): Promise<any[]> {
    // Return mock card data
    return [
      { id: "basic_warrior", name: "Novice Warrior", rarity: "common", type: "creature" },
      { id: "basic_mage", name: "Apprentice Mage", rarity: "common", type: "creature" },
      { id: "basic_archer", name: "Forest Archer", rarity: "common", type: "creature" },
      { id: "basic_spell", name: "Lightning Bolt", rarity: "common", type: "spell" },
      { id: "basic_heal", name: "Healing Potion", rarity: "common", type: "spell" },
      { id: "knight_defender", name: "Royal Knight", rarity: "rare", type: "creature" },
      { id: "fire_mage", name: "Flame Conjurer", rarity: "rare", type: "creature" },
      { id: "dragon_knight", name: "Dragonscale Champion", rarity: "epic", type: "creature" },
      { id: "phoenix_eternal", name: "Eternal Phoenix", rarity: "legendary", type: "creature" }
    ];
  }
}

// Use database storage in production, memory storage for development if needed
export { storage } from "./dbStorage";
