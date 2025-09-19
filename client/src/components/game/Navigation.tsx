import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Home, 
  Sword, 
  Book, 
  ShoppingCart, 
  User, 
  Settings, 
  Trophy,
  ArrowLeft
} from "lucide-react";
import { GameScreen } from "../../App";

interface NavigationProps {
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  canGoBack?: boolean;
  notifications?: Record<string, number>;
}

export function Navigation({ 
  currentScreen, 
  onNavigate, 
  canGoBack = false,
  notifications = {}
}: NavigationProps) {
  const navItems = [
    { screen: "dashboard" as const, icon: Home, label: "Home" },
    { screen: "matchmaking" as const, icon: Sword, label: "Battle" },
    { screen: "collection" as const, icon: Book, label: "Cards" },
    { screen: "store" as const, icon: ShoppingCart, label: "Store" },
    { screen: "quests" as const, icon: Trophy, label: "Quests" },
    { screen: "profile" as const, icon: User, label: "Profile" },
    { screen: "settings" as const, icon: Settings, label: "Settings" }
  ];

  const isBottomNav = ["dashboard", "collection", "deck-builder", "store", "profile", "quests", "settings"].includes(currentScreen);

  if (!isBottomNav && canGoBack) {
    return (
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("dashboard")}
          className="bg-black/50 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    );
  }

  if (!isBottomNav) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/20">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map(({ screen, icon: Icon, label }) => {
          const isActive = currentScreen === screen;
          const notificationCount = notifications[screen];

          return (
            <Button
              key={screen}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate(screen)}
              className={`flex flex-col items-center gap-1 p-2 h-auto relative ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
              
              {notificationCount && notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
