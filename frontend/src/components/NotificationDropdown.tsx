import { useState } from 'react';
import { Bell, CheckCircle2, MessageSquare, Calendar, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

type Notification = {
  id: number;
  type: 'match' | 'message' | 'pickup' | 'opportunity';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTo?: string;
};

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'match',
    title: 'New Match Found',
    message: 'Beach Cleanup Drive matches your skills',
    timestamp: '5 min ago',
    read: false,
    linkTo: 'opportunities',
  },
  {
    id: 2,
    type: 'message',
    title: 'New Message',
    message: 'Sarah Johnson sent you a message',
    timestamp: '10 min ago',
    read: false,
    linkTo: 'messages',
  },
  {
    id: 3,
    type: 'pickup',
    title: 'Pickup Confirmed',
    message: 'Your pickup is scheduled for tomorrow',
    timestamp: '1 hour ago',
    read: false,
    linkTo: 'schedule-pickup',
  },
  {
    id: 4,
    type: 'opportunity',
    title: 'Opportunity Update',
    message: 'E-Waste Collection Event has been updated',
    timestamp: '2 hours ago',
    read: true,
    linkTo: 'opportunities',
  },
  {
    id: 5,
    type: 'message',
    title: 'New Message',
    message: 'Green Earth NGO sent you a message',
    timestamp: '3 hours ago',
    read: true,
    linkTo: 'messages',
  },
];

type NotificationDropdownProps = {
  onNavigate?: (page: string) => void;
};

export function NotificationDropdown({ onNavigate }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'pickup':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'opportunity':
        return <Package className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    ));
    
    // Navigate to the appropriate page
    if (notification.linkTo && onNavigate) {
      onNavigate(notification.linkTo);
    }
    
    // Close dropdown
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
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
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}>
                Mark all read
              </Button>
            )}
          </div>
        </div>
        {notifications.length > 0 ? (
          <>
            <ScrollArea className="h-[400px]">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm">{notification.title}</p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
            <div className="p-2 border-t bg-card">
              <Button 
                variant="ghost" 
                className="w-full justify-center"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
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
