import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../integrations/supabase/client";
import {
  Calendar,
  Clock,
  BookOpen,
  ExternalLink,
  Heart,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  MapPin,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

interface LiveSession {
  id: string;
  title: string;
  description?: string;
  date_time: string;
  module_id?: string;
  course_id?: string;
  join_link: string;
  instructor_name?: string;
  location?: string;
  max_attendees?: number;
  created_at?: string;
}

interface SavedSession {
  id: string;
  session_id: string;
  student_id: string;
  saved_at: string;
}

interface CalendarEvent {
  date: string;
  sessions: LiveSession[];
}

export default function LiveSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [filterMonth, setFilterMonth] = useState(true);

  // Fetch sessions and saved sessions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch live sessions
        const { data: sessionsData, error: sessionsError } = await (
          supabase as unknown as any
        )
          .from("live_sessions")
          .select("*")
          .gte("date_time", new Date().toISOString())
          .order("date_time", { ascending: true });

        if (sessionsError) throw sessionsError;
        setSessions(sessionsData || []);

        // Fetch saved sessions if user is logged in
        if (user?.id) {
          const { data: savedData, error: savedError } = await (
            supabase as unknown as any
          )
            .from("saved_sessions")
            .select("*")
            .eq("student_id", user.id);

          if (savedError) throw savedError;
          setSavedSessions(savedData || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // Save session to personal calendar
  const handleSaveSession = async (sessionId: string) => {
    if (!user?.id) return;

    try {
      const isAlreadySaved = savedSessions.some(
        (s) => s.session_id === sessionId
      );

      if (isAlreadySaved) {
        // Remove from saved
        const { error } = await (supabase as unknown as any)
          .from("saved_sessions")
          .delete()
          .eq("session_id", sessionId)
          .eq("student_id", user.id);

        if (error) throw error;
        setSavedSessions(
          savedSessions.filter((s) => s.session_id !== sessionId)
        );
      } else {
        // Add to saved
        const { error } = await (supabase as unknown as any)
          .from("saved_sessions")
          .insert({
            session_id: sessionId,
            student_id: user.id,
            saved_at: new Date().toISOString(),
          });

        if (error) throw error;
        setSavedSessions([
          ...savedSessions,
          {
            id: `temp-${sessionId}`,
            session_id: sessionId,
            student_id: user.id,
            saved_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to save session:", err);
    }
  };

  // Filter sessions based on search and view mode
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (!filterMonth) return matchesSearch;

    const sessionDate = new Date(session.date_time);
    return (
      matchesSearch &&
      sessionDate.getMonth() === currentDate.getMonth() &&
      sessionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group sessions by date for calendar view
  const groupedByDate: { [key: string]: LiveSession[] } = {};
  filteredSessions.forEach((session) => {
    const date = new Date(session.date_time).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(session);
  });

  // Get calendar days for current month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const isSaved = (sessionId: string) => {
    return savedSessions.some((s) => s.session_id === sessionId);
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Live Sessions</h1>
          <p className="text-blue-100">
            Join upcoming webinars and live classes
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </Card>
        )}

        {/* Controls */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Controls */}
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={() => setViewMode("calendar")}
                  className={`${
                    viewMode === "calendar"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
                <Button
                  onClick={() => setViewMode("list")}
                  className={`${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  List
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  This month only
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <div className="space-y-6">
            {/* Month Navigation */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={handlePrevMonth}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => setCurrentDate(new Date())}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Today
                  </Button>
                  <Button
                    onClick={handleNextMonth}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center font-semibold text-gray-700 p-2"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({
                      length: getFirstDayOfMonth(currentDate),
                    }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-2 h-24 bg-gray-100" />
                    ))}

                    {Array.from({ length: getDaysInMonth(currentDate) }).map(
                      (_, i) => {
                        const day = i + 1;
                        const date = new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          day
                        );
                        const dateStr = date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        });

                        const dayEvents = groupedByDate[dateStr] || [];
                        const isToday =
                          new Date().toLocaleDateString() ===
                          date.toLocaleDateString();

                        return (
                          <div
                            key={day}
                            className={`p-2 h-24 border rounded-lg overflow-y-auto ${
                              isToday
                                ? "bg-blue-50 border-blue-300"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <div className="font-semibold text-sm text-gray-900 mb-1">
                              {day}
                            </div>
                            <div className="space-y-1">
                              {dayEvents.slice(0, 2).map((session) => (
                                <div
                                  key={session.id}
                                  className="text-xs bg-blue-100 text-blue-800 p-1 rounded truncate cursor-pointer hover:bg-blue-200"
                                  title={session.title}
                                >
                                  {formatTime(session.date_time)}
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-gray-600 font-medium">
                                  +{dayEvents.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Sessions List for Selected Period */}
            {filteredSessions.length === 0 ? (
              <Card className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No sessions found in this period
                </p>
              </Card>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Upcoming Sessions
                </h2>
                <div className="grid gap-4">
                  {filteredSessions.map((session) => (
                    <Card
                      key={session.id}
                      className="p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {session.title}
                          </h3>
                          {session.description && (
                            <p className="text-gray-600 text-sm mb-3">
                              {session.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDate(session.date_time)} at{" "}
                              {formatTime(session.date_time)}
                            </div>
                            {session.instructor_name && (
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {session.instructor_name}
                              </div>
                            )}
                            {session.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {session.location}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 md:items-end">
                          <Badge className="bg-blue-100 text-blue-800 w-fit">
                            Upcoming
                          </Badge>
                          <Button
                            onClick={() => handleSaveSession(session.id)}
                            className={`gap-2 ${
                              isSaved(session.id)
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                          >
                            <Heart
                              className="w-4 h-4"
                              fill={isSaved(session.id) ? "currentColor" : "none"}
                            />
                            {isSaved(session.id) ? "Saved" : "Save"}
                          </Button>
                          <a
                            href={session.join_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button className="bg-blue-600 hover:bg-blue-700 gap-2 w-full">
                              Join Now
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-4">
            {filteredSessions.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No sessions found</p>
              </Card>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Showing {filteredSessions.length} session
                  {filteredSessions.length !== 1 ? "s" : ""}
                </p>
                <div className="grid gap-4">
                  {filteredSessions.map((session) => (
                    <Card
                      key={session.id}
                      className="p-4 md:p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                            {session.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 md:gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">
                                {formatDate(session.date_time)} at{" "}
                                {formatTime(session.date_time)}
                              </span>
                            </div>
                            {session.instructor_name && (
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">
                                  {session.instructor_name}
                                </span>
                              </div>
                            )}
                          </div>
                          {session.description && (
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {session.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0 justify-end">
                          <Button
                            onClick={() => handleSaveSession(session.id)}
                            size="sm"
                            className={`${
                              isSaved(session.id)
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                          >
                            <Heart
                              className="w-4 h-4"
                              fill={isSaved(session.id) ? "currentColor" : "none"}
                            />
                          </Button>
                          <a
                            href={session.join_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Join
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.length}
                </p>
                <p className="text-sm text-gray-600">Upcoming Sessions</p>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-50">
              <div className="text-center">
                <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {savedSessions.length}
                </p>
                <p className="text-sm text-gray-600">Saved Sessions</p>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="text-center">
                <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSessions.length}
                </p>
                <p className="text-sm text-gray-600">Filtered Results</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
