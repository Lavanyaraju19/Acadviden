import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Upload } from "lucide-react";

const AdminSettings = () => {
  return (
    <DashboardLayout variant="admin" userName="Admin User">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold">
            <span className="text-gradient">Settings</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your academy settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <div className="glass rounded-xl p-6 space-y-6">
              <h2 className="font-display font-semibold text-lg">General Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Academy Name</Label>
                  <Input defaultValue="Acadvizen Digital Marketing Academy" />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input defaultValue="support@acadvizen.com" />
                </div>
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input defaultValue="https://acadvizen.com" />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input defaultValue="America/New_York" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Academy Description</Label>
                <Textarea 
                  defaultValue="The premier digital marketing education platform for aspiring marketers."
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button className="bg-primary text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="branding" className="mt-6">
            <div className="glass rounded-xl p-6 space-y-6">
              <h2 className="font-display font-semibold text-lg">Branding</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Logo</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <img src="/acadvizen-logo.png" alt="Logo" className="h-16 mx-auto mb-4" />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Logo
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Favicon</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Favicon
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded bg-primary" />
                    <Input defaultValue="#14B8A6" className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Background</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded bg-background border border-border" />
                    <Input defaultValue="#0F1419" className="flex-1" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-primary text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <div className="glass rounded-xl p-6 space-y-6">
              <h2 className="font-display font-semibold text-lg">Notification Settings</h2>
              
              <div className="space-y-4">
                {[
                  { label: "New student registrations", description: "Get notified when new students sign up", default: true },
                  { label: "Course completions", description: "Get notified when students complete courses", default: true },
                  { label: "Certificate requests", description: "Get notified about certificate requests", default: true },
                  { label: "Support tickets", description: "Get notified about new support tickets", default: true },
                  { label: "Payment notifications", description: "Get notified about payments", default: true },
                  { label: "Weekly analytics report", description: "Receive weekly performance report", default: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button className="bg-primary text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <div className="glass rounded-xl p-6 space-y-6">
              <h2 className="font-display font-semibold text-lg">Integrations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Stripe", description: "Payment processing", connected: true },
                  { name: "Mailchimp", description: "Email marketing", connected: true },
                  { name: "Zoom", description: "Video conferencing", connected: false },
                  { name: "Slack", description: "Team notifications", connected: false },
                  { name: "Google Analytics", description: "Website analytics", connected: true },
                  { name: "Zapier", description: "Automation workflows", connected: false },
                ].map((integration, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/30 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                    <Button 
                      variant={integration.connected ? "outline" : "default"}
                      size="sm"
                      className={integration.connected ? "" : "bg-primary text-primary-foreground"}
                    >
                      {integration.connected ? "Connected" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
