import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { createOpportunity } from "../../services/api";
import { Plus, Upload } from "lucide-react";

type CreateOpportunityPageProps = {
  onNavigate: (page: string) => void;
};

export function CreateOpportunityPage({ onNavigate }: CreateOpportunityPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableSkills = [
    "Recycling",
    "Sorting",
    "Teamwork",
    "Community Support",
    "Awareness",
    "Logistics",
    "Data Entry",
  ];

  function toggleSkill(skill: string) {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  async function handleCreate() {
    setError("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("location", location);
      fd.append("duration", duration);
      fd.append("date", date);
      fd.append("requiredSkills", JSON.stringify(skills));

      if (imageFile) fd.append("opportunityImage", imageFile);

      await createOpportunity(fd);

      alert("Opportunity created successfully!");
      onNavigate("dashboard");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2">Create New Opportunity</h1>
          <p className="text-muted-foreground">
            Fill out the details to post a new volunteering opportunity
          </p>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* FORM */}
        <div className="bg-card rounded-xl shadow p-6 space-y-6">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              placeholder="Beach Cleanup Drive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the opportunity..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <Input
              placeholder="City, Park, Area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Date */}
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Duration */}
          <div>
            <Label>Duration</Label>
            <Input
              placeholder="e.g., 4 hours"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          {/* Required Skills */}
          <div>
            <Label>Required Skills</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {availableSkills.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-2 rounded border text-sm ${skills.includes(skill)
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Upload Image</Label>
            <div className="mt-2 flex items-center gap-3">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files ? e.target.files[0] : null)
                }
              />

              {imageFile && (
                <ImageWithFallback
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-20 h-20 rounded object-cover"
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              className="w-full"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Opportunity"}
            </Button>

            <Button
              variant="outline"
              className="w-full"
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
