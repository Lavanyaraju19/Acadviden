import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MessageSquare, Send, Search, Phone, Video, MoreVertical, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Instructor",
    avatar: null,
    lastMessage: "Great progress on your SEO project!",
    time: "2 min ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Instructor",
    avatar: null,
    lastMessage: "Don't forget to submit your assignment by Friday.",
    time: "1 hour ago",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: "Support Team",
    role: "Support",
    avatar: null,
    lastMessage: "Your ticket has been resolved.",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "David Miller",
    role: "Instructor",
    avatar: null,
    lastMessage: "Here are the resources I mentioned...",
    time: "2 days ago",
    unread: 0,
    online: false,
  },
];

const messages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    content: "Hi John! I've reviewed your SEO audit project.",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "John Doe",
    content: "Thanks! I'm excited to hear your feedback.",
    time: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    content: "Overall, great work! Your keyword research was thorough and the technical audit was well-structured.",
    time: "10:35 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "Sarah Johnson",
    content: "A few suggestions: Consider adding more competitor analysis and include specific metrics for the recommendations.",
    time: "10:36 AM",
    isOwn: false,
  },
  {
    id: 5,
    sender: "John Doe",
    content: "That's really helpful! I'll work on those improvements.",
    time: "10:40 AM",
    isOwn: true,
  },
  {
    id: 6,
    sender: "Sarah Johnson",
    content: "Great progress on your SEO project!",
    time: "10:45 AM",
    isOwn: false,
  },
];

const StudentMessages = () => {
  return (
    <DashboardLayout variant="student" userName="John Doe">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            <span className="text-gradient">Messages</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Chat with instructors and support team.
          </p>
        </div>

        <div className="glass rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
            {/* Conversations List */}
            <div className="border-r border-border">
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10 bg-background"
                  />
                </div>
              </div>
              <ScrollArea className="h-[540px]">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                      conv.id === 1 ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{conv.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {conv.role}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {conv.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.lastMessage}
                          </p>
                          {conv.unread > 0 && (
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              {conv.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  </div>
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-xs text-green-400">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl ${
                          msg.isOwn
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    className="flex-1 bg-background"
                  />
                  <Button className="bg-primary text-primary-foreground">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentMessages;
