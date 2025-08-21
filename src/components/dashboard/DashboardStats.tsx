import { 
  Users, 
  MessageCircle, 
  Shield, 
  TrendingUp,
  Mail,
  Phone
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Contacts",
    value: "2,847",
    change: "+12%",
    trend: "up",
    icon: Users,
    description: "Active contacts in system"
  },
  {
    title: "Messages Sent",
    value: "18,924",
    change: "+23%",
    trend: "up", 
    icon: MessageCircle,
    description: "This month"
  },
  {
    title: "Gate Passes",
    value: "1,356", 
    change: "+8%",
    trend: "up",
    icon: Shield,
    description: "Processed this week"
  },
  {
    title: "Email Campaigns",
    value: "84",
    change: "+15%",
    trend: "up",
    icon: Mail,
    description: "Active campaigns"
  },
  {
    title: "WhatsApp Messages",
    value: "5,672",
    change: "+31%", 
    trend: "up",
    icon: Phone,
    description: "Messages sent today"
  },
  {
    title: "Success Rate",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    icon: TrendingUp,
    description: "Overall delivery rate"
  }
];

export function DashboardStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover-scale shadow-card transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  stat.trend === 'up' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-warning/10 text-warning'
                }`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}