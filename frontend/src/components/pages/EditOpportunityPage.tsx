import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  getOpportunity,
  updateOpportunity,
} from "../../services/api";
import { Upload } from "lucide-react";

type EditOpportunityPageProps = {
  opportunityId: string;
  onNavigate: (page: string, id?: string) => void;
};

export function EditOpportunityPage({
  opportunityId,
  onNavigate,
}: EditOpportunityPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    loadOpportunity();
  }, [opportunityId]);

  async function loadOpportunity() {
    setLoading(true);
    setError("");

    try {
      const opp = await getOpportunity(opportunityId);

      // Pre-fill all fields
      setTitle(opp.title);
      setDescription(opp.description);
      setLocation(opp.location);
      setDuration(opp.duration);
      setDate(opp.date ? opp.date.split("T")[0] : "");
      setSkills(opp.requiredSkills || []);
      setCurrentImage(opp.imageUrl ? `http://localhost:5000${opp.imageUrl}` : "");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  function toggleSkill(skill: string) {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  async function handleUpdate() {
    setSaving(true);
    setError("");

    try {
      const fd = new FormData();

      fd.append("title", title);
      fd.append("description", description);
      fd.append("location", location);
      fd.append("date", date);
      fd.append("duration", duration);
      fd.append("requiredSkills", JSON.stringify(skills));

      if (imageFile) fd.append("opportunityImage", imageFile);

      await updateOpportunity(opportunityId, fd);

      alert("Opportunity updated successfully!");
      onNavigate("opportunity-detail", opportunityId);
    } catch (err: any) {
      setError(err.message);
    }

    setSaving(false);
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="mb-2">Edit Opportunity</h1>
            <p className="text-muted-foreground">
              Update the details of this volunteering opportunity
            </p>
          </div>

          <Button variant="outline" onClick={() => onNavigate("opportunity-detail", opportunityId)}>
            Back
          </Button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="bg-card rounded-xl shadow p-6 space-y-6">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <Input
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
            <Label>Opportunity Image</Label>

            {currentImage && (
              <div className="mt-3">
                <ImageWithFallback
                  src={currentImage}
                  className="w-48 h-32 rounded object-cover"
                />
              </div>
            )}

            <div className="mt-3 flex items-center gap-4">
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
                  className="w-20 h-20 rounded object-cover"
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              className="w-full"
              disabled={saving}
              onClick={handleUpdate}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => onNavigate("opportunity-detail", opportunityId)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
