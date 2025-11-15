import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Search, 
  Send, 
  ArrowLeft,
  User,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';

type MessagesPageProps = {
  onNavigate?: (page: string) => void;
};

type Contact = {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
};

type Message = {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
};

const mockContacts: Contact[] = [
  { id: 1, name: 'Sarah Johnson', lastMessage: 'Thanks for the help!', timestamp: '2m ago', unread: 2, online: true },
  { id: 2, name: 'Green Earth NGO', lastMessage: 'The pickup is scheduled', timestamp: '1h ago', unread: 0, online: true },
  { id: 3, name: 'Mike Chen', lastMessage: 'See you at the cleanup event', timestamp: '3h ago', unread: 0, online: false },
  { id: 4, name: 'EcoWarriors Team', lastMessage: 'Great work today!', timestamp: '1d ago', unread: 1, online: false },
  { id: 5, name: 'Emily Davis', lastMessage: 'Can you help with sorting?', timestamp: '2d ago', unread: 0, online: false },
];

const mockMessages: { [key: number]: Message[] } = {
  1: [
    { id: 1, senderId: 1, text: 'Hi! I need help with recycling', timestamp: '10:30 AM' },
    { id: 2, senderId: 0, text: 'Hello! I\'d be happy to help. What do you need?', timestamp: '10:32 AM' },
    { id: 3, senderId: 1, text: 'I have some e-waste to dispose of', timestamp: '10:35 AM' },
    { id: 4, senderId: 0, text: 'Perfect! You can schedule a pickup through our app', timestamp: '10:36 AM' },
    { id: 5, senderId: 1, text: 'Thanks for the help!', timestamp: '10:40 AM' },
  ],
  2: [
    { id: 1, senderId: 2, text: 'Hello, your pickup request has been received', timestamp: '9:00 AM' },
    { id: 2, senderId: 0, text: 'Great! When will it be scheduled?', timestamp: '9:15 AM' },
    { id: 3, senderId: 2, text: 'The pickup is scheduled for tomorrow at 2 PM', timestamp: '9:30 AM' },
  ],
};

export function MessagesPage({ onNavigate }: MessagesPageProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: (messages[selectedContact.id]?.length || 0) + 1,
      senderId: 0,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }));

    setMessageInput('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Header */}
        <div className="lg:hidden mb-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate?.('dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Chat with volunteers and organizations
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="flex h-[calc(100vh-12rem)]">
            {/* Contacts Sidebar */}
            <div className={`${selectedContact ? 'hidden lg:block' : 'block'} w-full lg:w-80 border-r bg-card`}>
              {/* Desktop Header */}
              <div className="hidden lg:block p-4 border-b">
                <h2 className="text-xl mb-1">Messages</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredContacts.length} conversations
                </p>
              </div>

              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Contact List */}
              <ScrollArea className="h-[calc(100%-9rem)] lg:h-[calc(100%-10rem)]">
                <div className="divide-y">
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          {contact.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="truncate">{contact.name}</p>
                            <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {contact.lastMessage}
                            </p>
                            {contact.unread > 0 && (
                              <Badge className="ml-2">{contact.unread}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className={`${selectedContact ? 'block' : 'hidden lg:block'} flex-1 flex flex-col bg-muted/20`}>
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedContact(null)}
                        className="lg:hidden"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        {selectedContact.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                        )}
                      </div>
                      <div>
                        <p>{selectedContact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedContact.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {(messages[selectedContact.id] || []).map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === 0 ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              message.senderId === 0
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card border'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === 0
                                  ? 'text-primary-foreground/70'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t bg-card">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} size="icon">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2">No Conversation Selected</h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
