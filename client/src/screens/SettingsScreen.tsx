import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Navigation } from "../components/game/Navigation";
import { useAuth } from "../lib/stores/useAuth";
import { useAudio } from "../lib/stores/useAudio";
import { GameScreen } from "../App";
import { 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff,
  Globe,
  Palette,
  Shield,
  LogOut,
  Settings,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  AlertTriangle,
  Save,
  RotateCcw
} from "lucide-react";

interface SettingsScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

interface SettingsState {
  // Audio Settings
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  
  // Notification Settings
  pushNotifications: boolean;
  emailNotifications: boolean;
  questReminders: boolean;
  battleInvites: boolean;
  
  // Display Settings
  theme: "dark" | "light" | "auto";
  language: string;
  showAnimations: boolean;
  lowPowerMode: boolean;
  
  // Gameplay Settings
  autoEndTurn: boolean;
  quickPlay: boolean;
  showCardTooltips: boolean;
  confirmActions: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  masterVolume: 80,
  musicVolume: 60,
  sfxVolume: 80,
  isMuted: false,
  pushNotifications: true,
  emailNotifications: true,
  questReminders: true,
  battleInvites: true,
  theme: "dark",
  language: "en",
  showAnimations: true,
  lowPowerMode: false,
  autoEndTurn: false,
  quickPlay: false,
  showCardTooltips: true,
  confirmActions: true
};

export default function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const { logout } = useAuth();
  const { isMuted, toggleMute } = useAudio();
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateSetting = <K extends keyof SettingsState>(
    key: K, 
    value: SettingsState[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const saveSettings = () => {
    // Here you would save settings to localStorage or backend
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    setHasUnsavedChanges(false);
    
    // Apply audio settings
    if (settings.isMuted !== isMuted) {
      toggleMute();
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasUnsavedChanges(true);
  };

  const handleLogout = () => {
    logout();
    onNavigate("auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Settings className="w-8 h-8" />
            Settings
          </h1>
          <p className="text-gray-300">Customize your game experience</p>
        </div>

        {/* Unsaved Changes Alert */}
        {hasUnsavedChanges && (
          <Alert className="mb-6 border-yellow-500/30 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              You have unsaved changes. Don't forget to save your settings!
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Audio Settings */}
          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-blue-400" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Master Mute */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.isMuted ? (
                    <VolumeX className="w-5 h-5 text-red-400" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-green-400" />
                  )}
                  <div>
                    <label className="text-white font-semibold">Master Audio</label>
                    <p className="text-sm text-gray-400">Enable or disable all game audio</p>
                  </div>
                </div>
                <Switch
                  checked={!settings.isMuted}
                  onCheckedChange={(checked) => updateSetting('isMuted', !checked)}
                />
              </div>

              {/* Volume Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-white">Master Volume</label>
                    <span className="text-gray-400">{settings.masterVolume}%</span>
                  </div>
                  <Slider
                    value={[settings.masterVolume]}
                    onValueChange={([value]) => updateSetting('masterVolume', value)}
                    max={100}
                    step={1}
                    disabled={settings.isMuted}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-white">Music Volume</label>
                    <span className="text-gray-400">{settings.musicVolume}%</span>
                  </div>
                  <Slider
                    value={[settings.musicVolume]}
                    onValueChange={([value]) => updateSetting('musicVolume', value)}
                    max={100}
                    step={1}
                    disabled={settings.isMuted}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-white">Sound Effects</label>
                    <span className="text-gray-400">{settings.sfxVolume}%</span>
                  </div>
                  <Slider
                    value={[settings.sfxVolume]}
                    onValueChange={([value]) => updateSetting('sfxVolume', value)}
                    max={100}
                    step={1}
                    disabled={settings.isMuted}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-green-400" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-semibold">Push Notifications</label>
                  <p className="text-sm text-gray-400">Receive notifications on your device</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-semibold">Email Notifications</label>
                  <p className="text-sm text-gray-400">Receive game updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-semibold">Quest Reminders</label>
                  <p className="text-sm text-gray-400">Get reminded about daily quests</p>
                </div>
                <Switch
                  checked={settings.questReminders}
                  onCheckedChange={(checked) => updateSetting('questReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-semibold">Battle Invites</label>
                  <p className="text-sm text-gray-400">Notifications for friend battle requests</p>
                </div>
                <Switch
                  checked={settings.battleInvites}
                  onCheckedChange={(checked) => updateSetting('battleInvites', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Monitor className="w-5 h-5 text-purple-400" />
                Display & Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-semibold">Theme</label>
                  <p className="text-sm text-gray-400">Choose your preferred theme</p>
                </div>
                <Select
                  value={settings.theme}
                  onValueChange={(value: "dark" | "light" | "auto") => updateSetting('theme', value)}
                >
                  <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="auto">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Auto
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-semibold">Language</label>
                  <p className="text-sm text-gray-400">Select your preferred language</p>
                </div>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSetting('language', value)}
                >
                  <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="it">Italiano</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-semibold">Animations</label>
                  <p className="text-sm text-gray-400">Enable card and battle animations</p>
                </div>
                <Switch
                  checked={settings.showAnimations}
                  onCheckedChange={(checked) => updateSetting('showAnimations', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-semibold">Low Power Mode</label>
                  <p className="text-sm text-gray-400">Reduce visual effects to save battery</p>
                </div>
                <Switch
                  checked={settings.lowPowerMode}
                  onCheckedChange={(checked) => updateSetting('lowPowerMode', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gameplay Settings */}
          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-400" />
                Gameplay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-semibold">Auto End Turn</label>
                  <p className="text-sm text-gray-400">Automatically end turn when no actions available</p>
                </div>
                <Switch
                  checked={settings.autoEndTurn}
                  onCheckedChange={(checked) => updateSetting('autoEndTurn', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-semibold">Quick Play</label>
                  <p className="text-sm text-gray-400">Speed up animations and transitions</p>
                </div>
                <Switch
                  checked={settings.quickPlay}
                  onCheckedChange={(checked) => updateSetting('quickPlay', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-semibold">Card Tooltips</label>
                  <p className="text-sm text-gray-400">Show detailed card information on hover</p>
                </div>
                <Switch
                  checked={settings.showCardTooltips}
                  onCheckedChange={(checked) => updateSetting('showCardTooltips', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-semibold">Confirm Actions</label>
                  <p className="text-sm text-gray-400">Ask for confirmation on important actions</p>
                </div>
                <Switch
                  checked={settings.confirmActions}
                  onCheckedChange={(checked) => updateSetting('confirmActions', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={saveSettings}
              disabled={!hasUnsavedChanges}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>

            <Button
              onClick={resetSettings}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Logout Section */}
          <Card className="bg-red-900/20 backdrop-blur-sm border-red-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <LogOut className="w-5 h-5 text-red-400" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-semibold">Logout</label>
                  <p className="text-sm text-gray-400">Sign out of your account</p>
                </div>
                <Button
                  onClick={() => setShowLogoutConfirm(true)}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-black/90 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Confirm Logout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Are you sure you want to logout? Any unsaved settings will be lost.
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Navigation currentScreen="settings" onNavigate={onNavigate} />
    </div>
  );
}
