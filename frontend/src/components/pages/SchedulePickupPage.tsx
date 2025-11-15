import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Clock,
  CheckCircle2,
  Package,
  Leaf,
  Cpu,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type SchedulePickupPageProps = {
  onNavigate?: (page: string) => void;
};

type WasteType = {
  id: string;
  name: string;
  icon: typeof Leaf;
  description: string;
};

const wasteTypes: WasteType[] = [
  { id: 'plastic', name: 'Plastic & Recyclables', icon: Package, description: 'Bottles, containers, packaging' },
  { id: 'ewaste', name: 'E-Waste', icon: Cpu, description: 'Electronics, batteries, cables' },
  { id: 'organic', name: 'Organic Waste', icon: Leaf, description: 'Food scraps, garden waste' },
  { id: 'general', name: 'General Waste', icon: Trash2, description: 'Non-recyclable items' },
];

export function SchedulePickupPage({ onNavigate }: SchedulePickupPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    date: '',
    timeSlot: '',
    wasteTypes: [] as string[],
    notes: '',
  });

  const pickupHistory = [
    { id: 1, date: '2025-11-05', type: 'Plastic & Recyclables', location: 'Home', status: 'completed', weight: '15 kg' },
    { id: 2, date: '2025-10-28', type: 'E-Waste', location: 'Office', status: 'completed', weight: '8 kg' },
    { id: 3, date: '2025-10-15', type: 'Organic Waste', location: 'Home', status: 'completed', weight: '12 kg' },
  ];

  const handleWasteTypeToggle = (wasteTypeId: string) => {
    setFormData(prev => ({
      ...prev,
      wasteTypes: prev.wasteTypes.includes(wasteTypeId)
        ? prev.wasteTypes.filter(id => id !== wasteTypeId)
        : [...prev.wasteTypes, wasteTypeId]
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.address || !formData.city || !formData.date || !formData.timeSlot) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    setCurrentStep(2);
  };

  const handleSubmit = () => {
    if (formData.wasteTypes.length === 0) {
      toast.error('Please select at least one waste type');
      return;
    }
    
    toast.success('Pickup scheduled successfully!');
    // Reset form
    setFormData({
      address: '',
      city: '',
      date: '',
      timeSlot: '',
      wasteTypes: [],
      notes: '',
    });
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate?.('dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl mb-2">Schedule Waste Pickup</h1>
          <p className="text-muted-foreground">
            Book a convenient time for waste collection
          </p>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList>
            <TabsTrigger value="schedule">Schedule New Pickup</TabsTrigger>
            <TabsTrigger value="history">Pickup History</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {currentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                </div>
                <span className="ml-2 hidden md:inline">Location & Time</span>
              </div>
              <div className={`h-0.5 w-12 md:w-24 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`flex items-center ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  2
                </div>
                <span className="ml-2 hidden md:inline">Waste Type</span>
              </div>
            </div>

            {/* Step 1: Location & Time */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Location & Time</CardTitle>
                  <CardDescription>Where and when should we pick up?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="address">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Street Address
                      </Label>
                      <Input
                        id="address"
                        placeholder="123 Green Street"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Your City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Pickup Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeSlot">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Preferred Time Slot
                      </Label>
                      <select
                        id="timeSlot"
                        className="w-full h-10 px-3 rounded-md border bg-input-background"
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      >
                        <option value="">Select time slot</option>
                        <option value="morning">Morning (8 AM - 12 PM)</option>
                        <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                        <option value="evening">Evening (4 PM - 8 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleNextStep}>
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Waste Categorization */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Step 2: Waste Categorization</CardTitle>
                  <CardDescription>Select the types of waste for pickup</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {wasteTypes.map((wasteType) => {
                      const Icon = wasteType.icon;
                      return (
                        <div
                          key={wasteType.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            formData.wasteTypes.includes(wasteType.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleWasteTypeToggle(wasteType.id)}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={formData.wasteTypes.includes(wasteType.id)}
                              onCheckedChange={() => handleWasteTypeToggle(wasteType.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-5 h-5 text-primary" />
                                <h4>{wasteType.name}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {wasteType.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions or additional information..."
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous Step
                    </Button>
                    <Button onClick={handleSubmit}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Schedule Pickup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Pickup History</CardTitle>
                <CardDescription>Your past waste collection appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {pickupHistory.length > 0 ? (
                  <div className="space-y-3">
                    {pickupHistory.map((pickup) => (
                      <div key={pickup.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p>{pickup.type}</p>
                            <Badge variant="secondary">{pickup.status}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {pickup.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {pickup.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {pickup.weight}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2">No Pickup History</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't scheduled any pickups yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
