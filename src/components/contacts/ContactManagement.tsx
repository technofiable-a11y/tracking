import { useState } from "react";
import * as XLSX from "xlsx"; 
import { 
  Plus, 
  Upload, 
  Filter, 
  Search,
  MoreHorizontal,
  Phone,
  Mail,
  User,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Initial Sample data
const initialContacts = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1 234 567 8900",
    company: "Tech Corp",
    type: "Client",
    status: "Active",
    lastContact: "2 hours ago"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com", 
    phone: "+1 234 567 8901",
    company: "Design Studio",
    type: "Manpower",
    status: "Active",
    lastContact: "1 day ago"
  }
];

export function ContactManagement() {
  const [contactsData, setContactsData] = useState(initialContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "Client",
  });

  // Filter Logic
  const filteredContacts = contactsData.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "All" || contact.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Excel Import Handler
  const handleExcelImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const formattedData = jsonData.map((row, idx) => ({
        id: Date.now() + idx,
        name: row.name || "",
        email: row.email || "",
        phone: row.phone || "",
        company: row.company || "",
        type: row.type || "Client",
        status: "Active",
        lastContact: "Just now",
      }));

      setContactsData((prev) => [...prev, ...formattedData]);
    };
    reader.readAsArrayBuffer(file);
  };

  // Add Contact Handler
  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) return alert("Name & Email required!");
    const newEntry = {
      id: Date.now(),
      ...newContact,
      status: "Active",
      lastContact: "Just now",
    };
    setContactsData((prev) => [...prev, newEntry]);
    setNewContact({ name: "", email: "", phone: "", company: "", type: "Client" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
          <p className="text-muted-foreground">
            Manage your clients and manpower contacts
          </p>
        </div>
        <div className="flex space-x-2">
          {/* Excel Import */}
          <label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelImport}
              className="hidden"
            />
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import Excel
            </Button>
          </label>

          {/* Add Contact */}
          <Button onClick={handleAddContact} className="bg-gradient-primary hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Add New Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
          />
          <Input
            placeholder="Company"
            value={newContact.company}
            onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
          />
          <select
            className="border rounded p-2"
            value={newContact.type}
            onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
          >
            <option value="Client">Client</option>
            <option value="Manpower">Manpower</option>
          </select>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Total</CardTitle>
            <User className="h-4 w-4" />
          </CardHeader>
          <CardContent>{contactsData.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Clients</CardTitle>
            <Building className="h-4 w-4" />
          </CardHeader>
          <CardContent>{contactsData.filter(c=>c.type==="Client").length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Manpower</CardTitle>
            <User className="h-4 w-4" />
          </CardHeader>
          <CardContent>{contactsData.filter(c=>c.type==="Manpower").length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Active</CardTitle>
            <Badge>Active</Badge>
          </CardHeader>
          <CardContent>{contactsData.filter(c=>c.status==="Active").length}</CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Contact List</CardTitle>
          <CardDescription>View and manage all your contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter: {filterType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterType("All")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("Client")}>Clients</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("Manpower")}>Manpower</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contacts Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {contact.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {contact.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>
                    <Badge>{contact.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{contact.status}</Badge>
                  </TableCell>
                  <TableCell>{contact.lastContact}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
