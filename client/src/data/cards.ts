import { Card } from "../types/game";

export const CARDS: Card[] = [
  // Basic/Common Cards
  {
    id: "basic_warrior",
    name: "Novice Warrior",
    description: "A brave young warrior ready for battle",
    manaCost: 2,
    attack: 2,
    health: 3,
    type: "creature",
    rarity: "common",
    image: "warrior_basic",
    lore: "Every great warrior starts somewhere. This one starts here."
  },
  {
    id: "basic_mage",
    name: "Apprentice Mage",
    description: "A student of the magical arts",
    manaCost: 2,
    attack: 1,
    health: 4,
    type: "creature",
    rarity: "common",
    image: "mage_basic",
    keywords: ["Spellpower"],
    lore: "Knowledge is power, and power corrupts. But corruption can be fun."
  },
  {
    id: "basic_archer",
    name: "Forest Archer",
    description: "Swift and accurate with a bow",
    manaCost: 3,
    attack: 3,
    health: 2,
    type: "creature",
    rarity: "common",
    image: "archer_basic",
    keywords: ["Range"],
    lore: "In the forest, patience and precision are virtues that keep you alive."
  },
  {
    id: "basic_spell",
    name: "Lightning Bolt",
    description: "Deal 3 damage to any target",
    manaCost: 1,
    attack: 3,
    type: "spell",
    rarity: "common",
    image: "spell_lightning",
    effect: "damage",
    lore: "Sometimes the simplest solutions are the most effective."
  },
  {
    id: "basic_heal",
    name: "Healing Potion",
    description: "Restore 5 health to any target",
    manaCost: 1,
    attack: 5,
    type: "spell",
    rarity: "common",
    image: "spell_heal",
    effect: "heal",
    lore: "A little magic in a bottle can go a long way."
  },

  // Rare Cards
  {
    id: "knight_defender",
    name: "Royal Knight",
    description: "A noble defender of the realm",
    manaCost: 4,
    attack: 3,
    health: 6,
    type: "creature",
    rarity: "rare",
    image: "knight_royal",
    keywords: ["Taunt", "Armor"],
    lore: "Honor and duty guide their blade, loyalty strengthens their shield."
  },
  {
    id: "fire_mage",
    name: "Flame Conjurer",
    description: "Master of fire magic",
    manaCost: 3,
    attack: 2,
    health: 3,
    type: "creature",
    rarity: "rare",
    image: "mage_fire",
    keywords: ["Spellpower", "Burning"],
    lore: "Some say fire is destruction. Others say it's purification."
  },
  {
    id: "shadow_assassin",
    name: "Shadow Stalker",
    description: "Strikes from the darkness",
    manaCost: 3,
    attack: 4,
    health: 2,
    type: "creature",
    rarity: "rare",
    image: "assassin_shadow",
    keywords: ["Stealth", "Poison"],
    lore: "Death comes quietly in the night, wearing a familiar face."
  },
  {
    id: "fireball",
    name: "Fireball",
    description: "Deal 6 damage to target and 2 to adjacent enemies",
    manaCost: 4,
    attack: 6,
    type: "spell",
    rarity: "rare",
    image: "spell_fireball",
    effect: "area_damage",
    lore: "When subtlety fails, there's always the direct approach."
  },

  // Epic Cards
  {
    id: "dragon_knight",
    name: "Dragonscale Champion",
    description: "A legendary warrior bonded with dragons",
    manaCost: 6,
    attack: 5,
    health: 7,
    type: "creature",
    rarity: "epic",
    image: "knight_dragon",
    keywords: ["Flying", "Dragonborn"],
    lore: "When dragons choose a champion, mountains tremble and kingdoms rise."
  },
  {
    id: "archmage",
    name: "Arcane Archmage",
    description: "Master of all magical schools",
    manaCost: 7,
    attack: 4,
    health: 6,
    type: "creature",
    rarity: "epic",
    image: "mage_arch",
    keywords: ["Spellpower", "Magical Immunity"],
    lore: "Power beyond measure, wisdom beyond years, beard beyond reason."
  },
  {
    id: "demon_lord",
    name: "Infernal Lord",
    description: "A powerful demon from the depths",
    manaCost: 8,
    attack: 7,
    health: 5,
    type: "creature",
    rarity: "epic",
    image: "demon_lord",
    keywords: ["Fear", "Hellfire"],
    lore: "Some deals with darkness are worth the price. This one isn't."
  },

  // Legendary Cards
  {
    id: "phoenix_eternal",
    name: "Eternal Phoenix",
    description: "Reborn from its own ashes when destroyed",
    manaCost: 9,
    attack: 6,
    health: 8,
    type: "creature",
    rarity: "legendary",
    image: "phoenix_eternal",
    keywords: ["Flying", "Rebirth", "Legendary"],
    lore: "Death is but a momentary inconvenience to those who master the flame eternal."
  },
  {
    id: "time_wizard",
    name: "Chronos Mage",
    description: "Controller of time itself",
    manaCost: 10,
    attack: 3,
    health: 9,
    type: "creature",
    rarity: "legendary",
    image: "mage_time",
    keywords: ["Time Magic", "Legendary"],
    effect: "time_manipulation",
    lore: "Time is a river, and I am the dam that shapes its flow."
  },
  {
    id: "world_tree",
    name: "Yggdrasil Seedling",
    description: "The world tree in its youth",
    manaCost: 8,
    attack: 0,
    health: 12,
    type: "creature",
    rarity: "legendary",
    image: "tree_world",
    keywords: ["Growth", "Nature Magic", "Legendary"],
    lore: "From small seeds grow mighty trees. From mighty trees grow entire worlds."
  }
];
