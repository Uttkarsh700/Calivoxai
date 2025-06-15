
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ContactsList from "@/components/contacts/ContactsList";
import ContactUpload from "@/components/contacts/ContactUpload";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockContacts } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Contacts = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
            <p className="text-muted-foreground">
              Manage your contacts and import new ones
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Contact
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">All Contacts</TabsTrigger>
            <TabsTrigger value="upload">Upload Contacts</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-6">
            <ContactsList contacts={mockContacts} />
          </TabsContent>
          <TabsContent value="upload" className="mt-6">
            <ContactUpload />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Contacts;
