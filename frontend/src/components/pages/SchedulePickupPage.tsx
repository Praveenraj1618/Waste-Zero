import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { schedulePickup } from "../../services/api";

type PickupSchedulingPageProps = {
  onNavigate: (page: string) => void;
};

export function SchedulePickupPage({ onNavigate }: PickupSchedulingPageProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categoryOptions = [
    "Plastic",
    "E-Waste",
    "Metal",
    "Paper",
    "Glass",
    "Organic Waste",
  ];

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  }

  async function handleSchedule() {
    setError("");
    setLoading(true);

    if (categories.length === 0) {
      setError("Please select at least one waste category.");
      setLoading(false);
      return;
    }

    if (!scheduledTime) {
      setError("Please select a pickup date and time.");
      setLoading(false);
      return;
    }

    try {
      await schedulePickup({
        category: categories,
        scheduled_time: scheduledTime,
        notes,
      });

      alert("Pickup scheduled successfully!");
      onNavigate("dashboard");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2">Schedule Waste Pickup</h1>
          <p className="text-muted-foreground">
            Choose the waste categories and set the pickup date and time.
          </p>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Form Section */}
        <div className="bg-card p-6 rounded-xl shadow space-y-6">

          {/* Category Selection */}
          <div>
            <Label>Waste Categories</Label>

            <div className="grid grid-cols-2 gap-3 mt-3">
              {categoryOptions.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Checkbox
                    checked={categories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <Label>Pickup Date & Time</Label>
            <Input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Notes */}
          <div>
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Any special instructions for the pickup?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-2"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              className="w-full"
              onClick={handleSchedule}
              disabled={loading}
            >
              {loading ? "Scheduling..." : "Schedule Pickup"}
            </Button>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => onNavigate("dashboard")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
