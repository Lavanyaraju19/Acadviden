import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MessageSquare, Send, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const conversations = [
  { id: 1, name: "Alice Johnson", role: "Student", lastMessage: "Thank you for your help!", time: "5 min ago", unread: 0 },
  { id: 2, name: "Bob Smith", role: "Student", lastMessage: "I have a question about the SEO module", time: "1 hour ago", unread: 2 },
  { id: 3, name: "Carol White", role: "Student", lastMessage: "When is the next webinar?", time: "2 hours ago", unread: 1 },
  { id: 4, name: "David Brown", role: "Student", lastMessage: "My payment didn't go through", time: "Yesterday", unread: 0 },
  { id: 5, name: "Sarah Johnson", role: "Instructor", lastMessage: "I've updated the course content", time: "Yesterday", unread: 0 },
];

const messages = [
  { id: 1, sender: "Bob Smith", content: "Hi, I need help with the keyword research section.", time: "10:30 AM", isOwn: false },
  { id: 2, sender: "Admin", content: "Hi Bob! I'd be happy to help. What specific part are you struggling with?", time: "10:32 AM", isOwn: true },
  { id: 3, sender: "Bob Smith", content: "I'm not sure how to use the SEMrush tool effectively.", time: "10:35 AM", isOwn: false },
  { id: 4, sender: "Admin", content: "Great question! Let me send you some resources that will help.", time: "10:36 AM", isOwn: true },
  { id: 5, sender: "Bob Smith", content: "I have a question about the SEO module", time: "10:40 AM", isOwn: false },
];

const AdminMessages = () => {
  return (
    <DashboardLayout variant="admin" userName="Admin User">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            <span className="text-gradient">Messages</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Communicate with students and instructors.
          </p>
        </div>

        <div className="glass rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
            {/* Conversations List */}
            <div className="border-r border-border">
              <div className="p-4 border-b border-border space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-10 bg-background" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Messages</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="instructors">Instructors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ScrollArea className="h-[480px]">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                      conv.id === 2 ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{conv.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {conv.role}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
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
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Bob Smith</p>
                    <p className="text-xs text-muted-foreground">Student • Digital Marketing Course</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Profile</Button>
              </div>

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
                        <p className={`text-xs mt-1 ${msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Input placeholder="Type a message..." className="flex-1 bg-background" />
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

export default AdminMessages;
