import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Calendar, MapPin, BarChart3, Users, Recycle, Leaf, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

type LandingPageProps = {
  onNavigate: (page: string) => void;
};

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">Join the Green Revolution</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
                Transforming Waste into a <span className="text-primary">Greener Future</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Your partner in sustainable waste management. Schedule pickups, track your environmental impact, 
                and join a community committed to a cleaner planet.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => onNavigate('signup')}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => onNavigate('login')}
                >
                  Learn More
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl md:text-3xl text-primary mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl text-primary mb-1">50K+</div>
                  <div className="text-sm text-muted-foreground">Pickups</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl text-primary mb-1">1M kg</div>
                  <div className="text-sm text-muted-foreground">Recycled</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1542800952-e5471ed41326?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGdyZWVuJTIwc3VzdGFpbmFibGUlMjBjaXR5fGVufDF8fHx8MTc2MDQ2MzcwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Clean green sustainable city - the future we're building"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Recycle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                    <div className="text-xl text-primary">250 tons</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Objective Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-6">What is WasteZero?</h2>
            <p className="text-lg text-muted-foreground">
              WasteZero is a digital platform designed to help users schedule waste pickups, 
              categorize recyclables, and promote responsible waste management. Pickup agents 
              are assigned intelligently based on location, ensuring efficient and sustainable 
              waste collection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mb-2">Easy Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  Book waste pickups at your convenience with our simple scheduling system.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="mb-2">Smart Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Intelligent location-based assignment of pickup agents for efficiency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <h3 className="mb-2">Eco-Impact Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your environmental contribution and see the difference you make.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(134, 194, 50, 0.1)' }}>
                  <Users className="w-6 h-6" style={{ color: '#86c232' }} />
                </div>
                <h3 className="mb-2">Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Join volunteers and NGOs working together for a cleaner planet.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <span className="text-2xl text-primary">1</span>
                <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-border"></div>
              </div>
              <h3 className="mb-2">Sign Up</h3>
              <p className="text-sm text-muted-foreground">
                Create your account as a volunteer or NGO representative
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <span className="text-2xl text-primary">2</span>
                <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-border"></div>
              </div>
              <h3 className="mb-2">Schedule Pickup</h3>
              <p className="text-sm text-muted-foreground">
                Book a convenient time for waste collection in your area
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">3</span>
              </div>
              <h3 className="mb-2">Make Impact</h3>
              <p className="text-sm text-muted-foreground">
                Track your contribution to a cleaner, greener environment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1563391508609-0f2c666f8c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NjA0NTkyOTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Eco-friendly background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of volunteers and organizations working towards a sustainable future. 
            Every pickup brings us closer to zero waste.
          </p>
          <Button 
            size="lg" 
            onClick={() => onNavigate('signup')}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Join WasteZero Today
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
