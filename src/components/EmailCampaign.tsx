import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, FileText, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';

export const EmailCampaign = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailsSent, setEmailsSent] = useState(0);
  const { toast } = useToast();

  const handleSendCampaign = async () => {
    if (!subject || !message || !senderName || !senderEmail || !recipientEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before sending",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const templateParams = {
        from_name: senderName,
        from_email: senderEmail,
        to_email: recipientEmail,
        subject: subject,
        message: message,
      };

      // You need to replace these with your EmailJS service ID, template ID, and public key
      await emailjs.send(
        'service_iiif97n',
        'template_f4d9grm',
        templateParams,
        'YFadarA7IGC-KoqKH'
      );

      setEmailsSent(prev => prev + 1);
      toast({
        title: "Email Sent Successfully!",
        description: `Email sent to ${recipientEmail}`,
      });
      
      // Clear form after successful send
      setSubject("");
      setMessage("");
      setRecipientEmail("");
    } catch (error) {
      toast({
        title: "Failed to Send Email",
        description: "Please check your EmailJS configuration and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const emailTemplates = [
    {
      name: "Clinic Partnership",
      subject: "Partnership Opportunity - Healthcare Solutions",
      content: "Dear Clinic Team,\n\nWe would like to explore partnership opportunities to enhance your healthcare services...",
    },
    {
      name: "Medical Equipment",
      subject: "Premium Medical Equipment Solutions",
      content: "Dear Healthcare Provider,\n\nDiscover our latest range of medical equipment designed to improve patient care...",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Composer */}
        <Card className="bg-gradient-to-br from-email/5 to-background border-email/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-email">
              <Mail className="w-5 h-5" />
              <span>Email Campaign Composer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  placeholder="Your Name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="senderEmail">Sender Email</Label>
                <Input
                  id="senderEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                placeholder="Enter email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="recipient@clinic.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="message">Email Message</Label>
              <Textarea
                id="message"
                placeholder="Compose your email message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
              />
            </div>
            
            <Button 
              onClick={handleSendCampaign}
              disabled={isLoading}
              className="w-full bg-email hover:bg-email/90 text-email-foreground disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? "Sending..." : "Send Email"}
            </Button>
          </CardContent>
        </Card>

        {/* Templates & Stats */}
        <div className="space-y-6">
          {/* Email Templates */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Email Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {emailTemplates.map((template, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-accent/50 hover:bg-accent/70 cursor-pointer transition-colors"
                  onClick={() => {
                    setSubject(template.subject);
                    setMessage(template.content);
                  }}
                >
                  <h4 className="font-medium text-foreground">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.subject}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Campaign Stats */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Campaign Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Emails Sent</span>
                  <span className="font-semibold">{emailsSent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Delivered</span>
                  <span className="font-semibold text-green-500">{emailsSent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Opened</span>
                  <span className="font-semibold text-blue-500">-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Failed</span>
                  <span className="font-semibold text-red-500">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Features */}
          <Card className="bg-gradient-to-br from-email/10 to-email/5 border-email/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-email">
                <Mail className="w-4 h-4" />
                <span>Advanced Tracking (Connect Supabase)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-email">✓</span>
                  <span>Real-time delivery confirmations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-email">✓</span>
                  <span>Open rate tracking & timestamps</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-email">✓</span>
                  <span>Reply detection and management</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-email">✓</span>
                  <span>Individual clinic engagement analytics</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-email">✓</span>
                  <span>Automated follow-up campaigns</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};