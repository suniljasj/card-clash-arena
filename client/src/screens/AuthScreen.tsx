import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Alert, AlertDescription } from "../components/ui/alert";
import { LoadingSpinner } from "../components/ui/loading-spinner";
import { useAuth } from "../lib/stores/useAuth";
import { Sword, Shield, Zap } from "lucide-react";

interface AuthScreenProps {
  onSuccess: () => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const { login, register, error, setError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const success = await login(formData.username, formData.password);
    setIsLoading(false);

    if (success) {
      onSuccess();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const success = await register(formData.username, formData.email, formData.password);
    setIsLoading(false);

    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-950 via-purple-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/[0.05] rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/[0.08] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-amber-300/[0.08] rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Golden particles effect */}
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-amber-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-amber-300/60 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-2/3 left-2/3 w-1.5 h-1.5 bg-amber-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Elegant Logo */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            {/* Ornate border frame */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-3xl blur-xl" />
            <div className="relative bg-gradient-to-br from-black/80 via-purple-900/60 to-black/80 rounded-3xl border-4 border-amber-400/50 p-6 shadow-2xl" style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.2))' }}>
              <div className="flex items-center justify-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-lg" />
                  <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 rounded-full p-3 border-2 border-amber-300/50">
                    <Sword className="w-8 h-8 text-black" />
                  </div>
                  <Zap className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-pulse" style={{ animationDelay: '0s' }} />
                </div>
                
                <div className="text-center">
                  <h1 className="text-4xl font-bold bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">Card Clash</h1>
                  <h2 className="text-2xl font-bold bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">LEGENDS ARENA</h2>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-lg" />
                  <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 rounded-full p-3 border-2 border-amber-300/50">
                    <Shield className="w-8 h-8 text-black" />
                  </div>
                  <Zap className="w-4 h-4 text-amber-300 absolute -top-1 -left-1 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
              
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-amber-400/50" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-amber-400/50" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-amber-400/50" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-amber-400/50" />
            </div>
          </div>
          <p className="text-amber-200 text-lg font-medium">Enter the ultimate card battle arena</p>
        </div>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-black/70 via-purple-900/40 to-black/70 border-2 border-amber-400/30 rounded-2xl shadow-2xl" style={{ filter: 'drop-shadow(0 0 30px rgba(147, 51, 234, 0.2))' }}>
          <CardHeader>
            <CardTitle className="text-center text-amber-300 text-2xl font-bold">Welcome, Duelist</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-purple-900/50 border border-amber-400/30 rounded-xl p-1">
                <TabsTrigger 
                  value="login" 
                  className="text-amber-200 data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-500/20 data-[state=active]:to-amber-600/20 data-[state=active]:text-amber-300 data-[state=active]:border data-[state=active]:border-amber-400/50 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-400/20 rounded-lg transition-all duration-300 font-bold"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="text-amber-200 data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-500/20 data-[state=active]:to-amber-600/20 data-[state=active]:text-amber-300 data-[state=active]:border data-[state=active]:border-amber-400/50 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-400/20 rounded-lg transition-all duration-300 font-bold"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="login-username" className="text-amber-300 font-bold text-lg">Username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="bg-purple-900/30 border-2 border-amber-400/30 text-amber-300 placeholder:text-amber-200/50 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all duration-300 font-medium text-lg py-3"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="login-password" className="text-amber-300 font-bold text-lg">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="bg-purple-900/30 border-2 border-amber-400/30 text-amber-300 placeholder:text-amber-200/50 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all duration-300 font-medium text-lg py-3"
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-lg py-4 rounded-xl border-2 border-amber-400/50 shadow-xl transition-all duration-300 hover:scale-105"
                    style={{ filter: 'drop-shadow(0 10px 20px rgba(37, 99, 235, 0.3))' }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="small" className="mr-2" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="register-username" className="text-amber-300 font-bold text-lg">Username</Label>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="bg-purple-900/30 border-2 border-amber-400/30 text-amber-300 placeholder:text-amber-200/50 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all duration-300 font-medium text-lg py-3"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="register-email" className="text-amber-300 font-bold text-lg">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-purple-900/30 border-2 border-amber-400/30 text-amber-300 placeholder:text-amber-200/50 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all duration-300 font-medium text-lg py-3"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="register-password" className="text-amber-300 font-bold text-lg">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="bg-purple-900/30 border-2 border-amber-400/30 text-amber-300 placeholder:text-amber-200/50 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all duration-300 font-medium text-lg py-3"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirm-password" className="text-amber-300 font-bold text-lg">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="bg-purple-900/30 border-2 border-amber-400/30 text-amber-300 placeholder:text-amber-200/50 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all duration-300 font-medium text-lg py-3"
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold text-lg py-4 rounded-xl border-2 border-amber-400/50 shadow-xl transition-all duration-300 hover:scale-105"
                    style={{ filter: 'drop-shadow(0 10px 20px rgba(147, 51, 234, 0.3))' }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="small" className="mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-8 text-center">
              <p className="text-amber-200/80 text-lg font-medium">Join thousands of duelists in epic card battles!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
