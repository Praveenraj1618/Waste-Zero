import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Users,
  Package,
  TrendingUp,
  Activity,
  BarChart3,
  Settings,
  FileText,
  Clock
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAdminLogs, getAnalytics } from '../../services/api';

type AdminDashboardPageProps = {
  onNavigate?: (page: string) => void;
};

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    activeOpportunities: 0,
    pickupsCompleted: 0,
    platformHealth: 100
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [logs, analytics] = await Promise.all([
          getAdminLogs(),
          getAnalytics()
        ]);

        // Transform logs to match UI
        const formattedLogs = logs.map((log: any) => ({
          id: log._id,
          action: log.action,
          user: log.admin_id?.name || 'Admin',
          timestamp: new Date(log.createdAt).toLocaleString(),
          type: 'admin' // Default to admin type for now as logs are admin logs
        }));
        setActivityLog(formattedLogs);

        // Set stats from analytics
        setStats({
          totalUsers: analytics.users?.total || 0,
          activeOpportunities: analytics.opportunities?.active || 0,
          pickupsCompleted: analytics.pickups?.completed || 0,
          platformHealth: 99.9
        });

      } catch (err) {
        console.error("Failed to load admin data", err);
      }
    }
    loadData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'opportunity':
        return <Package className="w-4 h-4" />;
      case 'pickup':
        return <Activity className="w-4 h-4" />;
      case 'ngo':
        return <TrendingUp className="w-4 h-4" />;
      case 'report':
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'text-blue-500 bg-blue-500/10';
      case 'opportunity':
        return 'text-green-500 bg-green-500/10';
      case 'pickup':
        return 'text-purple-500 bg-purple-500/10';
      case 'ngo':
        return 'text-orange-500 bg-orange-500/10';
      case 'report':
        return 'text-pink-500 bg-pink-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage platform activity
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl mt-1">{stats.totalUsers}</p>
                  <p className="text-xs text-green-500 mt-1">+12% this month</p>
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
                  <p className="text-sm text-muted-foreground">Active Opportunities</p>
                  <p className="text-2xl mt-1">{stats.activeOpportunities}</p>
                  <p className="text-xs text-green-500 mt-1">+8% this week</p>
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
                  <p className="text-sm text-muted-foreground">Pickups Completed</p>
                  <p className="text-2xl mt-1">{stats.pickupsCompleted}</p>
                  <p className="text-xs text-green-500 mt-1">+24% this month</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Platform Health</p>
                  <p className="text-2xl mt-1">98.5%</p>
                  <p className="text-xs text-green-500 mt-1">Excellent</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Activity Log */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform actions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {activityLog.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm mb-1">
                          <span>{activity.action}</span>
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Manage platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onNavigate?.('admin-control')}
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onNavigate?.('admin-control')}
              >
                <Package className="w-4 h-4 mr-2" />
                Manage Opportunities
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onNavigate?.('analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onNavigate?.('reports')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Reports
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Platform Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl text-green-500 mb-1">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl text-blue-500 mb-1">1.2s</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl text-purple-500 mb-1">456</p>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl text-orange-500 mb-1">12.5k</p>
                <p className="text-sm text-muted-foreground">API Requests/hr</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
