import { create } from "zustand";
import { Card, Deck } from "@/types/game";
import { CARDS } from "@/data/cards";

interface DeckState {
  decks: Deck[];
  activeDeckId: string | null;
  createDeck: (name: string, cardIds: string[]) => string;
  updateDeck: (deckId: string, updates: Partial<Deck>) => void;
  deleteDeck: (deckId: string) => void;
  setActiveDeck: (deckId: string) => void;
  getActiveDeck: () => Deck | null;
  getDeckCards: (deckId: string) => Card[];
}

export const useCards = create<DeckState>((set, get) => ({
  decks: [],
  activeDeckId: null,

  createDeck: (name: string, cardIds: string[]) => {
    const deckId = Math.random().toString(36).substr(2, 9);
    const newDeck: Deck = {
      id: deckId,
      name,
      cardIds,
      createdAt: new Date(),
      lastModified: new Date()
    };

    set(state => ({
      decks: [...state.decks, newDeck]
    }));

    return deckId;
  },

  updateDeck: (deckId: string, updates: Partial<Deck>) => {
    set(state => ({
      decks: state.decks.map(deck =>
        deck.id === deckId
          ? { ...deck, ...updates, lastModified: new Date() }
          : deck
      )
    }));
  },

  deleteDeck: (deckId: string) => {
    set(state => ({
      decks: state.decks.filter(deck => deck.id !== deckId),
      activeDeckId: state.activeDeckId === deckId ? null : state.activeDeckId
    }));
  },

  setActiveDeck: (deckId: string) => {
    set({ activeDeckId: deckId });
  },

  getActiveDeck: () => {
    const { decks, activeDeckId } = get();
    return decks.find(deck => deck.id === activeDeckId) || null;
  },

  getDeckCards: (deckId: string) => {
    const { decks } = get();
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return [];

    return deck.cardIds
      .map(cardId => CARDS.find(card => card.id === cardId))
      .filter(Boolean) as Card[];
  }
}));

// Card utilities
export const getCardById = (cardId: string): Card | undefined => {
  return CARDS.find(card => card.id === cardId);
};

export const getCardsByRarity = (rarity: string): Card[] => {
  return CARDS.filter(card => card.rarity === rarity);
};

export const getCardsByType = (type: string): Card[] => {
  return CARDS.filter(card => card.type === type);
};

export const filterCards = (filters: {
  rarity?: string;
  type?: string;
  manaCost?: number;
  search?: string;
}): Card[] => {
  return CARDS.filter(card => {
    if (filters.rarity && card.rarity !== filters.rarity) return false;
    if (filters.type && card.type !== filters.type) return false;
    if (filters.manaCost !== undefined && card.manaCost !== filters.manaCost) return false;
    if (filters.search && !card.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
};
