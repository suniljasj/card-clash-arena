import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Quest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "achievement";
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  rewards: {
    gold?: number;
    gems?: number;
    experience?: number;
    cards?: string[];
  };
  expiresAt?: Date;
}

interface QuestState {
  quests: Quest[];
  initializeQuests: () => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  completeQuest: (questId: string) => void;
  claimRewards: (questId: string) => Quest["rewards"] | null;
  refreshDailyQuests: () => void;
  refreshWeeklyQuests: () => void;
}

const DAILY_QUEST_TEMPLATES = [
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
  }
];

const WEEKLY_QUEST_TEMPLATES = [
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
  }
];

const ACHIEVEMENT_QUESTS = [
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
    id: "battle_veteran",
    title: "Battle Veteran",
    description: "Play 100 battles",
    maxProgress: 100,
    rewards: { gold: 1000, gems: 50, experience: 500 }
  }
];

export const useQuests = create<QuestState>()(
  persist(
    (set, get) => ({
      quests: [],

      initializeQuests: () => {
        const existingQuests = get().quests;
        
        // Add achievement quests if they don't exist
        const newQuests = [...existingQuests];
        
        ACHIEVEMENT_QUESTS.forEach(template => {
          if (!existingQuests.find(q => q.id === template.id)) {
            newQuests.push({
              ...template,
              type: "achievement" as const,
              progress: 0,
              isCompleted: false,
              isClaimed: false
            });
          }
        });

        // Initialize daily/weekly quests if needed
        const now = new Date();
        const hasValidDailyQuests = existingQuests.some(q => 
          q.type === "daily" && 
          q.expiresAt && 
          q.expiresAt > now
        );

        if (!hasValidDailyQuests) {
          get().refreshDailyQuests();
        }

        set({ quests: newQuests });
      },

      updateQuestProgress: (questId: string, progress: number) => {
        set(state => ({
          quests: state.quests.map(quest => {
            if (quest.id === questId && !quest.isCompleted) {
              const newProgress = Math.min(quest.maxProgress, quest.progress + progress);
              const isCompleted = newProgress >= quest.maxProgress;
              
              return {
                ...quest,
                progress: newProgress,
                isCompleted
              };
            }
            return quest;
          })
        }));
      },

      completeQuest: (questId: string) => {
        set(state => ({
          quests: state.quests.map(quest =>
            quest.id === questId
              ? { ...quest, isCompleted: true }
              : quest
          )
        }));
      },

      claimRewards: (questId: string) => {
        const quest = get().quests.find(q => q.id === questId);
        if (!quest || !quest.isCompleted || quest.isClaimed) {
          return null;
        }

        set(state => ({
          quests: state.quests.map(q =>
            q.id === questId
              ? { ...q, isClaimed: true }
              : q
          )
        }));

        return quest.rewards;
      },

      refreshDailyQuests: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        // Select 2 random daily quests
        const selectedTemplates = DAILY_QUEST_TEMPLATES
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);

        const newDailyQuests: Quest[] = selectedTemplates.map(template => ({
          ...template,
          id: `${template.id}_${Date.now()}`,
          type: "daily",
          progress: 0,
          isCompleted: false,
          isClaimed: false,
          expiresAt: tomorrow
        }));

        set(state => ({
          quests: [
            ...state.quests.filter(q => q.type !== "daily" || (q.expiresAt && q.expiresAt > new Date())),
            ...newDailyQuests
          ]
        }));
      },

      refreshWeeklyQuests: () => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(0, 0, 0, 0);

        const newWeeklyQuests: Quest[] = WEEKLY_QUEST_TEMPLATES.map(template => ({
          ...template,
          id: `${template.id}_${Date.now()}`,
          type: "weekly",
          progress: 0,
          isCompleted: false,
          isClaimed: false,
          expiresAt: nextWeek
        }));

        set(state => ({
          quests: [
            ...state.quests.filter(q => q.type !== "weekly"),
            ...newWeeklyQuests
          ]
        }));
      }
    }),
    {
      name: "quests-storage"
    }
  )
);
