import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Edit, Trash2, UserPlus } from "lucide-react";
import { mockOpportunities, Opportunity } from "./OpportunityDashboardPage";

type OpportunityDetailPageProps = {
  opportunityId: number;
  userRole: 'volunteer' | 'ngo';
  onNavigate: (page: string, opportunityId?: number) => void;
};

export function OpportunityDetailPage({ opportunityId, userRole, onNavigate }: OpportunityDetailPageProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  // Find the opportunity from mock data
  const opportunity = mockOpportunities.find(opp => opp.id === opportunityId);

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2">Opportunity Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The opportunity you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => onNavigate('opportunities')}>
            Back to Opportunities
          </Button>
        </div>
      </div>
    );
  }

  // Simulating if this NGO created the opportunity
  // In a real app, you'd check if user.id === opportunity.createdBy
  const isCreator = userRole === 'ngo';

  const handleDelete = () => {
    // In a real app, this would call an API to delete
    console.log('Deleting opportunity:', opportunityId);
    setShowDeleteDialog(false);
    onNavigate('opportunities');
  };

  const handleJoin = () => {
    // In a real app, this would call an API to join
    console.log('Joining opportunity:', opportunityId);
    setIsJoined(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('opportunities')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </button>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="aspect-[16/9] overflow-hidden rounded-xl">
              <ImageWithFallback
                src={opportunity.image}
                alt={opportunity.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title and Status */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <h1 className="flex-1">{opportunity.title}</h1>
                <Badge 
                  variant={opportunity.status === 'Open' ? 'default' : 'secondary'}
                  className={`${opportunity.status === 'Open' ? 'bg-primary' : ''} text-sm px-4 py-1`}
                >
                  {opportunity.status}
                </Badge>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h3>About This Opportunity</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {opportunity.description}
                </p>
              </div>
            </div>

            {/* Required Skills */}
            {opportunity.requiredSkills.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.requiredSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-primary/10 text-primary px-4 py-2 rounded-full"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons - Mobile */}
            <div className="lg:hidden space-y-3">
              {userRole === 'volunteer' ? (
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handleJoin}
                  disabled={isJoined || opportunity.status !== 'Open'}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isJoined ? 'Joined' : 'Join Opportunity'}
                </Button>
              ) : isCreator ? (
                <>
                  <Button
                    className="w-full"
                    onClick={() => onNavigate('edit-opportunity', opportunityId)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Opportunity
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Opportunity
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Opportunity Details Card */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4">Opportunity Details</h3>
                
                <div className="space-y-4">
                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p>{opportunity.date}</p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p>{opportunity.duration}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p>{opportunity.location}</p>
                    </div>
                  </div>

                  {/* Volunteers */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Volunteers</p>
                      <p>{opportunity.volunteersJoined} joined</p>
                    </div>
                  </div>

                  {/* Posted By */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Posted by</p>
                    <p className="text-primary">{opportunity.postedBy}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons - Desktop */}
            <div className="hidden lg:block space-y-3">
              {userRole === 'volunteer' ? (
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handleJoin}
                  disabled={isJoined || opportunity.status !== 'Open'}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isJoined ? 'Joined' : 'Join Opportunity'}
                </Button>
              ) : isCreator ? (
                <>
                  <Button
                    className="w-full"
                    onClick={() => onNavigate('edit-opportunity', opportunityId)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Opportunity
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Opportunity
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the opportunity "{opportunity.title}" 
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
