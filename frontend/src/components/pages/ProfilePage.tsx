import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { User, Building2, Mail, MapPin, Edit2, Save, X } from "lucide-react";
import { getUserProfile, updateUserProfile } from "../../services/api";

type ProfilePageProps = {
  userRole: 'volunteer' | 'ngo';
  userName: string;
  userEmail: string;
};

export function ProfilePage({ userRole, userName, userEmail }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [location, setLocation] = useState("San Francisco, CA");
  const [bio, setBio] = useState("");

  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Role-specific state
  const [skills, setSkills] = useState<string[]>([]);
  const [orgName, setOrgName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [serviceAreas, setServiceAreas] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await getUserProfile();
        setName(user.name);
        setEmail(user.email);
        setLocation(user.location || "");
        setBio(user.bio || "");
        if (user.role === 'volunteer') {
          setSkills(user.skills || []);
        } else if (user.role === 'ngo') {
          setOrgName(user.organization_name || "");
          setContactPerson(user.contact_person || "");
          setServiceAreas(user.service_areas?.join(', ') || "");
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const updates: any = {
        name,
        location,
        bio,
      };

      if (userRole === 'volunteer') {
        updates.skills = skills;
      } else if (userRole === 'ngo') {
        updates.organization_name = orgName;
        updates.contact_person = contactPerson;
        updates.service_areas = serviceAreas.split(',').map(s => s.trim());
      }

      await updateUserProfile(updates);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    try {
      await updateUserProfile({ password: newPassword });
      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      alert(err.message || "Failed to change password");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl mb-2">Profile Settings</h1>
              <p className="text-muted-foreground">
                Manage your account information and preferences
              </p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Profile Picture & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="text-2xl bg-primary text-white">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  )}
                  <Badge variant="secondary" className="gap-1">
                    {userRole === 'volunteer' ? (
                      <>
                        <User className="w-3 h-3" />
                        Volunteer
                      </>
                    ) : (
                      <>
                        <Building2 className="w-3 h-3" />
                        NGO
                      </>
                    )}
                  </Badge>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        className="bg-input-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                        className="bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio / Description</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="bg-input-background resize-none"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role-Specific Details */}
          {userRole === 'volunteer' ? (
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Details</CardTitle>
                <CardDescription>Your skills and capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Skills & Expertise</Label>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="gap-1">
                          {skill}
                          {isEditing && (
                            <button
                              onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newSkill = prompt("Enter new skill:");
                            if (newSkill) setSkills([...skills, newSkill]);
                          }}
                        >
                          + Add Skill
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Waste Types Handled</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Recyclables</Badge>
                        <Badge>Organic</Badge>
                        <Badge>E-waste</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Availability</Label>
                      <p className="text-sm text-muted-foreground">Weekends & Evenings</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>Your NGO information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Organization Name</Label>
                      <Input
                        id="orgName"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        disabled={!isEditing}
                        className="bg-input-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input
                        id="contactPerson"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        disabled={!isEditing}
                        className="bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceAreas">Service Areas</Label>
                    <Input
                      id="serviceAreas"
                      value={serviceAreas}
                      onChange={(e) => setServiceAreas(e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., Downtown, Suburbs, etc."
                      className="bg-input-background"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Active Agents</Label>
                      <p className="text-2xl text-primary">8</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Service Coverage</Label>
                      <p className="text-2xl text-primary">15 km²</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Settings - Password Change */}
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="bg-input-background"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="bg-input-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="bg-input-background"
                    />
                  </div>
                </div>

                <Button type="submit">Change Password</Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
              <CardDescription>Your contribution since joining</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-card rounded-lg">
                  <p className="text-3xl text-primary mb-1">
                    {userRole === 'volunteer' ? '24' : '245'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {userRole === 'volunteer' ? 'Pickups' : 'Total Pickups'}
                  </p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg">
                  <p className="text-3xl text-secondary mb-1">
                    {userRole === 'volunteer' ? '342' : '1,234'}
                  </p>
                  <p className="text-sm text-muted-foreground">kg Recycled</p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg">
                  <p className="text-3xl text-accent mb-1">
                    {userRole === 'volunteer' ? '156' : '567'}
                  </p>
                  <p className="text-sm text-muted-foreground">kg CO₂ Saved</p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg">
                  <p className="text-3xl text-primary mb-1">
                    {userRole === 'volunteer' ? '8.5' : '9.2'}
                  </p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
