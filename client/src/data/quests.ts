export const QUEST_TEMPLATES = {
  daily: [
    {
      id: "daily_battles",
      title: "Battle Veteran",
      description: "Win 3 battles",
      maxProgress: 3,
      rewards: { gold: 150, experience: 50 }
    },
    {
      id: "daily_cards",
      title: "Card Master", 
      description: "Play 10 cards in battles",
      maxProgress: 10,
      rewards: { gold: 100, experience: 30 }
    },
    {
      id: "daily_damage",
      title: "Destroyer",
      description: "Deal 50 damage to opponents",
      maxProgress: 50,
      rewards: { gold: 120, experience: 40 }
    },
    {
      id: "daily_summon",
      title: "Summoner",
      description: "Summon 8 creatures",
      maxProgress: 8,
      rewards: { gold: 110, experience: 35 }
    },
    {
      id: "daily_spells",
      title: "Spellcaster",
      description: "Cast 6 spells",
      maxProgress: 6,
      rewards: { gold: 130, experience: 45 }
    }
  ],
  weekly: [
    {
      id: "weekly_wins",
      title: "Champion",
      description: "Win 15 battles this week",
      maxProgress: 15,
      rewards: { gold: 500, gems: 25, experience: 200 }
    },
    {
      id: "weekly_collection",
      title: "Collector",
      description: "Open 5 card packs",
      maxProgress: 5,
      rewards: { gold: 300, gems: 15, cards: ["rare_random"] }
    },
    {
      id: "weekly_variety",
      title: "Variety Player",
      description: "Win with 3 different deck types",
      maxProgress: 3,
      rewards: { gold: 400, gems: 20, experience: 150 }
    }
  ],
  achievements: [
    {
      id: "first_win",
      title: "First Victory",
      description: "Win your first battle",
      maxProgress: 1,
      rewards: { gold: 200, gems: 10, experience: 100 }
    },
    {
      id: "deck_builder",
      title: "Deck Builder",
      description: "Create your first custom deck",
      maxProgress: 1,
      rewards: { gold: 150, gems: 5, experience: 75 }
    },
    {
      id: "collector_novice",
      title: "Novice Collector",
      description: "Own 25 different cards",
      maxProgress: 25,
      rewards: { gold: 300, gems: 15, experience: 150 }
    },
    {
      id: "collector_expert",
      title: "Expert Collector",
      description: "Own 50 different cards",
      maxProgress: 50,
      rewards: { gold: 600, gems: 30, experience: 300 }
    },
    {
      id: "battle_veteran",
      title: "Battle Veteran",
      description: "Play 100 battles",
      maxProgress: 100,
      rewards: { gold: 1000, gems: 50, experience: 500 }
    },
    {
      id: "win_streak",
      title: "Unstoppable",
      description: "Win 10 battles in a row",
      maxProgress: 10,
      rewards: { gold: 800, gems: 40, experience: 400 }
    },
    {
      id: "legendary_owner",
      title: "Legend Collector",
      description: "Own 5 legendary cards",
      maxProgress: 5,
      rewards: { gold: 1500, gems: 75, experience: 750 }
    }
  ]
};
