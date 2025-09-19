import { LoadingSpinner } from "../components/ui/loading-spinner";
import { Sword, Shield, Zap, Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [loadingText, setLoadingText] = useState("Initializing Card Clash Arena...");
  const [progress, setProgress] = useState(0);

  const loadingSteps = [
    "Initializing Card Clash Arena...",
    "Loading card database...",
    "Connecting to battle servers...", 
    "Preparing your arsenal...",
    "Ready for battle!"
  ];

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      if (step < loadingSteps.length - 1) {
        step++;
        setLoadingText(loadingSteps[step]);
        setProgress((step / (loadingSteps.length - 1)) * 100);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl animate-pulse delay-2000" />
        
        {/* Floating Icons */}
        <div className="absolute top-20 left-20 animate-bounce delay-100">
          <Sword className="w-8 h-8 text-blue-400/60" />
        </div>
        <div className="absolute top-32 right-32 animate-bounce delay-300">
          <Shield className="w-8 h-8 text-green-400/60" />
        </div>
        <div className="absolute bottom-32 left-32 animate-bounce delay-500">
          <Zap className="w-8 h-8 text-yellow-400/60" />
        </div>
        <div className="absolute bottom-20 right-20 animate-bounce delay-700">
          <Star className="w-8 h-8 text-purple-400/60" />
        </div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <Sword className="w-12 h-12 text-blue-400" />
            <Zap className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-white tracking-wider">
            Card Clash Arena
          </h1>
          <div className="relative">
            <Shield className="w-12 h-12 text-green-400" />
            <Star className="w-6 h-6 text-purple-400 absolute -top-1 -left-1 animate-pulse" />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-12">
          The Ultimate Card Battle Experience
        </p>

        {/* Loading Spinner */}
        <div className="mb-8">
          <LoadingSpinner size="large" />
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-6">
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-400 text-lg animate-pulse">
          {loadingText}
        </p>

        {/* Game Features Preview */}
        <div className="mt-12 grid grid-cols-2 gap-6 max-w-md mx-auto">
          <div className="text-center">
            <Sword className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Epic Battles</p>
          </div>
          <div className="text-center">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Strategic Decks</p>
          </div>
          <div className="text-center">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Powerful Spells</p>
          </div>
          <div className="text-center">
            <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Legendary Cards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
