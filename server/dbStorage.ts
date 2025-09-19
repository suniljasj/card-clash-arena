import { eq, and } from "drizzle-orm";
import { db } from "./db";
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
import { IStorage } from "./storage";

export class DbStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Player management
  async getPlayer(userId: number): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.userId, userId)).limit(1);
    return result[0];
  }

  async initializePlayer(userId: number, username: string): Promise<Player> {
    const newPlayer: InsertPlayer = {
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
      }
    };

    const result = await db.insert(players).values(newPlayer).returning();
    return result[0];
  }

  async updatePlayer(userId: number, updates: Partial<Player>): Promise<Player | undefined> {
    const result = await db
      .update(players)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(players.userId, userId))
      .returning();
    return result[0];
  }

  // Deck management
  async getPlayerDecks(userId: number): Promise<Deck[]> {
    return await db.select().from(decks).where(eq(decks.userId, userId));
  }

  async createDeck(userId: number, name: string, cardIds: string[]): Promise<Deck> {
    const deckId = Math.random().toString(36).substr(2, 9);
    const newDeck: InsertDeck = {
      id: deckId,
      userId,
      name,
      cardIds
    };

    const result = await db.insert(decks).values(newDeck).returning();
    return result[0];
  }

  async updateDeck(deckId: string, updates: Partial<Deck>): Promise<Deck | undefined> {
    const result = await db
      .update(decks)
      .set({ ...updates, lastModified: new Date() })
      .where(eq(decks.id, deckId))
      .returning();
    return result[0];
  }

  async deleteDeck(deckId: string): Promise<void> {
    await db.delete(decks).where(eq(decks.id, deckId));
  }

  // Quest management
  async getPlayerQuests(userId: number): Promise<Quest[]> {
    return await db.select().from(quests).where(eq(quests.userId, userId));
  }

  async claimQuestRewards(questId: string, userId: number): Promise<any> {
    // Get the quest
    const quest = await db.select().from(quests)
      .where(and(eq(quests.id, questId), eq(quests.userId, userId)))
      .limit(1);
    
    if (!quest[0] || !quest[0].isCompleted || quest[0].isClaimed) {
      throw new Error("Quest cannot be claimed");
    }

    // Mark quest as claimed
    await db.update(quests)
      .set({ isClaimed: true })
      .where(eq(quests.id, questId));

    // Get rewards
    const rewards = quest[0].rewards as any;
    
    // Update player stats
    const player = await this.getPlayer(userId);
    if (player) {
      const updates: Partial<Player> = {};
      
      if (rewards.experience) {
        updates.experience = (player.experience || 0) + rewards.experience;
        // Level up logic
        const newLevel = Math.floor((updates.experience || 0) / 1000) + 1;
        if (newLevel > player.level) {
          updates.level = newLevel;
        }
      }
      
      if (rewards.gold) {
        updates.gold = (player.gold || 0) + rewards.gold;
      }
      
      if (rewards.gems) {
        updates.gems = (player.gems || 0) + rewards.gems;
      }

      if (Object.keys(updates).length > 0) {
        await this.updatePlayer(userId, updates);
      }
    }

    return rewards;
  }

  // Battle management
  async createBattle(userId: number, deckId?: string): Promise<string> {
    const battleId = Math.random().toString(36).substr(2, 9);
    const newBattle: InsertBattle = {
      id: battleId,
      player1Id: userId,
      player2Id: null, // AI opponent
      player1DeckId: deckId || null,
      player2DeckId: null,
      status: "active",
      winner: null,
      gameState: {}
    };

    await db.insert(battles).values(newBattle);
    return battleId;
  }

  async endBattle(battleId: string, winner: string, playerStats: any): Promise<void> {
    await db.update(battles)
      .set({ 
        status: "completed", 
        winner, 
        endedAt: new Date(),
        gameState: playerStats 
      })
      .where(eq(battles.id, battleId));
  }

  // Store management
  async processPurchase(userId: number, itemId: string, currency: string): Promise<any> {
    const player = await this.getPlayer(userId);
    if (!player) throw new Error("Player not found");

    // Define store items
    const storeItems = [
      { id: "basic_pack", name: "Basic Pack", price: 100, currency: "gold", type: "pack" },
      { id: "rare_pack", name: "Rare Pack", price: 200, currency: "gold", type: "pack" },
      { id: "epic_pack", name: "Epic Pack", price: 10, currency: "gems", type: "pack" },
      { id: "gold_small", name: "500 Gold", price: 5, currency: "gems", type: "currency" },
      { id: "gold_large", name: "2000 Gold", price: 15, currency: "gems", type: "currency" }
    ];

    const item = storeItems.find(i => i.id === itemId);
    if (!item) throw new Error("Item not found");

    // Check if player can afford
    if (item.currency === "gold" && player.gold < item.price) {
      throw new Error("Insufficient gold");
    }
    if (item.currency === "gems" && player.gems < item.price) {
      throw new Error("Insufficient gems");
    }

    const updates: Partial<Player> = {};

    // Deduct currency
    if (item.currency === "gold") {
      updates.gold = player.gold - item.price;
    } else {
      updates.gems = player.gems - item.price;
    }

    // Process purchase
    let result: any = { success: true };

    if (item.type === "pack") {
      // Generate random cards for pack
      const cardPool = ["basic_warrior", "basic_mage", "basic_archer", "fire_mage", "knight_defender"];
      const packCards = [];
      
      const ownedCards = (player.ownedCards as string[]) || [];
      const cardCounts = (player.cardCounts as Record<string, number>) || {};
      
      for (let i = 0; i < 5; i++) {
        const randomCard = cardPool[Math.floor(Math.random() * cardPool.length)];
        packCards.push(randomCard);
        
        // Add to player collection
        if (!ownedCards.includes(randomCard)) {
          ownedCards.push(randomCard);
        }
        cardCounts[randomCard] = (cardCounts[randomCard] || 0) + 1;
      }
      
      updates.ownedCards = ownedCards;
      updates.cardCounts = cardCounts;
      result.cards = packCards;
    } else if (item.type === "currency") {
      // Add gold from gem purchase
      if (itemId === "gold_small") {
        updates.gold = (updates.gold || player.gold) + 500;
        result.goldAdded = 500;
      } else if (itemId === "gold_large") {
        updates.gold = (updates.gold || player.gold) + 2000;
        result.goldAdded = 2000;
      }
    }

    await this.updatePlayer(userId, updates);
    return result;
  }

  async getAllCards(): Promise<any[]> {
    // Return mock card data - in a real app this would come from a cards table
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

export const storage = new DbStorage();