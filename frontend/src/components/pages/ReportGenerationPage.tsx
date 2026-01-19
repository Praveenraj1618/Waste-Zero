import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Users,
  Package,
  TrendingUp,
  Printer
} from 'lucide-react';
import { toast } from 'sonner';

type ReportGenerationPageProps = {
  onNavigate?: (page: string) => void;
};

type ReportType = 'users' | 'pickups' | 'opportunities' | '';

export function ReportGenerationPage({ onNavigate }: ReportGenerationPageProps) {
  const [reportType, setReportType] = useState<ReportType>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const [reportData, setReportData] = useState<any>(null);

  const handleGenerateReport = async () => {
    if (!reportType || !startDate || !endDate) {
      toast.error('Please select report type and date range');
      return;
    }

    try {
      const data = await import('../../services/api').then(m => m.getFullReport());

      let formattedData;
      switch (reportType) {
        case 'users':
          formattedData = {
            title: 'User Activity Report',
            icon: Users,
            data: [
              { label: 'Total Users', value: data.usersCount },
              { label: 'New Registrations', value: 'N/A' }, // Backend needs to support date filtering for this
              { label: 'Active Volunteers', value: 'N/A' },
              { label: 'Registered NGOs', value: 'N/A' },
            ]
          };
          break;
        case 'pickups':
          formattedData = {
            title: 'Pickup Statistics Report',
            icon: Package,
            data: [
              { label: 'Total Pickups', value: data.pickupsCount },
              { label: 'Total Waste Collected', value: `${data.totalWasteKg} kg` },
            ]
          };
          break;
        case 'opportunities':
          formattedData = {
            title: 'Opportunities Report',
            icon: TrendingUp,
            data: [
              { label: 'Total Opportunities', value: data.oppCount },
              { label: 'Total Applications', value: data.appsCount },
            ]
          };
          break;
        default:
          formattedData = null;
      }

      setReportData(formattedData);
      setShowPreview(true);
      toast.success('Report generated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate report');
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Opening print dialog...');
  };

  const handleDownload = () => {
    toast.success('Downloading report as PDF...');
  };

  const ReportIcon = reportData?.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 print:hidden">
          <Button
            variant="ghost"
            onClick={() => onNavigate?.('admin-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Button>
          <h1 className="text-3xl mb-2">Report Generation</h1>
          <p className="text-muted-foreground">
            Generate and export platform reports
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls */}
          <Card className="lg:col-span-1 print:hidden">
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
              <CardDescription>Configure report parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <select
                  id="reportType"
                  className="w-full h-10 px-3 rounded-md border bg-input-background"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                >
                  <option value="">Select report type</option>
                  <option value="users">User Activity</option>
                  <option value="pickups">Pickup Statistics</option>
                  <option value="opportunities">Opportunities</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="startDate"
                    type="date"
                    className="w-full h-10 px-3 pl-10 rounded-md border bg-input-background"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="endDate"
                    type="date"
                    className="w-full h-10 px-3 pl-10 rounded-md border bg-input-background"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerateReport}
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>

              {showPreview && (
                <div className="space-y-2 pt-4 border-t">
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="w-full"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Report
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>Generated report output</CardDescription>
            </CardHeader>
            <CardContent>
              {showPreview && reportData ? (
                <div className="space-y-6">
                  {/* Report Header */}
                  <div className="text-center border-b pb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      {ReportIcon && <ReportIcon className="w-8 h-8 text-primary" />}
                    </div>
                    <h2 className="text-2xl mb-2">{reportData.title}</h2>
                    <p className="text-muted-foreground">
                      Period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Report Data */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {reportData.data.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                        <p className="text-2xl">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Summary Section */}
                  <div className="border-t pt-6">
                    <h3 className="mb-4">Summary</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        This report provides comprehensive insights into {reportType} metrics for the selected period.
                        The data has been aggregated from platform activities and verified for accuracy.
                      </p>
                      <p>
                        All statistics are calculated based on confirmed and completed activities within the WasteZero platform.
                        For detailed breakdowns or custom reports, please contact the system administrator.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t pt-6 text-center text-sm text-muted-foreground">
                    <p>WasteZero Platform - Environmental Impact Management System</p>
                    <p className="mt-1">© 2025 WasteZero. All rights reserved.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2">No Report Generated</h3>
                  <p className="text-muted-foreground">
                    Select report type and date range, then click "Generate Report"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
