import React, { useEffect, useState } from "react";
import { listPickups, updatePickup, getUser } from "../../services/api";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MapPin, Clock, Recycle, User } from "lucide-react";

type Pickup = {
  _id: string;
  user_id: string;
  category: string[];
  scheduled_time: string;
  status: "pending" | "assigned" | "completed";
  agent_id?: string;
};

type PickupDashboardProps = {
  currentUserId: string;
  role: "volunteer" | "ngo" | "pickup_agent" | "admin";
};

export function PickupDashboardPage({ currentUserId, role }: PickupDashboardProps) {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any>({});

  async function fetchUsers(pickups: Pickup[]) {
    const ids = Array.from(new Set(pickups.map(p => p.user_id)));
    const map: any = {};

    for (const id of ids) {
      try {
        map[id] = await getUser(id);
      } catch {
        map[id] = { name: "Unknown User" };
      }
    }

    setUsers(map);
  }

  async function load() {
    setLoading(true);
    try {
      const data = await listPickups();
      setPickups(data);
      fetchUsers(data);
    } catch (err: any) {
      console.error("Error loading pickups:", err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAccept(id: string) {
    await updatePickup(id, { status: "assigned", agent_id: currentUserId });
    load();
  }

  async function handleComplete(id: string) {
    await updatePickup(id, { status: "completed" });
    load();
  }

  const agentMode = role === "pickup_agent";
  const userMode = role === "volunteer";

  const filtered = pickups.filter((p) => {
    if (agentMode) return true;
    if (userMode) return p.user_id === currentUserId;
    return true;
  });

  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-2">Waste Pickups</h1>
      <p className="text-muted-foreground mb-6">
        Track scheduled pickups and update their status.
      </p>

      {loading && <p>Loading pickups...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((p) => {
          const user = users[p.user_id] || { name: "Loading..." };
          return (
            <Card key={p._id} className="p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <Badge
                  className={`${
                    p.status === "pending"
                      ? "bg-yellow-500"
                      : p.status === "assigned"
                      ? "bg-blue-500"
                      : "bg-green-600"
                  }`}
                >
                  {p.status.toUpperCase()}
                </Badge>

                <span className="text-sm opacity-80">
                  {new Date(p.scheduled_time).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Recycle className="w-4 h-4 text-primary" />
                  <span>{p.category.join(", ")}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span>
                    {new Date(p.scheduled_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4 text-accent" />
                  <span>{user.name}</span>
                </div>
              </div>

              {/* Agent Buttons */}
              {agentMode && (
                <div className="flex gap-3">
                  {p.status === "pending" && (
                    <Button className="w-full" onClick={() => handleAccept(p._id)}>
                      Accept Pickup
                    </Button>
                  )}
                  {p.status === "assigned" && p.agent_id === currentUserId && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleComplete(p._id)}
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <p className="text-muted-foreground text-center mt-10">
          No pickups found.
        </p>
      )}
    </div>
  );
}
