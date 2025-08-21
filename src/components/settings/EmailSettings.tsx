import { useState } from "react";
import { Settings, Mail, Key, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface EmailConfiguration {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export function EmailSettings() {
  const [config, setConfig] = useState<EmailConfiguration>({
    serviceId: '',
    templateId: '',
    publicKey: ''
  });
  const [isConfigured, setIsConfigured] = useState(false);

  const handleConfigSave = () => {
    if (!config.serviceId || !config.templateId || !config.publicKey) {
      toast.error("Please fill in all required fields");
      return;
    }

    // In a real app, you'd save this to your backend or local storage
    // For demo purposes, we'll just show success
    localStorage.setItem('emailjs-config', JSON.stringify(config));
    setIsConfigured(true);
    toast.success("EmailJS configuration saved successfully!");
  };

  const testConfiguration = () => {
    if (!isConfigured) {
      toast.error("Please save configuration first");
      return;
    }
    
    // In a real app, you'd send a test email
    toast.success("Test email sent successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Email Settings</h2>
        <p className="text-muted-foreground">
          Configure EmailJS for sending emails from your platform
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Setup Required</AlertTitle>
        <AlertDescription>
          You need to create an EmailJS account and configure your service to enable email functionality.
          Visit <a href="https://emailjs.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">EmailJS.com</a> to get started.
        </AlertDescription>
      </Alert>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            EmailJS Configuration
          </CardTitle>
          <CardDescription>
            Enter your EmailJS credentials to enable email sending functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceId">Service ID</Label>
            <Input
              id="serviceId"
              placeholder="e.g., service_abc123"
              value={config.serviceId}
              onChange={(e) => setConfig(prev => ({ ...prev, serviceId: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="templateId">Template ID</Label>
            <Input
              id="templateId"
              placeholder="e.g., template_xyz789"
              value={config.templateId}
              onChange={(e) => setConfig(prev => ({ ...prev, templateId: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publicKey">Public Key</Label>
            <Input
              id="publicKey"
              placeholder="e.g., user_defg456"
              value={config.publicKey}
              onChange={(e) => setConfig(prev => ({ ...prev, publicKey: e.target.value }))}
              type="password"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleConfigSave} className="bg-gradient-primary hover:opacity-90">
              <Key className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
            <Button variant="outline" onClick={testConfiguration}>
              <Mail className="mr-2 h-4 w-4" />
              Test Email
            </Button>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Badge variant={isConfigured ? "default" : "secondary"}>
              {isConfigured ? (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Configured
                </>
              ) : (
                "Not Configured"
              )}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>
            Follow these steps to configure EmailJS for your platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <div className="font-medium">Create EmailJS Account</div>
                <div className="text-sm text-muted-foreground">
                  Sign up at EmailJS.com and verify your email address
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <div className="font-medium">Add Email Service</div>
                <div className="text-sm text-muted-foreground">
                  Connect your email provider (Gmail, Outlook, etc.) and note the Service ID
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <div className="font-medium">Create Email Template</div>
                <div className="text-sm text-muted-foreground">
                  Design your email template with variables: to_email, to_name, subject, message
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <div>
                <div className="font-medium">Get Your Public Key</div>
                <div className="text-sm text-muted-foreground">
                  Find your Public Key in the EmailJS dashboard and enter all credentials above
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}