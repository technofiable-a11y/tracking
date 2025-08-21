import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, FileText, Target, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WhatsAppCampaign = () => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSendCampaign = () => {
    if (!message.trim()) {
      toast({
        title: "Missing Message",
        description: "Please enter a message before sending",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Connect Supabase for Full Features",
      description: "WhatsApp Business API, SMS fallback & delivery tracking require backend connection",
      variant: "destructive",
    });
  };

  const whatsappTemplates = [
    {
      name: "Job Opening - Healthcare",
      content: "🏥 New Healthcare Job Opportunity Available!\n\nWe are looking for qualified healthcare professionals. Competitive salary and benefits.\n\nInterested? Reply with your CV.",
    },
    {
      name: "Manpower Recruitment",
      content: "👨‍⚕️ Join Our Healthcare Team!\n\n✅ Full-time positions\n✅ Training provided\n✅ Good work environment\n\nCall us to apply: [Your Number]",
    },
    {
      name: "Urgent Hiring",
      content: "🚨 URGENT HIRING - Healthcare Staff\n\nImmediate positions available:\n• Nurses\n• Technicians\n• Support Staff\n\nApply today!",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Composer */}
        <Card className="bg-gradient-to-br from-whatsapp/5 to-background border-whatsapp/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-whatsapp">
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Campaign Composer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="whatsappMessage">WhatsApp Message</Label>
              <Textarea
                id="whatsappMessage"
                placeholder="Compose your WhatsApp message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Character count: {message.length}/1000
              </p>
            </div>
            
            <div className="bg-accent/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-whatsapp" />
                <span>Message Preview</span>
              </h4>
              <div className="bg-background/50 p-3 rounded-lg border-l-4 border-whatsapp">
                <p className="text-sm whitespace-pre-wrap">
                  {message || "Your message will appear here..."}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleSendCampaign}
              className="w-full bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground"
            >
              <Send className="w-4 h-4 mr-2" />
              Send to All Manpower Contacts
            </Button>
          </CardContent>
        </Card>

        {/* Templates & Stats */}
        <div className="space-y-6">
          {/* WhatsApp Templates */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>WhatsApp Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {whatsappTemplates.map((template, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-accent/50 hover:bg-accent/70 cursor-pointer transition-colors"
                  onClick={() => setMessage(template.content)}
                >
                  <h4 className="font-medium text-foreground mb-2">{template.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.content.split('\n')[0]}
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
                <span>WhatsApp Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Messages Sent</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Delivered</span>
                  <span className="font-semibold text-green-500">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Read</span>
                  <span className="font-semibold text-blue-500">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Failed</span>
                  <span className="font-semibold text-red-500">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Tips */}
          <Card className="bg-gradient-to-br from-whatsapp/10 to-whatsapp/5 border-whatsapp/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-whatsapp">
                <MessageCircle className="w-4 h-4" />
                <span>Advanced Features (Connect Supabase)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-whatsapp">✓</span>
                  <span>Auto-detect WhatsApp availability</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-whatsapp">✓</span>
                  <span>SMS fallback for non-WhatsApp numbers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-whatsapp">✓</span>
                  <span>Delivery & read receipt tracking</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-whatsapp">✓</span>
                  <span>Real-time campaign analytics</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-whatsapp">✓</span>
                  <span>Bulk messaging with rate limiting</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};