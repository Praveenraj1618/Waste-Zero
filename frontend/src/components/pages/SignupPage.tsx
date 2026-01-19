import { useState } from "react";
import { signup } from "../../services/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Leaf, Building2, Truck } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { ImageWithFallback } from "../figma/ImageWithFallback";

type SignupPageProps = {
  onNavigate: (page: string) => void;
};

export function SignupPage({ onNavigate }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("volunteer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const availableSkills = [
    "Recycling",
    "Sorting",
    "Pickup Assistance",
    "Management",
    "Awareness Campaigns",
  ];

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSignup = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        // Default values for now since we removed them from form
        bio: "",
        location: "",
        skills: [],
      };

      await signup(payload);

      alert("Signup successful! Please login now.");

      onNavigate("login");
    } catch (err: any) {
      setError(err.message);
    }

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

            <h1 className="text-3xl mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Join our mission towards a greener future
            </p>
          </div>

          <div className="space-y-6">
            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>I am a...</Label>
              <div className="grid gap-3">
                <div
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${role === "volunteer"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:bg-muted/50"
                    }`}
                  onClick={() => setRole("volunteer")}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Volunteer</div>
                    <div className="text-sm text-muted-foreground">
                      Individual looking to help
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${role === "volunteer"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                        }`}
                    >
                      {role === "volunteer" && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${role === "ngo"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:bg-muted/50"
                    }`}
                  onClick={() => setRole("ngo")}
                >
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium">NGO Representative</div>
                    <div className="text-sm text-muted-foreground">
                      Organization managing pickups
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${role === "ngo"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                        }`}
                    >
                      {role === "ngo" && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${role === "pickup_agent"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:bg-muted/50"
                    }`}
                  onClick={() => setRole("pickup_agent")}
                >
                  <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center mr-4">
                    <Truck className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="font-medium">Pickup Agent</div>
                    <div className="text-sm text-muted-foreground">
                      Logistics and collection
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${role === "pickup_agent"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                        }`}
                    >
                      {role === "pickup_agent" && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSignup}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                className="text-primary hover:underline font-medium"
                onClick={() => onNavigate("login")}
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block relative bg-gradient-to-br from-primary to-secondary">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            alt="Signup background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="text-white text-center max-w-lg">
            <h2 className="text-4xl mb-6">
              Join the Movement for a Sustainable Future
            </h2>
            <p className="text-lg text-white/90">
              Become a part of WasteZero and turn awareness into real action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
