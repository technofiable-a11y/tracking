import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  MessageCircle, 
  Eye, 
  Reply, 
  CheckCircle, 
  XCircle, 
  Clock,
  Smartphone,
  MessageSquare,
  TrendingUp
} from "lucide-react";

interface EmailTracking {
  id: string;
  clinicName: string;
  email: string;
  status: 'sent' | 'delivered' | 'opened' | 'replied' | 'failed';
  sentAt: string;
  openedAt?: string;
  repliedAt?: string;
  subject: string;
}

interface WhatsAppTracking {
  id: string;
  manpowerName: string;
  phone: string;
  hasWhatsApp: boolean;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'sms_sent';
  sentAt: string;
  readAt?: string;
  messageType: 'whatsapp' | 'sms';
}

export const CampaignTracking = () => {
  // Mock data for demonstration
  const [emailTrackings] = useState<EmailTracking[]>([
    {
      id: '1',
      clinicName: 'City Medical Center',
      email: 'info@citymedical.com',
      status: 'replied',
      sentAt: '2024-01-20 10:30',
      openedAt: '2024-01-20 11:15',
      repliedAt: '2024-01-20 14:30',
      subject: 'Partnership Opportunity - Healthcare Solutions'
    },
    {
      id: '2',
      clinicName: 'Care Plus Hospital',
      email: 'admin@careplus.com',
      status: 'opened',
      sentAt: '2024-01-20 10:30',
      openedAt: '2024-01-20 12:45',
      subject: 'Partnership Opportunity - Healthcare Solutions'
    },
    {
      id: '3',
      clinicName: 'Health First Clinic',
      email: 'contact@healthfirst.com',
      status: 'delivered',
      sentAt: '2024-01-20 10:30',
      subject: 'Partnership Opportunity - Healthcare Solutions'
    }
  ]);

  const [whatsappTrackings] = useState<WhatsAppTracking[]>([
    {
      id: '1',
      manpowerName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      hasWhatsApp: true,
      status: 'read',
      sentAt: '2024-01-20 09:15',
      readAt: '2024-01-20 09:45',
      messageType: 'whatsapp'
    },
    {
      id: '2',
      manpowerName: 'Priya Sharma',
      phone: '+91 87654 32109',
      hasWhatsApp: false,
      status: 'sms_sent',
      sentAt: '2024-01-20 09:15',
      messageType: 'sms'
    },
    {
      id: '3',
      manpowerName: 'Amit Singh',
      phone: '+91 76543 21098',
      hasWhatsApp: true,
      status: 'delivered',
      sentAt: '2024-01-20 09:15',
      messageType: 'whatsapp'
    }
  ]);

  const getStatusBadge = (status: string, type: 'email' | 'whatsapp') => {
    const variants = {
      sent: { variant: "secondary" as const, icon: Clock, text: "Sent" },
      delivered: { variant: "default" as const, icon: CheckCircle, text: "Delivered" },
      opened: { variant: "default" as const, icon: Eye, text: "Opened" },
      read: { variant: "default" as const, icon: Eye, text: "Read" },
      replied: { variant: "default" as const, icon: Reply, text: "Replied" },
      failed: { variant: "destructive" as const, icon: XCircle, text: "Failed" },
      sms_sent: { variant: "secondary" as const, icon: MessageSquare, text: "SMS Sent" }
    };

    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="w-3 h-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const emailStats = {
    total: emailTrackings.length,
    delivered: emailTrackings.filter(e => ['delivered', 'opened', 'replied'].includes(e.status)).length,
    opened: emailTrackings.filter(e => ['opened', 'replied'].includes(e.status)).length,
    replied: emailTrackings.filter(e => e.status === 'replied').length
  };

  const whatsappStats = {
    total: whatsappTrackings.length,
    whatsapp: whatsappTrackings.filter(w => w.hasWhatsApp).length,
    sms: whatsappTrackings.filter(w => !w.hasWhatsApp).length,
    read: whatsappTrackings.filter(w => w.status === 'read').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-email/5 to-background border-email/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-email">
              <TrendingUp className="w-5 h-5" />
              <span>Email Campaign Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{emailStats.delivered}</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-email">{emailStats.opened}</p>
                <p className="text-sm text-muted-foreground">Opened</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{emailStats.replied}</p>
                <p className="text-sm text-muted-foreground">Replied</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {emailStats.total > 0 ? Math.round((emailStats.opened / emailStats.total) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Open Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-whatsapp/5 to-background border-whatsapp/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-whatsapp">
              <TrendingUp className="w-5 h-5" />
              <span>WhatsApp Campaign Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-whatsapp">{whatsappStats.whatsapp}</p>
                <p className="text-sm text-muted-foreground">WhatsApp</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-500">{whatsappStats.sms}</p>
                <p className="text-sm text-muted-foreground">SMS Fallback</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">{whatsappStats.read}</p>
                <p className="text-sm text-muted-foreground">Read</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {whatsappStats.total > 0 ? Math.round((whatsappStats.read / whatsappStats.total) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Read Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tracking */}
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Email Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp/SMS Tracking</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-email">Email Campaign Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              {emailTrackings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No email campaigns sent yet. Send your first email campaign to see tracking data.
                </p>
              ) : (
                <div className="space-y-4">
                  {emailTrackings.map((tracking) => (
                    <div key={tracking.id} className="p-4 bg-accent/30 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-foreground">{tracking.clinicName}</h4>
                          <p className="text-sm text-muted-foreground">{tracking.email}</p>
                        </div>
                        {getStatusBadge(tracking.status, 'email')}
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <p><span className="text-muted-foreground">Subject:</span> {tracking.subject}</p>
                        <p><span className="text-muted-foreground">Sent:</span> {tracking.sentAt}</p>
                        {tracking.openedAt && (
                          <p><span className="text-muted-foreground">Opened:</span> {tracking.openedAt}</p>
                        )}
                        {tracking.repliedAt && (
                          <p><span className="text-muted-foreground">Replied:</span> {tracking.repliedAt}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-whatsapp">WhatsApp & SMS Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              {whatsappTrackings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No WhatsApp campaigns sent yet. Send your first WhatsApp campaign to see tracking data.
                </p>
              ) : (
                <div className="space-y-4">
                  {whatsappTrackings.map((tracking) => (
                    <div key={tracking.id} className="p-4 bg-accent/30 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-foreground">{tracking.manpowerName}</h4>
                          <p className="text-sm text-muted-foreground flex items-center space-x-2">
                            <span>{tracking.phone}</span>
                            {tracking.hasWhatsApp ? (
                              <Badge variant="secondary" className="text-xs">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                WhatsApp
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                <Smartphone className="w-3 h-3 mr-1" />
                                SMS Only
                              </Badge>
                            )}
                          </p>
                        </div>
                        {getStatusBadge(tracking.status, 'whatsapp')}
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <p><span className="text-muted-foreground">Method:</span> {tracking.messageType.toUpperCase()}</p>
                        <p><span className="text-muted-foreground">Sent:</span> {tracking.sentAt}</p>
                        {tracking.readAt && (
                          <p><span className="text-muted-foreground">Read:</span> {tracking.readAt}</p>
                        )}
                        {!tracking.hasWhatsApp && (
                          <p className="text-orange-500 text-xs">
                            ⚠️ No WhatsApp detected - SMS sent as fallback
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};