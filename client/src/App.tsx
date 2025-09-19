import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./lib/stores/useAuth";
import { usePlayer } from "./lib/stores/usePlayer";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";

// Import screens
import AuthScreen from "./screens/AuthScreen";
import LoadingScreen from "./screens/LoadingScreen";
import TutorialScreen from "./screens/TutorialScreen";
import DashboardScreen from "./screens/DashboardScreen";
import MatchmakingScreen from "./screens/MatchmakingScreen";
import BattleArenaScreen from "./screens/BattleArenaScreen";
import VictoryDefeatScreen from "./screens/VictoryDefeatScreen";
import CardCollectionScreen from "./screens/CardCollectionScreen";
import CardDetailScreen from "./screens/CardDetailScreen";
import DeckBuilderScreen from "./screens/DeckBuilderScreen";
import StoreScreen from "./screens/StoreScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import QuestsScreen from "./screens/QuestsScreen";

const queryClient = new QueryClient();

export type GameScreen = 
  | "auth" 
  | "loading" 
  | "tutorial" 
  | "dashboard" 
  | "matchmaking" 
  | "battle" 
  | "victory" 
  | "defeat"
  | "collection"
  | "card-detail"
  | "deck-builder"
  | "store"
  | "profile"
  | "settings"
  | "quests";

function App() {
  const { user, isAuthenticated } = useAuth();
  const { player, initializePlayer } = usePlayer();
  const [currentScreen, setCurrentScreen] = useState<GameScreen>("loading");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Initialize audio
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Load audio files
        const backgroundMusic = new Audio("/sounds/background.mp3");
        const hitSound = new Audio("/sounds/hit.mp3");
        const successSound = new Audio("/sounds/success.mp3");

        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.3;
        
        useAudio.getState().setBackgroundMusic(backgroundMusic);
        useAudio.getState().setHitSound(hitSound);
        useAudio.getState().setSuccessSound(successSound);
      } catch (error) {
        console.log("Audio initialization failed:", error);
      }
    };

    initAudio();
  }, []);

  // Handle screen transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        setCurrentScreen("auth");
      } else if (!player) {
        initializePlayer(user!);
        setCurrentScreen("dashboard");
      } else if (!player.hasCompletedTutorial) {
        setCurrentScreen("tutorial");
      } else {
        setCurrentScreen("dashboard");
      }
    }, 2000); // Show loading for 2 seconds

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, player, initializePlayer]);

  const navigateToScreen = (screen: GameScreen, cardId?: string) => {
    if (cardId) setSelectedCardId(cardId);
    setCurrentScreen(screen);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "loading":
        return <LoadingScreen />;
      case "auth":
        return <AuthScreen onSuccess={() => setCurrentScreen("dashboard")} />;
      case "tutorial":
        return <TutorialScreen onComplete={() => navigateToScreen("dashboard")} />;
      case "dashboard":
        return <DashboardScreen onNavigate={navigateToScreen} />;
      case "matchmaking":
        return <MatchmakingScreen onNavigate={navigateToScreen} />;
      case "battle":
        return <BattleArenaScreen onNavigate={navigateToScreen} />;
      case "victory":
        return <VictoryDefeatScreen type="victory" onNavigate={navigateToScreen} />;
      case "defeat":
        return <VictoryDefeatScreen type="defeat" onNavigate={navigateToScreen} />;
      case "collection":
        return <CardCollectionScreen onNavigate={navigateToScreen} />;
      case "card-detail":
        return <CardDetailScreen cardId={selectedCardId!} onNavigate={navigateToScreen} />;
      case "deck-builder":
        return <DeckBuilderScreen onNavigate={navigateToScreen} />;
      case "store":
        return <StoreScreen onNavigate={navigateToScreen} />;
      case "profile":
        return <ProfileScreen onNavigate={navigateToScreen} />;
      case "settings":
        return <SettingsScreen onNavigate={navigateToScreen} />;
      case "quests":
        return <QuestsScreen onNavigate={navigateToScreen} />;
      default:
        return <DashboardScreen onNavigate={navigateToScreen} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {renderCurrentScreen()}
      </div>
    </QueryClientProvider>
  );
}

export default App;
