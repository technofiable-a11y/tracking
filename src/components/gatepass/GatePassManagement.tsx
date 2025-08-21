import { useState } from "react";
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  MessageSquare,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample gate pass data
const gatePasses = [
  {
    id: "GP001",
    visitorName: "John Wilson",
    company: "Tech Solutions Ltd",
    purpose: "Client Meeting",
    hostName: "Sarah Johnson",
    department: "Sales",
    dateTime: "2024-01-20 14:30",
    status: "Approved",
    progress: 75,
    currentStep: "Security Check",
    whatsappSent: true,
    lastUpdate: "5 mins ago"
  },
  {
    id: "GP002", 
    visitorName: "Maria Garcia",
    company: "Design Corp",
    purpose: "Project Review",
    hostName: "Mike Davis",
    department: "Operations",
    dateTime: "2024-01-20 16:00",
    status: "Pending",
    progress: 25,
    currentStep: "Approval Pending",
    whatsappSent: false,
    lastUpdate: "15 mins ago"
  },
  {
    id: "GP003",
    visitorName: "Robert Chen",
    company: "BuildTech Inc",
    purpose: "Site Inspection",
    hostName: "Lisa Wang",
    department: "Engineering",
    dateTime: "2024-01-20 10:00",
    status: "Completed",
    progress: 100,
    currentStep: "Visit Completed", 
    whatsappSent: true,
    lastUpdate: "2 hours ago"
  },
  {
    id: "GP004",
    visitorName: "Emily Davis",
    company: "Consultant",
    purpose: "Training Session",
    hostName: "Alex Brown",
    department: "HR",
    dateTime: "2024-01-21 09:00", 
    status: "Rejected",
    progress: 0,
    currentStep: "Application Rejected",
    whatsappSent: true,
    lastUpdate: "1 hour ago"
  }
];

const statusConfig = {
  "Pending": { color: "bg-warning", icon: Clock },
  "Approved": { color: "bg-success", icon: CheckCircle },
  "Rejected": { color: "bg-danger", icon: XCircle },
  "Completed": { color: "bg-techno-blue", icon: CheckCircle }
};

const processSteps = [
  "Application Submitted",
  "Approval Pending", 
  "Approved",
  "Security Check",
  "Visit in Progress",
  "Visit Completed"
];

export function GatePassManagement() {
  const [selectedPass, setSelectedPass] = useState(gatePasses[0]);

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || AlertCircle;
    return Icon;
  };

  const getStatusColor = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return config?.color || "bg-muted";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gate Pass Management</h2>
          <p className="text-muted-foreground">
            Track visitor gate passes and automate WhatsApp notifications
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
          <Plus className="mr-2 h-4 w-4" />
          New Gate Pass
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Passes</p>
                <p className="text-2xl font-bold">{gatePasses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-success flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">
                  {gatePasses.filter(p => p.status === "Approved").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-lg bg-warning/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {gatePasses.filter(p => p.status === "Pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-lg bg-techno-blue/20 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-techno-blue" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">WhatsApp Sent</p>
                <p className="text-2xl font-bold">
                  {gatePasses.filter(p => p.whatsappSent).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Gate Pass List */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Gate Pass Applications</CardTitle>
              <CardDescription>
                Monitor all gate pass requests and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pass ID</TableHead>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>WhatsApp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gatePasses.map((pass) => {
                    const StatusIcon = getStatusIcon(pass.status);
                    return (
                      <TableRow 
                        key={pass.id} 
                        className="hover:bg-muted/50 cursor-pointer transition-smooth"
                        onClick={() => setSelectedPass(pass)}
                      >
                        <TableCell className="font-medium">{pass.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{pass.visitorName}</div>
                            <div className="text-sm text-muted-foreground">{pass.company}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            {pass.dateTime}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(pass.status)}/10 text-${getStatusColor(pass.status).replace('bg-', '')}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {pass.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={pass.progress} className="h-2" />
                            <div className="text-xs text-muted-foreground">{pass.progress}%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={pass.whatsappSent ? "default" : "secondary"}>
                            {pass.whatsappSent ? "Sent" : "Pending"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Gate Pass Details */}
        <div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Pass Details - {selectedPass.id}</CardTitle>
              <CardDescription>
                Real-time tracking and WhatsApp automation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visitor Info */}
              <div className="space-y-3">
                <h4 className="font-semibold">Visitor Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    {selectedPass.visitorName}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {selectedPass.company}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {selectedPass.dateTime}
                  </div>
                </div>
              </div>

              {/* Host Info */}
              <div className="space-y-3">
                <h4 className="font-semibold">Host Information</h4>
                <div className="space-y-2 text-sm">
                  <div>Host: {selectedPass.hostName}</div>
                  <div>Department: {selectedPass.department}</div>
                  <div>Purpose: {selectedPass.purpose}</div>
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="space-y-3">
                <h4 className="font-semibold">Process Status</h4>
                <div className="space-y-2">
                  <Progress value={selectedPass.progress} className="h-3" />
                  <div className="text-sm text-muted-foreground">
                    Current Step: {selectedPass.currentStep}
                  </div>
                </div>
              </div>

              {/* Process Steps */}
              <div className="space-y-3">
                <h4 className="font-semibold">Process Timeline</h4>
                <div className="space-y-2">
                  {processSteps.map((step, index) => (
                    <div key={step} className={`flex items-center text-sm ${
                      index < (selectedPass.progress / 100) * processSteps.length 
                        ? 'text-success' 
                        : 'text-muted-foreground'
                    }`}>
                      <div className={`h-2 w-2 rounded-full mr-3 ${
                        index < (selectedPass.progress / 100) * processSteps.length
                          ? 'bg-success'
                          : 'bg-muted'
                      }`} />
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Actions */}
              <div className="space-y-3">
                <h4 className="font-semibold">WhatsApp Automation</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Status Update
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Send Instructions
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Last updated: {selectedPass.lastUpdate}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}