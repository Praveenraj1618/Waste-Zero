import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ArrowLeft } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

type AnalyticsDashboardPageProps = {
  onNavigate?: (page: string) => void;
};

// Mock data for charts
const userActivityData = [
  { date: 'Nov 1', users: 45, pickups: 23, opportunities: 12 },
  { date: 'Nov 3', users: 52, pickups: 28, opportunities: 15 },
  { date: 'Nov 5', users: 61, pickups: 34, opportunities: 18 },
  { date: 'Nov 7', users: 58, pickups: 31, opportunities: 16 },
  { date: 'Nov 9', users: 70, pickups: 42, opportunities: 22 },
  { date: 'Nov 11', users: 82, pickups: 48, opportunities: 25 },
];

const opportunityEngagementData = [
  { opportunity: 'Beach Cleanup', value: 95 },
  { opportunity: 'E-Waste Drive', value: 78 },
  { opportunity: 'Recycling Event', value: 88 },
  { opportunity: 'Tree Planting', value: 72 },
  { opportunity: 'Community Sort', value: 65 },
];

const volunteerEngagementData = [
  { volunteer: 'Sarah J.', value: 92 },
  { volunteer: 'Mike C.', value: 85 },
  { volunteer: 'Emily D.', value: 88 },
  { volunteer: 'John W.', value: 76 },
  { volunteer: 'Alex B.', value: 81 },
];

const skillsData = [
  { skill: 'Sorting', value: 90 },
  { skill: 'Collection', value: 75 },
  { skill: 'Education', value: 82 },
  { skill: 'Organization', value: 68 },
  { skill: 'Tech Support', value: 58 },
];

const overviewData = [
  { month: 'May', weighted: 65 },
  { month: 'Jun', weighted: 71 },
  { month: 'Jul', weighted: 68 },
  { month: 'Aug', weighted: 78 },
  { month: 'Sep', weighted: 82 },
  { month: 'Oct', weighted: 85 },
  { month: 'Nov', weighted: 90 },
];

export function AnalyticsDashboardPage({ onNavigate }: AnalyticsDashboardPageProps) {
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
          <h1 className="text-3xl mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Detailed insights and performance metrics
          </p>
        </div>

        <div className="space-y-6">
          {/* User Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Activity Trends</CardTitle>
              <CardDescription>Daily user engagement and platform usage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    name="Active Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pickups" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Pickups"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="opportunities" 
                    stroke="hsl(var(--chart-3))" 
                    strokeWidth={2}
                    name="Opportunities"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar Charts Row */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Opportunities Engagement */}
            <Card>
              <CardHeader>
                <CardTitle>Opportunities Engagement</CardTitle>
                <CardDescription>Top 5 popular opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={opportunityEngagementData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="opportunity" 
                      tick={{ fontSize: 10 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]}
                      tick={{ fontSize: 10 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Radar 
                      name="Engagement" 
                      dataKey="value" 
                      stroke="hsl(var(--chart-1))" 
                      fill="hsl(var(--chart-1))" 
                      fillOpacity={0.3}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Volunteers Engagement */}
            <Card>
              <CardHeader>
                <CardTitle>Volunteers Engagement</CardTitle>
                <CardDescription>Top 5 active volunteers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={volunteerEngagementData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="volunteer" 
                      tick={{ fontSize: 10 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]}
                      tick={{ fontSize: 10 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Radar 
                      name="Activity" 
                      dataKey="value" 
                      stroke="hsl(var(--chart-2))" 
                      fill="hsl(var(--chart-2))" 
                      fillOpacity={0.3}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Most Sorted Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Most Sorted Skills</CardTitle>
                <CardDescription>Top 5 in-demand skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={skillsData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="skill" 
                      tick={{ fontSize: 10 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]}
                      tick={{ fontSize: 10 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Radar 
                      name="Demand" 
                      dataKey="value" 
                      stroke="hsl(var(--chart-3))" 
                      fill="hsl(var(--chart-3))" 
                      fillOpacity={0.3}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Overview Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weighted Average Over Timeline</CardTitle>
              <CardDescription>Overall platform performance trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={overviewData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="weighted" 
                    stroke="hsl(var(--chart-4))" 
                    strokeWidth={3}
                    name="Performance Score"
                    dot={{ fill: 'hsl(var(--chart-4))', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl text-primary mb-2">1,234</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl text-secondary mb-2">5,678</p>
                <p className="text-sm text-muted-foreground">Completed Pickups</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl text-accent mb-2">87</p>
                <p className="text-sm text-muted-foreground">Active Opportunities</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl text-primary mb-2">90%</p>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
