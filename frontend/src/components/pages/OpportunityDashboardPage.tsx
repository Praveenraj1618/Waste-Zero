import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Plus,
  Search,
  MapPin,
  Calendar,
  Clock,
  Users,
  Filter,
} from "lucide-react";

import { listOpportunities } from "../../services/api";

type OpportunityDashboardPageProps = {
  userRole: "volunteer" | "ngo";
  onNavigate: (page: string, opportunityId?: string) => void;
};

type Opportunity = {
  _id: string;
  title: string;
  description: string;
  date?: string;
  duration?: string;
  location?: string;
  requiredSkills?: string[];
  status?: string;
  imageUrl?: string;
  organization?: any;
  volunteers?: any[];
};

export function OpportunityDashboardPage({
  userRole,
  onNavigate,
}: OpportunityDashboardPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch opportunities from backend
  useEffect(() => {
    loadOpportunities();
  }, []);

  async function loadOpportunities() {
    setLoading(true);
    setError("");

    try {
      const res = await listOpportunities();
      setOpportunities(res.data);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  // Apply search and filter
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      (opp.status || "Open").toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Volunteer Opportunities</h1>
          <p className="text-muted-foreground">
            Discover meaningful ways to contribute to environmental conservation
            and waste management
          </p>
        </div>

        {/* Controls Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Create Opportunity Button - Only for NGOs */}
          {userRole === "ngo" && (
            <Button
              onClick={() => onNavigate("create-opportunity")}
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
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {loading && <p>Loading opportunities...</p>}

        {/* Error State */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Opportunity Cards */}
        {!loading && filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <Card
                key={opportunity._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={
                      opportunity.imageUrl
                        ? `http://localhost:5000${opportunity.imageUrl}`
                        : "https://placehold.co/600x400"
                    }
                    alt={opportunity.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="flex-1 pr-2">{opportunity.title}</h3>

                    <Badge
                      variant="default"
                      className={
                        opportunity.status === "open" ? "bg-primary" : ""
                      }
                    >
                      {opportunity.status || "Open"}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {opportunity.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{opportunity.date || "Not set"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span>{opportunity.location || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-accent" />
                      <span>{opportunity.duration || "--"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      <span>
                        {opportunity.volunteers?.length || 0} volunteers joined
                      </span>
                    </div>
                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="p-5 pt-0">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      onNavigate("opportunity-detail", opportunity._id)
                    }
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="mb-2">No opportunities found</h2>
              <p className="text-muted-foreground text-center mb-6">
                No opportunities match your current search criteria. Try
                adjusting your filters.
              </p>

              {(searchQuery || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
