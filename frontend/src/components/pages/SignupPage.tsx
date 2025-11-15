import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Leaf, User, Building2 } from "lucide-react";

type SignupPageProps = {
  onSignup: (name: string, email: string, password: string, role: 'volunteer' | 'ngo') => void;
  onNavigate: (page: string) => void;
};

export function SignupPage({ onSignup, onNavigate }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<'volunteer' | 'ngo'>('volunteer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    onSignup(name, email, password, role);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Side - Image */}
      <div className="hidden md:block relative bg-gradient-to-br from-secondary to-primary">
        <div className="absolute inset-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1627072586323-aafafbf84c4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGVhcnRoJTIwZW52aXJvbm1lbnR8ZW58MXx8fHwxNzYwNDU5MjkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Clean earth environment"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="text-white text-center max-w-lg">
            <h2 className="text-4xl mb-6">
              Start Your Green Journey Today
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join our growing community of volunteers and organizations dedicated 
              to creating a waste-free, sustainable world.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl mb-4">Why Join WasteZero?</h3>
              <ul className="text-left space-y-3 text-white/90">
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>Schedule waste pickups effortlessly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>Track your environmental impact</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>Connect with like-minded eco-warriors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>Make a real difference in your community</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-primary rounded-lg rotate-45"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white z-10" fill="currentColor" />
                </div>
              </div>
              <span className="text-xl font-bold text-primary">WasteZero</span>
            </div>
            
            <h1 className="text-3xl mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Join the movement for a cleaner, greener planet
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            <div className="space-y-3">
              <Label>I am a...</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as 'volunteer' | 'ngo')}>
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="volunteer" id="volunteer" />
                  <Label htmlFor="volunteer" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Volunteer</div>
                      <div className="text-sm text-muted-foreground">Individual looking to help</div>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="ngo" id="ngo" />
                  <Label htmlFor="ngo" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium">NGO Representative</div>
                      <div className="text-sm text-muted-foreground">Organization managing pickups</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Account
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-primary hover:underline"
              >
                Log In
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
