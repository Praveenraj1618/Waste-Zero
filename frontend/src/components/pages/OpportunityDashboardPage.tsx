import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Plus, Search, MapPin, Calendar, Clock, Users, Filter } from "lucide-react";

type OpportunityDashboardPageProps = {
  userRole: 'volunteer' | 'ngo';
  onNavigate: (page: string, opportunityId?: number) => void;
};

type Opportunity = {
  id: number;
  title: string;
  description: string;
  date: string;
  duration: string;
  location: string;
  requiredSkills: string[];
  status: 'Open' | 'Closed' | 'In Progress';
  image: string;
  postedBy: string;
  volunteersJoined: number;
};

const mockOpportunities: Opportunity[] = [
  {
    id: 1,
    title: "Beach Cleanup Drive",
    description: "Join us for a community beach cleanup to protect marine life and keep our coastlines pristine.",
    date: "2025-10-22",
    duration: "3 hours",
    location: "Coastal Beach Park",
    requiredSkills: ["Physical Fitness", "Teamwork"],
    status: "Open",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGNsZWFudXAlMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc2MDUyMjcwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    postedBy: "Ocean Conservation NGO",
    volunteersJoined: 24
  },
  {
    id: 2,
    title: "Community Garden Planting",
    description: "Help us create a sustainable community garden where neighbors can grow fresh, organic produce together.",
    date: "2025-10-25",
    duration: "4 hours",
    location: "Green Valley Community Center",
    requiredSkills: ["Gardening", "Communication"],
    status: "Open",
    image: "https://images.unsplash.com/photo-1634142954683-034b0ad145ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXJkZW4lMjBwbGFudGluZ3xlbnwxfHx8fDE3NjA1NTM3NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    postedBy: "Green Earth Initiative",
    volunteersJoined: 15
  },
  {
    id: 3,
    title: "Recycling Center Assistance",
    description: "Support our recycling efforts by helping sort materials and educate visitors about proper waste separation.",
    date: "2025-10-28",
    duration: "5 hours",
    location: "City Recycling Center",
    requiredSkills: ["Attention to Detail", "Customer Service"],
    status: "Open",
    image: "https://images.unsplash.com/photo-1705164686320-cf877bf7f338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjBjZW50ZXIlMjBzb3J0aW5nfGVufDF8fHx8MTc2MDYzNDMyMHww&ixlib=rb-4.1.0&q=80&w=1080",
    postedBy: "Waste Management Alliance",
    volunteersJoined: 8
  },
  {
    id: 4,
    title: "Urban Tree Planting Initiative",
    description: "Join our mission to increase green cover in the city by planting native trees in designated urban areas.",
    date: "2025-11-02",
    duration: "3 hours per session",
    location: "Downtown Urban Park",
    requiredSkills: ["Physical Fitness", "Environmental Awareness"],
    status: "Open",
    image: "https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc2MDYwODk1NHww&ixlib=rb-4.1.0&q=80&w=1080",
    postedBy: "Urban Forestry Council",
    volunteersJoined: 31
  },
  {
    id: 5,
    title: "River Bank Restoration",
    description: "Help restore the natural habitat along our river banks by removing invasive species and planting native vegetation.",
    date: "2025-11-05",
    duration: "4 hours",
    location: "Riverside Nature Reserve",
    requiredSkills: ["Outdoor Work", "Teamwork"],
    status: "In Progress",
    image: "https://images.unsplash.com/photo-1758599669064-89f1ffe5c8d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlciUyMGNsZWFudXAlMjBlbnZpcm9ubWVudGFsfGVufDF8fHx8MTc2MDYzNDMyMXww&ixlib=rb-4.1.0&q=80&w=1080",
    postedBy: "Water Conservation Society",
    volunteersJoined: 18
  },
  {
    id: 6,
    title: "Park Cleanup & Maintenance",
    description: "Regular maintenance and cleanup of our neighborhood park to keep it beautiful and safe for everyone.",
    date: "2025-11-08",
    duration: "2 hours",
    location: "Sunset Park",
    requiredSkills: ["General Maintenance", "Reliability"],
    status: "Open",
    image: "https://images.unsplash.com/photo-1590572384030-ab33d45912d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHBhcmslMjBjbGVhbnVwfGVufDF8fHx8MTc2MDYzNDMyMXww&ixlib=rb-4.1.0&q=80&w=1080",
    postedBy: "Parks & Recreation Dept",
    volunteersJoined: 12
  }
];

export function OpportunityDashboardPage({ userRole, onNavigate }: OpportunityDashboardPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || opp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Volunteer Opportunities</h1>
          <p className="text-muted-foreground">
            Discover meaningful ways to contribute to environmental conservation and waste management
          </p>
        </div>

        {/* Controls Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Create Opportunity Button - Only for NGOs */}
          {userRole === 'ngo' && (
            <Button
              onClick={() => onNavigate('create-opportunity')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground md:order-last"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Opportunity
            </Button>
          )}

          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-input-background"
            />
          </div>

          {/* Filter Dropdown */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-input-background">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Opportunity Cards Grid */}
        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={opportunity.image}
                    alt={opportunity.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="flex-1 pr-2">{opportunity.title}</h3>
                    <Badge 
                      variant={opportunity.status === 'Open' ? 'default' : 'secondary'}
                      className={opportunity.status === 'Open' ? 'bg-primary' : ''}
                    >
                      {opportunity.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {opportunity.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{opportunity.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-accent" />
                      <span>{opportunity.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{opportunity.volunteersJoined} volunteers joined</span>
                    </div>
                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="p-5 pt-0">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onNavigate('opportunity-detail', opportunity.id)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2">No opportunities found</h2>
            <p className="text-muted-foreground text-center mb-6">
              No opportunities match your current search criteria. Try adjusting your filters.
            </p>
            {searchQuery || statusFilter !== "all" ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

// Export mock data for use in other components
export { mockOpportunities };
export type { Opportunity };
