import { useState, useEffect } from "react";
import { toast } from "sonner";
import { initializeEmailJS, sendEmail, sendBulkEmails, EmailParams } from "@/services/emailService";
import { 
  Send, 
  Mail, 
  MessageCircle, 
  Users, 
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample message templates
const emailTemplates = [
  {
    id: 1,
    name: "Welcome Message",
    subject: "Welcome to Our Services",
    content: "Dear {name},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nTechno Team"
  },
  {
    id: 2,
    name: "Meeting Reminder",
    subject: "Meeting Reminder - {date}",
    content: "Hi {name},\n\nThis is a friendly reminder about our meeting scheduled for {date} at {time}.\n\nLooking forward to connecting with you!\n\nBest regards"
  }
];

const whatsappTemplates = [
  {
    id: 1,
    name: "Gate Pass Approved",
    content: "Hi {name}! Your gate pass for {date} has been approved. Please arrive at the main entrance. Pass ID: {passId}"
  },
  {
    id: 2,
    name: "Status Update",
    content: "Hello {name}, your application status has been updated to: {status}. For more details, please contact us."
  }
];

// Sample campaign data
const campaigns = [
  {
    id: 1,
    name: "Monthly Newsletter",
    type: "Email",
    status: "Active",
    recipients: 1247,
    sent: 1180,
    opened: 890,
    clicked: 234,
    scheduled: "2024-01-25 09:00"
  },
  {
    id: 2,
    name: "Gate Pass Reminders", 
    type: "WhatsApp",
    status: "Completed",
    recipients: 156,
    sent: 156,
    delivered: 152,
    read: 145,
    scheduled: "2024-01-20 14:30"
  },
  {
    id: 3,
    name: "Weekly Updates",
    type: "Email",
    status: "Scheduled",
    recipients: 890,
    sent: 0,
    opened: 0,
    clicked: 0,
    scheduled: "2024-01-27 10:00"
  }
];

export function MessageComposer() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [messageType, setMessageType] = useState("email");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipients, setRecipients] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize EmailJS when component mounts
    initializeEmailJS();
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    const templates = messageType === "email" ? emailTemplates : whatsappTemplates;
    const template = templates.find(t => t.id.toString() === templateId);
    
    if (template) {
      if (messageType === "email" && "subject" in template && typeof template.subject === "string") {
        setSubject(template.subject);
      }
      setContent(template.content);
    }
  };

  const handleSendMessage = async () => {
    if (!content.trim()) {
      toast.error("Please enter message content");
      return;
    }

    if (messageType === "email" && !subject.trim()) {
      toast.error("Please enter email subject");
      return;
    }

    if (!recipients) {
      toast.error("Please select recipients");
      return;
    }

    setIsLoading(true);

    try {
      if (messageType === "email") {
        // Sample recipients data - in real app this would come from your contact management
        const sampleRecipients = [
          { email: "client1@example.com", name: "John Doe" },
          { email: "client2@example.com", name: "Jane Smith" },
          { email: "manager@example.com", name: "Mike Johnson" }
        ];

        const { success, failed } = await sendBulkEmails(sampleRecipients, subject, content);
        
        if (success > 0) {
          toast.success(`Email sent successfully to ${success} recipients`);
          if (failed > 0) {
            toast.warning(`${failed} emails failed to send`);
          }
          // Reset form
          setSubject("");
          setContent("");
          setRecipients("");
          setSelectedTemplate("");
        } else {
          toast.error("Failed to send emails");
        }
      } else {
        // WhatsApp messaging would be handled here
        toast.info("WhatsApp integration coming soon!");
      }
    } catch (error) {
      console.error("Send error:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Message Center</h2>
          <p className="text-muted-foreground">
            Compose and manage email campaigns and WhatsApp messages
          </p>
        </div>
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">Compose Message</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Message Composer */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Compose New Message</CardTitle>
                <CardDescription>
                  Create email campaigns or WhatsApp messages for your contacts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Message Type Selection */}
                <div className="flex space-x-2">
                  <Button
                    variant={messageType === "email" ? "default" : "outline"}
                    onClick={() => setMessageType("email")}
                    className="flex-1"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    variant={messageType === "whatsapp" ? "default" : "outline"}
                    onClick={() => setMessageType("whatsapp")}
                    className="flex-1"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>

                {/* Template Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Choose Template (Optional)
                  </label>
                    <Select value={selectedTemplate} onValueChange={(value: string) => {
                      setSelectedTemplate(value);
                      handleTemplateSelect(value);
                    }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {(messageType === "email" ? emailTemplates : whatsappTemplates).map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Recipients */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Recipients</label>
                  <Select value={recipients} onValueChange={setRecipients}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Contacts</SelectItem>
                      <SelectItem value="clients">Clients Only</SelectItem>
                      <SelectItem value="manpower">Manpower Only</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Email Subject (only for email) */}
                {messageType === "email" && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      placeholder="Enter email subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                )}

                {/* Message Content */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Message Content
                  </label>
                  <Textarea
                    placeholder={
                      messageType === "email" 
                        ? "Enter your email content here..." 
                        : "Enter your WhatsApp message here..."
                    }
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-32"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Use {"{name}"}, {"{date}"}, {"{time}"} for dynamic content
                  </div>
                </div>

                {/* Send Options */}
                <div className="flex space-x-2 pt-4">
                  <Button 
                    className="bg-gradient-primary hover:opacity-90 transition-smooth flex-1"
                    onClick={handleSendMessage}
                    disabled={isLoading}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isLoading ? "Sending..." : "Send Now"}
                  </Button>
                  <Button variant="outline" disabled={isLoading}>
                    <Clock className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Message Preview</CardTitle>
                <CardDescription>
                  Preview how your message will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 space-y-3">
                  {messageType === "email" && (
                    <>
                      <div className="font-semibold">Subject:</div>
                      <div className="text-sm bg-muted p-2 rounded">
                        {subject || "No subject"}
                      </div>
                    </>
                  )}
                  <div className="font-semibold">Content:</div>
                  <div className="text-sm bg-muted p-3 rounded min-h-24 whitespace-pre-wrap">
                    {content || `Your ${messageType} message will appear here...`}
                  </div>
                  
                  {recipients && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Recipients: {recipients}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Campaign Management</CardTitle>
              <CardDescription>
                Track and manage your email and WhatsApp campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-smooth">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                          {campaign.type === "Email" ? (
                            <Mail className="h-5 w-5 text-white" />
                          ) : (
                            <MessageCircle className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.type} Campaign
                          </div>
                        </div>
                      </div>
                      
                      <Badge 
                        variant={
                          campaign.status === "Active" ? "default" :
                          campaign.status === "Completed" ? "secondary" :
                          "outline"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Recipients</div>
                        <div className="font-medium">{campaign.recipients}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Sent</div>
                        <div className="font-medium">{campaign.sent}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">
                          {campaign.type === "Email" ? "Opened" : "Delivered"}
                        </div>
                        <div className="font-medium">
                          {campaign.type === "Email" ? campaign.opened : campaign.delivered}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">
                          {campaign.type === "Email" ? "Clicked" : "Read"}
                        </div>
                        <div className="font-medium">
                          {campaign.type === "Email" ? campaign.clicked : campaign.read}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        Scheduled: {campaign.scheduled}
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Email Templates */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>
                  Pre-configured email templates for common use cases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {emailTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{template.name}</div>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Subject: {template.subject}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {template.content}
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Add New Template
                </Button>
              </CardContent>
            </Card>

            {/* WhatsApp Templates */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>WhatsApp Templates</CardTitle>
                <CardDescription>
                  Pre-configured WhatsApp message templates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {whatsappTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{template.name}</div>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-3">
                      {template.content}
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Add New Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}