import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const updatePlayerSchema = z.object({
  username: z.string().optional(),
  level: z.number().optional(),
  experience: z.number().optional(),
  gold: z.number().optional(),
  gems: z.number().optional(),
  avatar: z.string().optional(),
  rank: z.string().optional(),
  wins: z.number().optional(),
  losses: z.number().optional(),
  totalGames: z.number().optional(),
  hasCompletedTutorial: z.boolean().optional(),
  achievements: z.array(z.string()).optional(),
  activeDeckId: z.string().nullable().optional(),
  ownedCards: z.array(z.string()).optional(),
  cardCounts: z.record(z.number()).optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, you'd verify the password hash
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          createdAt: user.createdAt 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }

      // Create new user
      const user = await storage.createUser({ username, email, password });
      
      // Set session
      req.session.userId = user.id;
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          createdAt: user.createdAt 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        createdAt: user.createdAt 
      } 
    });
  });

  // Player routes
  app.get("/api/player/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const player = await storage.getPlayer(userId);
      
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }

      res.json({ player });
    } catch (error) {
      res.status(400).json({ message: "Invalid user ID" });
    }
  });

  app.post("/api/player/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const updates = updatePlayerSchema.parse(req.body);
      
      const player = await storage.updatePlayer(userId, updates);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }

      res.json({ player });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/player/:userId/initialize", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { username } = req.body;
      
      const player = await storage.initializePlayer(userId, username);
      res.json({ player });
    } catch (error) {
      res.status(400).json({ message: "Failed to initialize player" });
    }
  });

  // Deck routes
  app.get("/api/player/:userId/decks", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const decks = await storage.getPlayerDecks(userId);
      res.json({ decks });
    } catch (error) {
      res.status(400).json({ message: "Invalid user ID" });
    }
  });

  app.post("/api/player/:userId/decks", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { name, cardIds } = req.body;
      
      const deck = await storage.createDeck(userId, name, cardIds);
      res.json({ deck });
    } catch (error) {
      res.status(400).json({ message: "Failed to create deck" });
    }
  });

  app.put("/api/deck/:deckId", async (req, res) => {
    try {
      const deckId = req.params.deckId;
      const updates = req.body;
      
      const deck = await storage.updateDeck(deckId, updates);
      if (!deck) {
        return res.status(404).json({ message: "Deck not found" });
      }

      res.json({ deck });
    } catch (error) {
      res.status(400).json({ message: "Failed to update deck" });
    }
  });

  app.delete("/api/deck/:deckId", async (req, res) => {
    try {
      const deckId = req.params.deckId;
      await storage.deleteDeck(deckId);
      res.json({ message: "Deck deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete deck" });
    }
  });

  // Quest routes
  app.get("/api/player/:userId/quests", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const quests = await storage.getPlayerQuests(userId);
      res.json({ quests });
    } catch (error) {
      res.status(400).json({ message: "Invalid user ID" });
    }
  });

  app.post("/api/quest/:questId/claim", async (req, res) => {
    try {
      const questId = req.params.questId;
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const rewards = await storage.claimQuestRewards(questId, userId);
      if (!rewards) {
        return res.status(404).json({ message: "Quest not found or already claimed" });
      }

      res.json({ rewards });
    } catch (error) {
      res.status(400).json({ message: "Failed to claim quest rewards" });
    }
  });

  // Battle routes
  app.post("/api/battle/start", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { deckId } = req.body;
      const battleId = await storage.createBattle(userId, deckId);
      
      res.json({ battleId });
    } catch (error) {
      res.status(400).json({ message: "Failed to start battle" });
    }
  });

  app.post("/api/battle/:battleId/end", async (req, res) => {
    try {
      const battleId = req.params.battleId;
      const { winner, playerStats } = req.body;
      
      await storage.endBattle(battleId, winner, playerStats);
      res.json({ message: "Battle ended successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to end battle" });
    }
  });

  // Store routes
  app.post("/api/store/purchase", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { itemId, currency } = req.body;
      const result = await storage.processPurchase(userId, itemId, currency);
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Purchase failed" });
    }
  });

  // Cards routes
  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getAllCards();
      res.json({ cards });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
