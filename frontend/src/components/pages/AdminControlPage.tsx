import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { 
  ArrowLeft, 
  Search, 
  UserX, 
  Trash2,
  Shield,
  AlertTriangle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from "sonner";

type AdminControlPageProps = {
  onNavigate?: (page: string) => void;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
};

type Opportunity = {
  id: number;
  title: string;
  ngo: string;
  status: string;
  volunteers: number;
  posted: string;
};

type Application = {
  id: number;
  volunteer: string;
  opportunity: string;
  skills: string;
  status: string;
  applied: string;
};

const mockUsers: User[] = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', role: 'Volunteer', status: 'Active', joined: '2025-10-15' },
  { id: 2, name: 'Green Earth NGO', email: 'contact@greenearth.org', role: 'NGO', status: 'Active', joined: '2025-09-22' },
  { id: 3, name: 'Mike Chen', email: 'mike@email.com', role: 'Volunteer', status: 'Active', joined: '2025-10-28' },
  { id: 4, name: 'EcoWarriors', email: 'info@ecowarriors.org', role: 'NGO', status: 'Active', joined: '2025-08-10' },
  { id: 5, name: 'Emily Davis', email: 'emily@email.com', role: 'Volunteer', status: 'Suspended', joined: '2025-11-01' },
  { id: 6, name: 'John Worker', email: 'john@email.com', role: 'Volunteer', status: 'Active', joined: '2025-09-05' },
];

const mockOpportunities: Opportunity[] = [
  { id: 1, title: 'Beach Cleanup Drive', ngo: 'Green Earth NGO', status: 'Active', volunteers: 24, posted: '2025-11-05' },
  { id: 2, title: 'E-Waste Collection Event', ngo: 'EcoWarriors', status: 'Active', volunteers: 18, posted: '2025-11-08' },
  { id: 3, title: 'Community Recycling Workshop', ngo: 'Green Earth NGO', status: 'Active', volunteers: 32, posted: '2025-11-02' },
  { id: 4, title: 'Tree Planting Initiative', ngo: 'EcoWarriors', status: 'Completed', volunteers: 45, posted: '2025-10-20' },
  { id: 5, title: 'Waste Sorting Training', ngo: 'Clean City Alliance', status: 'Active', volunteers: 15, posted: '2025-11-09' },
];

const mockApplications: Application[] = [
  { id: 1, volunteer: 'Sarah Johnson', opportunity: 'Beach Cleanup Drive', skills: 'Sorting, Leadership', status: 'Approved', applied: '2025-11-06' },
  { id: 2, volunteer: 'Mike Chen', opportunity: 'E-Waste Collection Event', skills: 'Tech, Collection', status: 'Pending', applied: '2025-11-09' },
  { id: 3, volunteer: 'Emily Davis', opportunity: 'Community Recycling Workshop', skills: 'Education, Sorting', status: 'Approved', applied: '2025-11-03' },
  { id: 4, volunteer: 'John Worker', opportunity: 'Tree Planting Initiative', skills: 'Physical Work, Teamwork', status: 'Approved', applied: '2025-10-21' },
  { id: 5, volunteer: 'Alex Brown', opportunity: 'Waste Sorting Training', skills: 'Sorting, Organization', status: 'Pending', applied: '2025-11-10' },
];

export function AdminControlPage({ onNavigate }: AdminControlPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(mockUsers);
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [applications, setApplications] = useState(mockApplications);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<number | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOpportunities = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.ngo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApplications = applications.filter(app =>
    app.volunteer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.opportunity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuspendUser = (userId: number) => {
    setSelectedUserId(userId);
    setSuspendDialogOpen(true);
  };

  const confirmSuspendUser = () => {
    if (selectedUserId) {
      setUsers(users.map(user =>
        user.id === selectedUserId
          ? { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' }
          : user
      ));
      const user = users.find(u => u.id === selectedUserId);
      toast.success(`${user?.name} has been ${user?.status === 'Active' ? 'suspended' : 'reactivated'}`);
    }
    setSuspendDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleDeleteOpportunity = (opportunityId: number) => {
    setSelectedOpportunityId(opportunityId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteOpportunity = () => {
    if (selectedOpportunityId) {
      setOpportunities(opportunities.filter(opp => opp.id !== selectedOpportunityId));
      const opportunity = opportunities.find(o => o.id === selectedOpportunityId);
      toast.success(`"${opportunity?.title}" has been removed`);
    }
    setDeleteDialogOpen(false);
    setSelectedOpportunityId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate?.('admin-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Button>
          <h1 className="text-3xl mb-2">Admin Control Panel</h1>
          <p className="text-muted-foreground">
            Manage users and opportunities
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users or opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users Management</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities Management</TabsTrigger>
            <TabsTrigger value="applications">Application Management</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant={user.status === 'Active' ? 'destructive' : 'default'}
                              size="sm"
                              onClick={() => handleSuspendUser(user.id)}
                            >
                              {user.status === 'Active' ? (
                                <>
                                  <UserX className="w-3 h-3 mr-1" />
                                  Suspend
                                </>
                              ) : (
                                <>
                                  <Shield className="w-3 h-3 mr-1" />
                                  Reactivate
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities">
            <Card>
              <CardHeader>
                <CardTitle>All Opportunities</CardTitle>
                <CardDescription>Manage posted opportunities and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>NGO</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Volunteers</TableHead>
                        <TableHead>Posted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOpportunities.map((opportunity) => (
                        <TableRow key={opportunity.id}>
                          <TableCell>{opportunity.title}</TableCell>
                          <TableCell className="text-muted-foreground">{opportunity.ngo}</TableCell>
                          <TableCell>
                            <Badge variant={opportunity.status === 'Active' ? 'default' : 'secondary'}>
                              {opportunity.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{opportunity.volunteers}</TableCell>
                          <TableCell className="text-muted-foreground">{opportunity.posted}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteOpportunity(opportunity.id)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>All Applications</CardTitle>
                <CardDescription>Manage volunteer applications to opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Volunteer</TableHead>
                        <TableHead>Opportunity</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>{application.volunteer}</TableCell>
                          <TableCell className="text-muted-foreground">{application.opportunity}</TableCell>
                          <TableCell className="text-sm">{application.skills}</TableCell>
                          <TableCell>
                            <Badge variant={application.status === 'Approved' ? 'default' : 'secondary'}>
                              {application.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{application.applied}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Suspend User Dialog */}
        <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                {users.find(u => u.id === selectedUserId)?.status === 'Active' 
                  ? 'Suspend User Account' 
                  : 'Reactivate User Account'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {users.find(u => u.id === selectedUserId)?.status === 'Active'
                  ? 'This will suspend the user account and restrict their access to the platform. This action can be reversed later.'
                  : 'This will reactivate the user account and restore their access to the platform.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmSuspendUser}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Opportunity Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-destructive" />
                Remove Opportunity
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this opportunity from the platform. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteOpportunity} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}