import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../integrations/supabase/client";
import {
  Briefcase,
  MapPin,
  Clock,
  ExternalLink,
  Search,
  Filter,
  FileText,
  Zap,
  MessageCircle,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs } from "../../components/ui/tabs";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  apply_link: string;
  description?: string;
  posted_at?: string;
}

interface Mentor {
  id: string;
  user_id: string;
  expertise: string;
  bio?: string;
  name?: string;
}

interface Message {
  id: string;
  mentor_id: string;
  student_id: string;
  content: string;
  sender_type: "student" | "mentor";
  created_at: string;
}

interface ResumeTip {
  title: string;
  description: string;
  link?: string;
}

export default function CareerSupport() {
  const { user, userProfile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("jobs");

  const locations = new Set<string>();
  const types = new Set<string>();
  jobs.forEach((job) => {
    locations.add(job.location);
    types.add(job.type);
  });

  // Fetch jobs and mentors
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch jobs
        const { data: jobsData, error: jobsError } = await (
          supabase as unknown as any
        )
          .from("job_board")
          .select("*")
          .order("posted_at", { ascending: false });

        if (jobsError) throw jobsError;
        setJobs(jobsData || []);
        setFilteredJobs(jobsData || []);

        // Fetch mentors
        const { data: mentorsData, error: mentorsError } = await (
          supabase as unknown as any
        )
          .from("mentors")
          .select("*")
          .eq("available", true);

        if (mentorsError) throw mentorsError;
        setMentors(mentorsData || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter !== "All") {
      filtered = filtered.filter((job) => job.location === locationFilter);
    }

    if (typeFilter !== "All") {
      filtered = filtered.filter((job) => job.type === typeFilter);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, locationFilter, typeFilter, jobs]);

  // Fetch messages for selected mentor
  useEffect(() => {
    if (!selectedMentor || !user) return;

    const fetchMessages = async () => {
      try {
        const { data: messagesData, error: messagesError } = await (
          supabase as unknown as any
        )
          .from("messages")
          .select("*")
          .eq("mentor_id", selectedMentor)
          .eq("student_id", user.id)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedMentor, user]);

  // Send message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedMentor || !user) return;

    try {
      const { error } = await (supabase as unknown as any)
        .from("messages")
        .insert({
          mentor_id: selectedMentor,
          student_id: user.id,
          content: messageText,
          sender_type: "student",
        });

      if (error) throw error;
      setMessageText("");

      // Refresh messages
      const { data: messagesData } = await (supabase as unknown as any)
        .from("messages")
        .select("*")
        .eq("mentor_id", selectedMentor)
        .eq("student_id", user.id)
        .order("created_at", { ascending: true });

      setMessages(messagesData || []);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const resumeTips: ResumeTip[] = [
    {
      title: "Resume Format Best Practices",
      description:
        "Learn the proper formatting standards for professional resumes including fonts, spacing, and layout.",
      link: "https://www.indeed.com/career-advice/resumes-cover-letters/how-to-format-a-resume",
    },
    {
      title: "Action Verbs for Impact",
      description:
        "Discover powerful action verbs to use in your resume to make your achievements stand out.",
      link: "https://www.indeed.com/career-advice/resumes-cover-letters/action-verbs-for-resume",
    },
    {
      title: "ATS Optimization",
      description:
        "Optimize your resume to pass Applicant Tracking Systems and reach hiring managers.",
      link: "https://www.jobscan.co/blog/ats-resume/",
    },
    {
      title: "Skills Section Strategy",
      description:
        "Learn how to highlight relevant skills that match job descriptions and impress employers.",
      link: "https://www.thebalancemoney.com/skills-resume-2062023",
    },
  ];

  const aiSuggestions = [
    {
      icon: "✓",
      text: "Quantify your achievements with numbers (e.g., 'Increased sales by 25%')",
    },
    {
      icon: "✓",
      text: "Keep your resume to one page if you have less than 5 years of experience",
    },
    {
      icon: "✓",
      text: "Use industry-specific keywords from job descriptions you're applying to",
    },
    {
      icon: "✓",
      text: "Include metrics and results, not just job duties",
    },
    {
      icon: "✓",
      text: "Tailor your resume to each job application for better ATS matching",
    },
    {
      icon: "✓",
      text: "Keep a consistent format with bullet points and clear section headings",
    },
  ];

  if (userProfile?.role !== "student") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
        <Card className="max-w-md mx-auto border-red-200 bg-red-50">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p>This page is only accessible to students.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Career Support Hub</h1>
          <p className="text-blue-100">
            Discover opportunities, build your resume, and connect with mentors
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </Card>
        )}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* Job Board Tab */}
          <div>
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("jobs")}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "jobs"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Briefcase className="w-4 h-4 inline mr-2" />
                Job Board
              </button>
              <button
                onClick={() => setActiveTab("resume")}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "resume"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Resume Resources
              </button>
              <button
                onClick={() => setActiveTab("mentors")}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "mentors"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Mentor Support
              </button>
            </div>

            {/* Job Board Content */}
            {activeTab === "jobs" && (
              <div className="space-y-6 mt-6">
                {/* Search Bar */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Search jobs by title or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Filter className="w-4 h-4 inline mr-2" />
                          Location
                        </label>
                        <select
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>All</option>
                          {Array.from(locations).map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Filter className="w-4 h-4 inline mr-2" />
                          Job Type
                        </label>
                        <select
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>All</option>
                          {Array.from(types).map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Job Count */}
                <p className="text-sm text-gray-600">
                  Showing {filteredJobs.length} of {jobs.length} jobs
                </p>

                {/* Jobs List */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No jobs found. Try adjusting your filters.</p>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredJobs.map((job) => (
                      <Card
                        key={job.id}
                        className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {job.title}
                            </h3>
                            <p className="text-lg text-blue-600 font-medium mb-3">
                              {job.company}
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.type}
                              </div>
                            </div>
                            {job.description && (
                              <p className="text-gray-600 line-clamp-2">
                                {job.description}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 md:items-end">
                            <Badge className="bg-blue-100 text-blue-800">
                              {job.type}
                            </Badge>
                            <a
                              href={job.apply_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                                Apply Now
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Resume Resources Tab */}
            {activeTab === "resume" && (
              <div className="space-y-6 mt-6">
                {/* Resume Tips */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Resume Building Resources
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {resumeTips.map((tip, idx) => (
                      <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {tip.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {tip.description}
                        </p>
                        {tip.link && (
                          <a href={tip.link} target="_blank" rel="noopener noreferrer">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              Learn More
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </a>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>

                {/* AI Suggestions */}
                <Card className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-yellow-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-amber-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      AI Resume Suggestions
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-start p-3 bg-white rounded border border-yellow-100"
                      >
                        <span className="text-green-600 font-bold mt-1">
                          {suggestion.icon}
                        </span>
                        <p className="text-gray-700 text-sm">{suggestion.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Mentors Tab */}
            {activeTab === "mentors" && (
              <div className="space-y-6 mt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Mentors List */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Available Mentors
                    </h2>
                    <div className="space-y-3">
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        </div>
                      ) : mentors.length === 0 ? (
                        <Card className="p-4 text-center text-gray-600">
                          <p>No mentors available right now</p>
                        </Card>
                      ) : (
                        mentors.map((mentor) => (
                          <Card
                            key={mentor.id}
                            className={`p-4 cursor-pointer transition-all ${
                              selectedMentor === mentor.id
                                ? "border-blue-500 bg-blue-50 border-2"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                            onClick={() => setSelectedMentor(mentor.id)}
                          >
                            <h3 className="font-semibold text-gray-900">
                              {mentor.name || "Mentor"}
                            </h3>
                            <p className="text-sm text-blue-600 font-medium">
                              {mentor.expertise}
                            </p>
                            {mentor.bio && (
                              <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                {mentor.bio}
                              </p>
                            )}
                          </Card>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Chat Window */}
                  <div className="md:col-span-2">
                    {selectedMentor ? (
                      <Card className="flex flex-col h-full max-h-96 bg-white border-blue-200 border-2">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 border-b border-gray-200">
                          {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                              <p>No messages yet. Start the conversation!</p>
                            </div>
                          ) : (
                            messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${
                                  msg.sender_type === "student"
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-xs px-4 py-2 rounded-lg ${
                                    msg.sender_type === "student"
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-200 text-gray-900"
                                  }`}
                                >
                                  <p className="text-sm">{msg.content}</p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      msg.sender_type === "student"
                                        ? "text-blue-100"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {new Date(msg.created_at).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 flex gap-2">
                          <Input
                            placeholder="Type your message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleSendMessage();
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!messageText.trim()}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ) : (
                      <Card className="p-12 text-center border-gray-200">
                        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Select a mentor to start chatting
                        </p>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
