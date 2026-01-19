import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Leaf } from "lucide-react";

type LoginPageProps = {
  onLogin: (email: string, password: string) => void;
  onNavigate: (page: string) => void;
};

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // FORM SUBMIT HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-primary rounded-lg rotate-45"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf
                    className="w-6 h-6 text-white z-10"
                    fill="currentColor"
                  />
                </div>
              </div>
              <span className="text-xl font-bold text-primary">WasteZero</span>
            </div>

            <h1 className="text-3xl mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Login to continue your journey towards a greener future
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <label
                  htmlFor="remember"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            {/* LOGIN BUTTON */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate("signup")}
                className="text-primary hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block relative bg-gradient-to-br from-primary to-secondary">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1637681262973-a516e647e826?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjB3YXN0ZSUyMG1hbmFnZW1lbnR8ZW58MXx8fHwxNzYwMzczNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Recycling and waste management"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="text-white text-center max-w-lg">
            <h2 className="text-4xl mb-6">Transform Waste into Opportunity</h2>
            <p className="text-lg text-white/90">
              Join our community of eco-warriors making a real difference. Every
              login brings us closer to a sustainable future.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl mb-2">500+</div>
                <div className="text-sm text-white/80">Active Users</div>
              </div>
              <div>
                <div className="text-3xl mb-2">50K+</div>
                <div className="text-sm text-white/80">Pickups</div>
              </div>
              <div>
                <div className="text-3xl mb-2">1M kg</div>
                <div className="text-sm text-white/80">Recycled</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
