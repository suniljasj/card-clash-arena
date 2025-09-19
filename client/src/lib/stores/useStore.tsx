import { create } from "zustand";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "gold" | "gems";
  type: "pack" | "currency" | "cosmetic";
  rarity?: string;
  image: string;
  limited?: boolean;
  discount?: number;
}

interface StoreState {
  items: StoreItem[];
  purchaseHistory: string[];
  dailyDeals: StoreItem[];
  purchaseItem: (itemId: string) => boolean;
  refreshDailyDeals: () => void;
  openCardPack: (packType: string) => string[];
}

const STORE_ITEMS: StoreItem[] = [
  {
    id: "basic_pack",
    name: "Basic Card Pack",
    description: "Contains 5 random cards with guaranteed Common rarity",
    price: 100,
    currency: "gold",
    type: "pack",
    image: "pack_basic"
  },
  {
    id: "premium_pack",
    name: "Premium Card Pack",
    description: "Contains 5 random cards with guaranteed Rare or better",
    price: 200,
    currency: "gold",
    type: "pack",
    image: "pack_premium"
  },
  {
    id: "legendary_pack",
    name: "Legendary Pack",
    description: "Contains 3 cards with guaranteed Legendary",
    price: 50,
    currency: "gems",
    type: "pack",
    image: "pack_legendary"
  },
  {
    id: "gold_small",
    name: "Small Gold Pouch",
    description: "500 Gold",
    price: 10,
    currency: "gems",
    type: "currency",
    image: "gold_small"
  },
  {
    id: "gold_large",
    name: "Large Gold Chest",
    description: "2000 Gold",
    price: 30,
    currency: "gems",
    type: "currency",
    image: "gold_large"
  }
];

const PACK_CONTENTS = {
  basic_pack: {
    count: 5,
    rarities: [
      { rarity: "common", weight: 70 },
      { rarity: "rare", weight: 25 },
      { rarity: "epic", weight: 5 }
    ]
  },
  premium_pack: {
    count: 5,
    rarities: [
      { rarity: "common", weight: 40 },
      { rarity: "rare", weight: 40 },
      { rarity: "epic", weight: 15 },
      { rarity: "legendary", weight: 5 }
    ]
  },
  legendary_pack: {
    count: 3,
    rarities: [
      { rarity: "epic", weight: 40 },
      { rarity: "legendary", weight: 60 }
    ]
  }
};

export const useStore = create<StoreState>((set, get) => ({
  items: STORE_ITEMS,
  purchaseHistory: [],
  dailyDeals: [],

  purchaseItem: (itemId: string) => {
    const item = STORE_ITEMS.find(i => i.id === itemId);
    if (!item) return false;

    // This would integrate with the player store to check/spend currency
    // For now, just add to purchase history
    set(state => ({
      purchaseHistory: [...state.purchaseHistory, itemId]
    }));

    return true;
  },

  refreshDailyDeals: () => {
    // Select 3 random items as daily deals with discounts
    const shuffledItems = [...STORE_ITEMS].sort(() => Math.random() - 0.5);
    const deals = shuffledItems.slice(0, 3).map(item => ({
      ...item,
      discount: Math.floor(Math.random() * 30) + 10 // 10-40% discount
    }));

    set({ dailyDeals: deals });
  },

  openCardPack: (packType: string): string[] => {
    const packData = PACK_CONTENTS[packType as keyof typeof PACK_CONTENTS];
    if (!packData) return [];

    const cards: string[] = [];
    
    for (let i = 0; i < packData.count; i++) {
      // Weighted random selection
      const totalWeight = packData.rarities.reduce((sum, r) => sum + r.weight, 0);
      let random = Math.random() * totalWeight;
      
      let selectedRarity = "common";
      for (const rarityData of packData.rarities) {
        random -= rarityData.weight;
        if (random <= 0) {
          selectedRarity = rarityData.rarity;
          break;
        }
      }

      // Get a random card of the selected rarity
      // This would integrate with the cards system
      cards.push(`${selectedRarity}_card_${Math.floor(Math.random() * 10)}`);
    }

    return cards;
  }
}));
