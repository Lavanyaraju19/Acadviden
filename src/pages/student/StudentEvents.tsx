import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Calendar, Clock, MapPin, Users, Video, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const events = [
  {
    id: 1,
    title: "SEO Masterclass: Advanced Techniques",
    type: "webinar",
    date: "2024-02-15",
    time: "2:00 PM EST",
    duration: "90 min",
    instructor: "Sarah Johnson",
    attendees: 156,
    status: "upcoming",
    description: "Deep dive into advanced SEO techniques for 2024.",
  },
  {
    id: 2,
    title: "Social Media Strategy Workshop",
    type: "workshop",
    date: "2024-02-18",
    time: "10:00 AM EST",
    duration: "3 hours",
    instructor: "Mike Chen",
    attendees: 89,
    status: "upcoming",
    description: "Hands-on workshop for building your social media strategy.",
  },
  {
    id: 3,
    title: "Networking Event: Marketing Professionals",
    type: "networking",
    date: "2024-02-20",
    time: "6:00 PM EST",
    duration: "2 hours",
    location: "Virtual",
    attendees: 234,
    status: "upcoming",
    description: "Connect with fellow marketing professionals.",
  },
  {
    id: 4,
    title: "Google Ads Q&A Session",
    type: "webinar",
    date: "2024-02-10",
    time: "3:00 PM EST",
    duration: "60 min",
    instructor: "David Miller",
    attendees: 178,
    status: "completed",
    description: "Live Q&A session about Google Ads optimization.",
    recording: true,
  },
  {
    id: 5,
    title: "Content Marketing Bootcamp",
    type: "workshop",
    date: "2024-02-05",
    time: "9:00 AM EST",
    duration: "4 hours",
    instructor: "Emma Wilson",
    attendees: 112,
    status: "completed",
    description: "Intensive bootcamp on content marketing strategies.",
    recording: true,
  },
];

const getEventTypeConfig = (type: string) => {
  switch (type) {
    case "webinar":
      return { color: "bg-blue-500/20 text-blue-400", icon: Video };
    case "workshop":
      return { color: "bg-purple-500/20 text-purple-400", icon: Users };
    case "networking":
      return { color: "bg-green-500/20 text-green-400", icon: Users };
    default:
      return { color: "bg-primary/20 text-primary", icon: Calendar };
  }
};

const StudentEvents = () => {
  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const completedEvents = events.filter((e) => e.status === "completed");

  return (
    <DashboardLayout variant="student" userName="John Doe">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            <span className="text-gradient">Events</span> & Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            Join webinars, workshops, and networking events.
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Past Events ({completedEvents.length})
            </TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => {
                const config = getEventTypeConfig(event.type);
                const Icon = config.icon;

                return (
                  <div
                    key={event.id}
                    className="glass rounded-xl p-6 transition-all duration-300 hover:glow-teal"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${config.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-display font-semibold text-foreground">
                              {event.title}
                            </h3>
                            <Badge variant="secondary" className="mt-1">
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                          {event.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.attendees} registered
                          </div>
                        </div>

                        {event.instructor && (
                          <p className="text-sm text-muted-foreground mb-4">
                            Instructor: <span className="text-foreground">{event.instructor}</span>
                          </p>
                        )}

                        <div className="flex gap-2">
                          <Button className="bg-primary text-primary-foreground flex-1">
                            Register Now
                          </Button>
                          <Button variant="outline">
                            Add to Calendar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              {completedEvents.map((event) => {
                const config = getEventTypeConfig(event.type);
                const Icon = config.icon;

                return (
                  <div
                    key={event.id}
                    className="glass rounded-xl p-4 lg:p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className={`p-3 rounded-lg ${config.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{event.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <span>{event.attendees} attended</span>
                        </div>
                      </div>
                      {event.recording && (
                        <Button variant="outline" size="sm">
                          <Video className="w-4 h-4 mr-1" />
                          Watch Recording
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <div className="glass rounded-xl p-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="font-display font-semibold text-lg mb-2">
                  Calendar View
                </h3>
                <p className="text-muted-foreground">
                  Interactive calendar coming soon. For now, check the Upcoming tab.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentEvents;
