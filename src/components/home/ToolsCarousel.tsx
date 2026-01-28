import {
  BarChart3, Search, Mail, Share2, Target, TrendingUp, Users, FileText,
  Globe, Megaphone, PieChart, Zap, Layers, Video, Image, Palette,
  MessageSquare, Calendar, Database, Shield, Link, Settings, Terminal,
  Activity, Award, Bell, Bookmark, Box, Camera, Check, Clock, Cloud,
  Code, Compass, CreditCard, Download, Edit, Eye, Filter, Flag, Folder,
  Gift, Heart, HelpCircle, Home, Inbox, Info, Key, Layout, List, Lock,
  Map, Monitor, Music, Navigation, Package, Paperclip, Phone, Printer,
  Radio, RefreshCw, Rss, Save, Send, Server, Shuffle, Sliders, Smartphone,
  Speaker, Star, Sun, Tag, ThumbsUp, Trash, Truck, Tv, Upload, Volume2,
  Wifi, Wind, Wrench, X, Youtube, Linkedin, Instagram, Facebook, Twitter
} from "lucide-react";

const tools = [
  { name: "Google Analytics", icon: BarChart3 },
  { name: "SEMrush", icon: Search },
  { name: "Mailchimp", icon: Mail },
  { name: "Hootsuite", icon: Share2 },
  { name: "Google Ads", icon: Target },
  { name: "Ahrefs", icon: TrendingUp },
  { name: "HubSpot", icon: Users },
  { name: "Buffer", icon: FileText },
  { name: "Moz", icon: Globe },
  { name: "Sprout Social", icon: Megaphone },
  { name: "Tableau", icon: PieChart },
  { name: "Zapier", icon: Zap },
  { name: "Canva", icon: Layers },
  { name: "Loom", icon: Video },
  { name: "Figma", icon: Image },
  { name: "Adobe Suite", icon: Palette },
  { name: "Slack", icon: MessageSquare },
  { name: "Calendly", icon: Calendar },
  { name: "Notion", icon: Database },
  { name: "LastPass", icon: Shield },
  { name: "Bitly", icon: Link },
  { name: "Trello", icon: Settings },
  { name: "GitHub", icon: Terminal },
  { name: "Hotjar", icon: Activity },
  { name: "Buzzsumo", icon: Award },
  { name: "Mention", icon: Bell },
  { name: "Pocket", icon: Bookmark },
  { name: "Dropbox", icon: Box },
  { name: "Snapseed", icon: Camera },
  { name: "Grammarly", icon: Check },
  { name: "Clockify", icon: Clock },
  { name: "AWS", icon: Cloud },
  { name: "VS Code", icon: Code },
  { name: "Clearbit", icon: Compass },
  { name: "Stripe", icon: CreditCard },
  { name: "WeTransfer", icon: Download },
  { name: "Hemingway", icon: Edit },
  { name: "Crazy Egg", icon: Eye },
  { name: "Intercom", icon: Filter },
  { name: "ClickUp", icon: Flag },
  { name: "Google Drive", icon: Folder },
  { name: "ReferralCandy", icon: Gift },
  { name: "Wishpond", icon: Heart },
  { name: "ChatGPT", icon: HelpCircle },
  { name: "WordPress", icon: Home },
  { name: "Front", icon: Inbox },
  { name: "Typeform", icon: Info },
  { name: "1Password", icon: Key },
  { name: "Webflow", icon: Layout },
  { name: "Asana", icon: List },
  { name: "Auth0", icon: Lock },
  { name: "Mapbox", icon: Map },
  { name: "Loom", icon: Monitor },
  { name: "Spotify", icon: Music },
  { name: "Waze", icon: Navigation },
  { name: "Shippo", icon: Package },
  { name: "Evernote", icon: Paperclip },
  { name: "Twilio", icon: Phone },
  { name: "HP Print", icon: Printer },
  { name: "Anchor", icon: Radio },
  { name: "SyncWith", icon: RefreshCw },
  { name: "Feedly", icon: Rss },
  { name: "Autosave", icon: Save },
  { name: "SendGrid", icon: Send },
  { name: "DigitalOcean", icon: Server },
  { name: "IFTTT", icon: Shuffle },
  { name: "Amplitude", icon: Sliders },
  { name: "App Store", icon: Smartphone },
  { name: "Clubhouse", icon: Speaker },
  { name: "Trustpilot", icon: Star },
  { name: "Toggl", icon: Sun },
  { name: "Labelbox", icon: Tag },
  { name: "Facebook Ads", icon: ThumbsUp },
  { name: "Cleaner", icon: Trash },
  { name: "ShipStation", icon: Truck },
  { name: "YouTube Studio", icon: Tv },
  { name: "Uploadcare", icon: Upload },
  { name: "Podcasts", icon: Volume2 },
  { name: "Speedtest", icon: Wifi },
  { name: "Tailwind CSS", icon: Wind },
  { name: "Xero", icon: Wrench },
];

const ToolCard = ({ tool }: { tool: { name: string; icon: React.ElementType } }) => {
  const Icon = tool.icon;
  return (
    <div className="flex-shrink-0 w-36 h-28 glass rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-110 hover:glow-teal cursor-pointer group">
      <Icon className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
      <span className="text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
        {tool.name}
      </span>
    </div>
  );
};

export const ToolsCarousel = () => {
  const firstRow = tools.slice(0, Math.ceil(tools.length / 2));
  const secondRow = tools.slice(Math.ceil(tools.length / 2));

  return (
    <section className="py-20 overflow-hidden bg-card/50">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Master </span>
            <span className="text-gradient">75+ Marketing Tools</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get hands-on experience with the most powerful digital marketing tools used by industry professionals worldwide.
          </p>
        </div>
      </div>

      {/* First Row - Left to Right */}
      <div className="relative mb-6">
        <div className="flex gap-4 animate-scroll">
          {[...firstRow, ...firstRow].map((tool, index) => (
            <ToolCard key={`${tool.name}-${index}`} tool={tool} />
          ))}
        </div>
      </div>

      {/* Second Row - Right to Left */}
      <div className="relative">
        <div className="flex gap-4 animate-scroll-reverse">
          {[...secondRow, ...secondRow].map((tool, index) => (
            <ToolCard key={`${tool.name}-${index}`} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
};
