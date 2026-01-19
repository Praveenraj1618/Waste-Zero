import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Leaf,
  Trash2,
  Edit,
} from "lucide-react";

import {
  getOpportunity,
  joinOpportunity,
  deleteOpportunity,
} from "../../services/api";

type OpportunityDetailPageProps = {
  opportunityId: string;
  userRole: "volunteer" | "ngo";
  onNavigate: (page: string) => void;
};

export function OpportunityDetailPage({
  opportunityId,
  userRole,
  onNavigate,
}: OpportunityDetailPageProps) {
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOpportunity();
  }, [opportunityId]);

  async function loadOpportunity() {
    setLoading(true);
    setError("");

    try {
      const data = await getOpportunity(opportunityId);
      setOpportunity(data);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  async function handleJoin() {
    try {
      await joinOpportunity(opportunityId);
      alert("You joined this opportunity!");
      loadOpportunity();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this opportunity?")) return;

    try {
      await deleteOpportunity(opportunityId);
      alert("Deleted successfully");
      onNavigate("dashboard");
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) return <div className="p-8">Loading…</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!opportunity) return <div className="p-8">Opportunity not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => onNavigate("dashboard")}
        >
          ← Back
        </Button>

        <Card className="overflow-hidden">
          {/* Image Section */}
          <div className="aspect-[4/2] overflow-hidden">
            <ImageWithFallback
              src={
                opportunity.imageUrl
                  ? `http://localhost:5000${opportunity.imageUrl}`
                  : "https://placehold.co/1200x600"
              }
              alt={opportunity.title}
              className="w-full h-full object-cover"
            />
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <h1 className="text-3xl mb-2">{opportunity.title}</h1>

              <Badge
                variant="default"
                className={
                  opportunity.status === "open"
                    ? "bg-primary"
                    : "bg-secondary text-secondary-foreground"
                }
              >
                {opportunity.status || "open"}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-lg">
              {opportunity.description}
            </p>

            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-5 h-5 text-primary" />
                <span>{opportunity.date || "Not set"}</span>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="w-5 h-5 text-accent" />
                <span>{opportunity.duration || "--"}</span>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>{opportunity.location || "Unknown"}</span>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Users className="w-5 h-5 text-primary" />
                <span>
                  {opportunity.volunteers?.length || 0} volunteers joined
                </span>
              </div>
            </div>

            {/* Required Skills */}
            {opportunity.requiredSkills?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.requiredSkills.map((skill: string, i: number) => (
                    <Badge key={i} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              {/* Volunteer Action */}
              {userRole === "volunteer" && (
                <Button
                  className="w-full"
                  disabled={opportunity.status !== "open"}
                  onClick={handleJoin}
                >
                  Join Opportunity
                </Button>
              )}

              {/* NGO Actions */}
              {userRole === "ngo" && (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      onNavigate("edit-opportunity", opportunity._id)
                    }
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
