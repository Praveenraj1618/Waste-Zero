import { useState } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  Package,
  Sparkles,
  BarChart3,
  Mail,
  Settings,
  Bell,
  CheckCircle2,
  MessageSquare,
  Recycle,
  Leaf,
  Plus,
  AlertCircle
} from "lucide-react";

type DashboardPageProps = {
  userRole: 'volunteer' | 'ngo' | 'admin';
  userName: string;
  onNavigate?: (page: string, id?: number) => void;
};

export function DashboardPage({ userRole, userName, onNavigate }: DashboardPageProps) {
  // If user is admin, redirect to admin dashboard
  if (userRole === 'admin') {
    onNavigate?.('admin-dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground">
            {userRole === 'volunteer' 
              ? "Here's your environmental impact dashboard"
              : "Manage your organization's waste management operations"
            }
          </p>
        </div>

        {userRole === 'volunteer' ? <VolunteerDashboard onNavigate={onNavigate} /> : <NGODashboard onNavigate={onNavigate} />}
      </div>
    </div>
  );
}

function VolunteerDashboard({ onNavigate }: { onNavigate?: (page: string, id?: number) => void }) {
  const upcomingPickups = [
    { id: 1, date: '2025-10-16', type: 'Recyclables', location: 'Home', status: 'confirmed' },
    { id: 2, date: '2025-10-20', type: 'E-waste', location: 'Office', status: 'pending' },
    { id: 3, date: '2025-10-25', type: 'Organic Waste', location: 'Home', status: 'confirmed' },
  ];

  const availableTasks = [
    { id: 1, title: 'Community Beach Cleanup', location: 'Coastal Area', date: '2025-10-18', volunteers: 12 },
    { id: 2, title: 'Recycling Drive', location: 'City Center', date: '2025-10-22', volunteers: 8 },
  ];

  const suggestedOpportunities = [
    { id: 1, title: 'E-Waste Collection Event', location: 'Tech District', date: '2025-11-20', match: 95, ngo: 'EcoWarriors' },
    { id: 2, title: 'Beach Cleanup Drive', location: 'Coastal Area', date: '2025-11-22', match: 88, ngo: 'Green Earth NGO' },
    { id: 3, title: 'Community Recycling Workshop', location: 'City Center', date: '2025-11-25', match: 82, ngo: 'Clean City Alliance' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pickups</p>
                <p className="text-2xl mt-1">24</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Waste Recycled</p>
                <p className="text-2xl mt-1">342 kg</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                <p className="text-2xl mt-1">156 kg</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Eco Score</p>
                <p className="text-2xl mt-1">8.5/10</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Section - NEW */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Recent Notifications
              </CardTitle>
              <CardDescription>Stay updated with new matches and messages</CardDescription>
            </div>
            <Badge className="bg-primary/10 text-primary">3 new</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div 
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer bg-primary/5"
              onClick={() => onNavigate?.('opportunities')}
            >
              <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm">New Match Found</p>
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Beach Cleanup Drive matches your skills
                </p>
                <p className="text-xs text-muted-foreground">5 min ago</p>
              </div>
            </div>

            <div 
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer bg-primary/5"
              onClick={() => onNavigate?.('messages')}
            >
              <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center mt-0.5">
                <MessageSquare className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm">New Message</p>
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Sarah Johnson sent you a message
                </p>
                <p className="text-xs text-muted-foreground">10 min ago</p>
              </div>
            </div>

            <div 
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer bg-primary/5"
              onClick={() => onNavigate?.('schedule-pickup')}
            >
              <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center mt-0.5">
                <Calendar className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm">Pickup Confirmed</p>
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Your pickup is scheduled for tomorrow
                </p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Schedule New Pickup */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Schedule New Pickup</CardTitle>
            <CardDescription>Book a waste collection at your convenience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border-2 border-dashed border-primary/30">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg mb-2">Ready to schedule a pickup?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose your waste type, select a date, and we'll handle the rest
                  </p>
                  <Button 
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => onNavigate?.('schedule-pickup')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Pickup
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Environmental Impact</CardTitle>
            <CardDescription>Your contribution this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Monthly Goal</span>
                <span className="text-primary">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Recycle className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Recyclables</p>
                  <p className="text-xs text-muted-foreground">145 kg this month</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Organic Waste</p>
                  <p className="text-xs text-muted-foreground">97 kg this month</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">E-waste</p>
                  <p className="text-xs text-muted-foreground">12 kg this month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Opportunities - NEW */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Suggested Opportunities For You
              </CardTitle>
              <CardDescription>Opportunities matching your skills and location</CardDescription>
            </div>
            {onNavigate && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigate('opportunities')}
              >
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {suggestedOpportunities.map((opportunity) => (
              <div 
                key={opportunity.id} 
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors relative cursor-pointer"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('opportunity-detail', opportunity.id);
                  }
                }}
              >
                <div className="absolute top-3 right-3">
                  <Badge className="bg-accent text-accent-foreground">
                    {opportunity.match}% Match
                  </Badge>
                </div>
                <h4 className="mb-2 pr-20">{opportunity.title}</h4>
                <p className="text-xs text-muted-foreground mb-3">{opportunity.ngo}</p>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{opportunity.date}</span>
                  </div>
                </div>
                <Button size="sm" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  if (onNavigate) {
                    onNavigate('opportunity-detail', opportunity.id);
                  }
                }}>
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Pickups & Available Tasks */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Scheduled Pickups */}
        <Card>
          <CardHeader>
            <CardTitle>My Scheduled Pickups</CardTitle>
            <CardDescription>Upcoming waste collection appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingPickups.map((pickup) => (
                <div key={pickup.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{pickup.type}</p>
                      <Badge variant={pickup.status === 'confirmed' ? 'default' : 'secondary'}>
                        {pickup.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {pickup.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {pickup.location}
                      </span>
                    </div>
                  </div>
                  {pickup.status === 'confirmed' && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Volunteer Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Available Volunteer Tasks</CardTitle>
                <CardDescription>Join community cleanup events</CardDescription>
              </div>
              {onNavigate && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigate('opportunities')}
                >
                  View All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableTasks.map((task) => (
                <div key={task.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h4 className="mb-2">{task.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {task.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {task.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {task.volunteers} joined
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Join Task
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NGODashboard({ onNavigate }: { onNavigate?: (page: string, id?: number) => void }) {
  const pickupRequests = [
    { id: 1, user: 'Sarah Johnson', type: 'Recyclables', location: 'Downtown', date: '2025-10-16', status: 'new' },
    { id: 2, user: 'Mike Chen', type: 'E-waste', location: 'Suburb', date: '2025-10-17', status: 'new' },
    { id: 3, user: 'Emily Davis', type: 'Organic', location: 'City Center', date: '2025-10-18', status: 'assigned' },
  ];

  const assignedPickups = [
    { id: 1, agent: 'John Worker', pickups: 5, status: 'active' },
    { id: 2, agent: 'Maria Garcia', pickups: 8, status: 'active' },
    { id: 3, agent: 'David Lee', pickups: 3, status: 'break' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl mt-1">12</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-2xl mt-1">8</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Handled</p>
                <p className="text-2xl mt-1">1,234 kg</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Impact Score</p>
                <p className="text-2xl mt-1">9.2/10</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Section - NEW */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Recent Notifications
              </CardTitle>
              <CardDescription>Stay updated with requests and messages</CardDescription>
            </div>
            <Badge className="bg-primary/10 text-primary">2 new</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div 
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer bg-primary/5"
              onClick={() => onNavigate?.('dashboard')}
            >
              <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center mt-0.5">
                <MessageSquare className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm">New Pickup Request</p>
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Sarah Johnson requested a recyclables pickup
                </p>
                <p className="text-xs text-muted-foreground">3 min ago</p>
              </div>
            </div>

            <div 
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer bg-primary/5"
              onClick={() => onNavigate?.('messages')}
            >
              <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm">Volunteer Application</p>
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Mike Chen applied for Beach Cleanup Drive
                </p>
                <p className="text-xs text-muted-foreground">15 min ago</p>
              </div>
            </div>

            <div 
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onNavigate?.('dashboard')}
            >
              <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center mt-0.5">
                <Package className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm">Pickup Completed</p>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Agent John Worker completed a pickup
                </p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Incoming Pickup Requests */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Incoming Pickup Requests</CardTitle>
            <CardDescription>New requests waiting for assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pickupRequests.map((request) => (
                <div key={request.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{request.user}</p>
                      <Badge variant={request.status === 'new' ? 'default' : 'secondary'}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>{request.type}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {request.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {request.date}
                      </span>
                    </div>
                  </div>
                  {request.status === 'new' && (
                    <Button size="sm">Assign Agent</Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Manage Agents
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics Report
            </Button>
            {onNavigate && (
              <Button 
                className="w-full justify-start bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => onNavigate('opportunities')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Manage Opportunities
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assigned Pickups & Impact */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Assigned Pickups Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Active Agents Overview</CardTitle>
            <CardDescription>Current agent status and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignedPickups.map((agent) => (
                <div key={agent.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{agent.agent}</p>
                    <p className="text-sm text-muted-foreground">
                      {agent.pickups} active pickups
                    </p>
                  </div>
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overall Impact & Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Impact & Analytics</CardTitle>
            <CardDescription>This month's performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Completion Rate</span>
                <span className="text-sm text-primary">94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl text-primary mb-1">245</p>
                <p className="text-xs text-muted-foreground">Pickups Completed</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl text-secondary mb-1">1,234</p>
                <p className="text-xs text-muted-foreground">kg Processed</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl text-accent mb-1">567</p>
                <p className="text-xs text-muted-foreground">kg CO₂ Saved</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl text-primary mb-1">4.8</p>
                <p className="text-xs text-muted-foreground">Avg. Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}