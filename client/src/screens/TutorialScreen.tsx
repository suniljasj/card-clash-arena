import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { usePlayer } from "../lib/stores/usePlayer";
import { CardComponent } from "../components/ui/card-component";
import { CARDS } from "../data/cards";
import { 
  Sword, 
  Shield, 
  Zap, 
  Target, 
  ArrowRight, 
  CheckCircle,
  Play
} from "lucide-react";

interface TutorialScreenProps {
  onComplete: () => void;
}

const tutorialSteps = [
  {
    id: 1,
    title: "Welcome to Card Clash Arena!",
    description: "Learn the basics of card combat and become a master duelist.",
    icon: Sword,
    content: "In Card Clash Arena, you battle opponents using powerful cards. Each card has unique abilities that can turn the tide of battle!"
  },
  {
    id: 2,
    title: "Understanding Cards",
    description: "Every card has important stats that determine its power.",
    icon: Shield,
    content: "Cards have Mana Cost (blue gem), Attack (red), and Health (green). Creatures fight, spells have instant effects!"
  },
  {
    id: 3,
    title: "Mana System",
    description: "Mana is your resource for playing cards.",
    icon: Zap,
    content: "You start with 1 mana and gain 1 more each turn (up to 10). Spend mana wisely to play your cards at the right time!"
  },
  {
    id: 4,
    title: "Combat Basics",
    description: "Learn how creatures battle each other.",
    icon: Target,
    content: "Creatures can attack other creatures or the enemy player directly. When creatures fight, they deal damage equal to their attack!"
  },
  {
    id: 5,
    title: "Victory Conditions",
    description: "Reduce your opponent's health to 0 to win!",
    icon: CheckCircle,
    content: "Players start with 30 health. Use creatures and spells strategically to defeat your opponent before they defeat you!"
  }
];

export default function TutorialScreen({ onComplete }: TutorialScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeTutorial } = usePlayer();

  const currentTutorial = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial complete
      completeTutorial();
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeTutorial();
    onComplete();
  };

  const sampleCard = CARDS[0]; // Basic warrior for demonstration

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tutorial</h1>
          <p className="text-gray-300">Master the art of card combat</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {tutorialSteps.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Tutorial Content */}
        <Card className="backdrop-blur-sm bg-black/60 border-white/20 mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <currentTutorial.icon className="w-8 h-8 text-blue-400" />
              <CardTitle className="text-white">{currentTutorial.title}</CardTitle>
            </div>
            <p className="text-gray-300">{currentTutorial.description}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-200 text-lg leading-relaxed">
                {currentTutorial.content}
              </p>
            </div>

            {/* Interactive Examples */}
            {currentStep === 1 && (
              <div className="flex justify-center">
                <CardComponent 
                  card={sampleCard} 
                  size="large"
                  className="mx-auto"
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex justify-center">
                <div className="relative">
                  <CardComponent 
                    card={sampleCard} 
                    size="large"
                  />
                  
                  {/* Annotations */}
                  <div className="absolute -top-8 -left-4 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    Mana Cost: {sampleCard.manaCost}
                  </div>
                  <div className="absolute -bottom-12 -left-4 bg-red-600 text-white px-2 py-1 rounded text-xs">
                    Attack: {sampleCard.attack}
                  </div>
                  <div className="absolute -bottom-12 -right-4 bg-green-600 text-white px-2 py-1 rounded text-xs">
                    Health: {sampleCard.health}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-gray-300">Mana Cost</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-red-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Sword className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-gray-300">Attack</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-gray-300">Health</p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                    <h4 className="text-blue-400 font-bold mb-2">Creatures</h4>
                    <p className="text-sm text-gray-300">Fight on the battlefield with Attack and Health</p>
                  </div>
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                    <h4 className="text-purple-400 font-bold mb-2">Spells</h4>
                    <p className="text-sm text-gray-300">Instant effects that happen immediately</p>
                  </div>
                  <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
                    <h4 className="text-green-400 font-bold mb-2">Support</h4>
                    <p className="text-sm text-gray-300">Ongoing effects that help your strategy</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center">
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((mana, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                        index < 3 
                          ? "bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/50" 
                          : "bg-gray-700 border-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-300">Turn 3: You have 3 mana crystals available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="bg-black/50 border-white/20 text-white hover:bg-white/20"
              >
                Previous
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleSkip}
              className="bg-black/50 border-white/20 text-white hover:bg-white/20"
            >
              Skip Tutorial
            </Button>
          </div>

          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {currentStep === tutorialSteps.length - 1 ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Playing!
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
