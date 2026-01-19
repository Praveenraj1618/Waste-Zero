import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, MessageSquare, Calendar, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import { listNotifications, markNotificationRead } from "../services/api";
import socket from "../services/socket";

type Notification = {
  _id: string;
  type: 'match' | 'message' | 'pickup' | 'application';
  message: string;
  sent_at: string;
  read: boolean;
};

export function NotificationDropdown({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  function getIcon(type: string) {
    switch (type) {
      case 'match':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'pickup':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'application':
        return <Package className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  }

  async function loadNotifications() {
    try {
      const data = await listNotifications();
      setNotifications(data);
    } catch (e) {
      console.error("Failed to load notifications");
    }
  }

  useEffect(() => {
    loadNotifications();

    // Real-time: receive notification using socket service
    const unsubscribe = socket.on("notification", (notif: Notification) => {
      setNotifications(prev => [notif, ...prev]);
    });

    return unsubscribe;
  }, []);

  async function handleNotificationClick(n: Notification) {
    if (!n.read) await markNotificationRead(n._id);
    loadNotifications();

    // navigate (optional)
    if (n.type === "message" && onNavigate) onNavigate("messages");
    if (n.type === "pickup" && onNavigate) onNavigate("pickup-dashboard");
    if (n.type === "match" && onNavigate) onNavigate("opportunities");

    setIsOpen(false);
  }

  async function markAllAsRead() {
    await Promise.all(
      notifications.map(n => !n.read && markNotificationRead(n._id))
    );
    loadNotifications();
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>

            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {notifications.length > 0 ? (
          <>
            <ScrollArea className="h-[400px]">
              <div className="divide-y">
                {notifications.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${!n.read ? "bg-primary/5" : ""
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getIcon(n.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm capitalize">{n.type}</p>
                          {!n.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </div>

                        <p className="text-sm text-muted-foreground mb-1">
                          {n.message}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {new Date(n.sent_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>

            <div className="p-2 border-t bg-card">
              <Button variant="ghost" className="w-full justify-center" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
