import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink } from "lucide-react";
import {
  BarChart3, Mail, Share2, Target, TrendingUp, Users, FileText,
  Globe, Megaphone, PieChart, Zap, Layers, Video, Image, Palette,
  MessageSquare, Calendar, Database, Shield, Link, Settings, Terminal,
  Activity, Award, Bell, Bookmark, Box, Camera, Check, Clock, Cloud,
  Code, Compass, CreditCard, Download, Edit, Eye, Filter, Flag, Folder,
  Gift, Heart, HelpCircle, Home, Inbox, Info, Key, Layout, List, Lock,
  Map, Monitor, Music, Navigation, Package, Paperclip, Phone, Printer,
  Radio, RefreshCw, Rss, Save, Send, Server, Shuffle, Sliders, Smartphone,
  Speaker, Star, Sun, Tag, ThumbsUp, Trash, Truck, Tv, Upload, Volume2,
  Wifi, Wind, Wrench
} from "lucide-react";

const allTools = [
  { name: "Google Analytics", icon: BarChart3, category: "Analytics" },
  { name: "SEMrush", icon: Search, category: "SEO" },
  { name: "Mailchimp", icon: Mail, category: "Email" },
  { name: "Hootsuite", icon: Share2, category: "Social Media" },
  { name: "Google Ads", icon: Target, category: "Advertising" },
  { name: "Ahrefs", icon: TrendingUp, category: "SEO" },
  { name: "HubSpot", icon: Users, category: "CRM" },
  { name: "Buffer", icon: FileText, category: "Social Media" },
  { name: "Moz", icon: Globe, category: "SEO" },
  { name: "Sprout Social", icon: Megaphone, category: "Social Media" },
  { name: "Tableau", icon: PieChart, category: "Analytics" },
  { name: "Zapier", icon: Zap, category: "Automation" },
  { name: "Canva", icon: Layers, category: "Design" },
  { name: "Loom", icon: Video, category: "Video" },
  { name: "Figma", icon: Image, category: "Design" },
  { name: "Adobe Suite", icon: Palette, category: "Design" },
  { name: "Slack", icon: MessageSquare, category: "Communication" },
  { name: "Calendly", icon: Calendar, category: "Scheduling" },
  { name: "Notion", icon: Database, category: "Productivity" },
  { name: "LastPass", icon: Shield, category: "Security" },
  { name: "Bitly", icon: Link, category: "URL Shortener" },
  { name: "Trello", icon: Settings, category: "Project Management" },
  { name: "GitHub", icon: Terminal, category: "Development" },
  { name: "Hotjar", icon: Activity, category: "Analytics" },
  { name: "Buzzsumo", icon: Award, category: "Content" },
  { name: "Mention", icon: Bell, category: "Monitoring" },
  { name: "Pocket", icon: Bookmark, category: "Content" },
  { name: "Dropbox", icon: Box, category: "Storage" },
  { name: "Snapseed", icon: Camera, category: "Design" },
  { name: "Grammarly", icon: Check, category: "Writing" },
  { name: "Clockify", icon: Clock, category: "Time Tracking" },
  { name: "AWS", icon: Cloud, category: "Cloud" },
  { name: "VS Code", icon: Code, category: "Development" },
  { name: "Clearbit", icon: Compass, category: "Data" },
  { name: "Stripe", icon: CreditCard, category: "Payments" },
  { name: "WeTransfer", icon: Download, category: "File Sharing" },
  { name: "Hemingway", icon: Edit, category: "Writing" },
  { name: "Crazy Egg", icon: Eye, category: "Analytics" },
  { name: "Intercom", icon: Filter, category: "Customer Support" },
  { name: "ClickUp", icon: Flag, category: "Project Management" },
  { name: "Google Drive", icon: Folder, category: "Storage" },
  { name: "ReferralCandy", icon: Gift, category: "Marketing" },
  { name: "Wishpond", icon: Heart, category: "Landing Pages" },
  { name: "ChatGPT", icon: HelpCircle, category: "AI" },
  { name: "WordPress", icon: Home, category: "CMS" },
  { name: "Front", icon: Inbox, category: "Email" },
  { name: "Typeform", icon: Info, category: "Forms" },
  { name: "1Password", icon: Key, category: "Security" },
  { name: "Webflow", icon: Layout, category: "Website Builder" },
  { name: "Asana", icon: List, category: "Project Management" },
  { name: "Auth0", icon: Lock, category: "Security" },
  { name: "Mapbox", icon: Map, category: "Maps" },
  { name: "Screenflow", icon: Monitor, category: "Video" },
  { name: "Spotify Ads", icon: Music, category: "Advertising" },
  { name: "Waze Ads", icon: Navigation, category: "Advertising" },
  { name: "Shippo", icon: Package, category: "Shipping" },
  { name: "Evernote", icon: Paperclip, category: "Notes" },
  { name: "Twilio", icon: Phone, category: "Communication" },
  { name: "PrintFlow", icon: Printer, category: "Print" },
  { name: "Anchor", icon: Radio, category: "Podcasts" },
  { name: "SyncWith", icon: RefreshCw, category: "Integration" },
  { name: "Feedly", icon: Rss, category: "Content" },
  { name: "Autosave Pro", icon: Save, category: "Productivity" },
  { name: "SendGrid", icon: Send, category: "Email" },
  { name: "DigitalOcean", icon: Server, category: "Cloud" },
  { name: "IFTTT", icon: Shuffle, category: "Automation" },
  { name: "Amplitude", icon: Sliders, category: "Analytics" },
  { name: "App Annie", icon: Smartphone, category: "Analytics" },
  { name: "Clubhouse", icon: Speaker, category: "Audio" },
  { name: "Trustpilot", icon: Star, category: "Reviews" },
  { name: "Toggl", icon: Sun, category: "Time Tracking" },
  { name: "Labelbox", icon: Tag, category: "Data" },
  { name: "Facebook Ads", icon: ThumbsUp, category: "Advertising" },
  { name: "CleanMyMac", icon: Trash, category: "Utility" },
  { name: "ShipStation", icon: Truck, category: "Shipping" },
  { name: "YouTube Studio", icon: Tv, category: "Video" },
  { name: "Uploadcare", icon: Upload, category: "Media" },
  { name: "Podcast App", icon: Volume2, category: "Podcasts" },
  { name: "Speedtest", icon: Wifi, category: "Utility" },
  { name: "Tailwind CSS", icon: Wind, category: "Development" },
  { name: "Xero", icon: Wrench, category: "Accounting" },
];

const categories = [...new Set(allTools.map(tool => tool.category))].sort();

const Tools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Header */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                <span className="text-foreground">Marketing </span>
                <span className="text-gradient">Tools Library</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Explore 75+ essential digital marketing tools. Learn how to use each one effectively in our courses.
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-background border-border"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-6 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  !selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All Tools
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.name}
                    className="group glass rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:glow-teal cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm text-foreground mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {tool.category}
                    </p>
                    <ExternalLink className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 mt-2 transition-opacity" />
                  </div>
                );
              })}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tools found matching your search.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tools;
