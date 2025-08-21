import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Users, Send, BarChart3, Activity } from "lucide-react";
import { EmailCampaign } from "@/components/EmailCampaign";
import { WhatsAppCampaign } from "@/components/WhatsAppCampaign";
import { ContactManager } from "@/components/ContactManager";
import { CampaignTracking } from "@/components/CampaignTracking";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp' | 'contacts' | 'tracking'>('email');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-email flex items-center justify-center">
                <Send className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">BulkMessenger</h1>
                <p className="text-sm text-muted-foreground">Professional Outreach Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Messages Sent Today</p>
                <p className="text-xl font-semibold text-primary">0</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 mb-8 p-1 bg-card/50 rounded-xl backdrop-blur-sm border border-border/50">
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'email'
                ? 'bg-email text-email-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">Email</span>
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'whatsapp'
                ? 'bg-whatsapp text-whatsapp-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">WhatsApp</span>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'contacts'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">Contacts</span>
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'tracking'
                ? 'bg-secondary text-secondary-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">Tracking</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-email/10 to-email/5 border-email/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-email">
                <Mail className="w-5 h-5" />
                <span>Email Contacts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">Clinic emails ready</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-whatsapp/10 to-whatsapp/5 border-whatsapp/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-whatsapp">
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp Contacts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">Manpower contacts ready</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-primary">
                <BarChart3 className="w-5 h-5" />
                <span>Success Rate</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">0%</p>
              <p className="text-sm text-muted-foreground">Overall delivery rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="min-h-[400px]">
          {activeTab === 'email' && <EmailCampaign />}
          {activeTab === 'whatsapp' && <WhatsAppCampaign />}
          {activeTab === 'contacts' && <ContactManager />}
          {activeTab === 'tracking' && <CampaignTracking />}
        </div>
      </div>
    </div>
  );
};

export default Index;