import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Mail, MessageCircle, Upload, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  category: 'clinic' | 'manpower';
  status: 'active' | 'inactive';
}

export const ContactManager = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    category: "clinic" as "clinic" | "manpower"
  });
  const { toast } = useToast();

  const handleAddContact = () => {
    if (!newContact.name) {
      toast({
        title: "Missing Name",
        description: "Please enter a contact name",
        variant: "destructive",
      });
      return;
    }

    if (newContact.category === 'clinic' && !newContact.email) {
      toast({
        title: "Missing Email",
        description: "Email is required for clinic contacts",
        variant: "destructive",
      });
      return;
    }

    if (newContact.category === 'manpower' && !newContact.phone) {
      toast({
        title: "Missing Phone",
        description: "Phone number is required for manpower contacts",
        variant: "destructive",
      });
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      email: newContact.email || undefined,
      phone: newContact.phone || undefined,
      category: newContact.category,
      status: 'active'
    };

    setContacts([...contacts, contact]);
    setNewContact({ name: "", email: "", phone: "", category: "clinic" });
    
    toast({
      title: "Contact Added",
      description: `${contact.name} has been added to your contacts`,
    });
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast({
      title: "Contact Deleted",
      description: "Contact has been removed from your list",
    });
  };

  const clinicContacts = contacts.filter(contact => contact.category === 'clinic');
  const manpowerContacts = contacts.filter(contact => contact.category === 'manpower');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Contact */}
        <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Plus className="w-5 h-5" />
              <span>Add New Contact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contactName">Name</Label>
              <Input
                id="contactName"
                placeholder="Contact name"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              />
            </div>

            <div>
              <Label>Category</Label>
              <Tabs 
                value={newContact.category} 
                onValueChange={(value) => setNewContact({...newContact, category: value as "clinic" | "manpower"})}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="clinic">Clinic</TabsTrigger>
                  <TabsTrigger value="manpower">Manpower</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {newContact.category === 'clinic' && (
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="clinic@example.com"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                />
              </div>
            )}

            {newContact.category === 'manpower' && (
              <div>
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                />
              </div>
            )}

            <Button onClick={handleAddContact} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </CardContent>
        </Card>

        {/* Bulk Import */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Bulk Import</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Import contacts from CSV files or other sources.
            </p>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Import CSV File
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Import from Email List
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>CSV Format:</p>
              <p>Name, Email/Phone, Category</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Stats */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Contact Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Clinic Contacts</span>
                </span>
                <span className="font-semibold text-email">{clinicContacts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Manpower Contacts</span>
                </span>
                <span className="font-semibold text-whatsapp">{manpowerContacts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Contacts</span>
                <span className="font-semibold">{contacts.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Lists */}
      <Tabs defaultValue="clinic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clinic" className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Clinic Contacts ({clinicContacts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="manpower" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Manpower Contacts ({manpowerContacts.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="clinic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-email">Clinic Email Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              {clinicContacts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No clinic contacts added yet. Add your first clinic contact above.
                </p>
              ) : (
                <div className="space-y-2">
                  {clinicContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manpower" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-whatsapp">Manpower WhatsApp Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              {manpowerContacts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No manpower contacts added yet. Add your first manpower contact above.
                </p>
              ) : (
                <div className="space-y-2">
                  {manpowerContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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