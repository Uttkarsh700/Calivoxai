import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CampaignFormData, ChannelType, Contact } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, MessageSquare, Phone, UserCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateCampaignFormProps {
  contacts: Contact[];
  defaultChannel?: ChannelType;
}

const CreateCampaignForm = ({ contacts, defaultChannel = "sms" }: CreateCampaignFormProps) => {
  const navigate = useNavigate();
  const [channel, setChannel] = useState<ChannelType>(defaultChannel);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [script, setScript] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChannelChange = (value: string) => {
    setChannel(value as ChannelType);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Please enter a campaign name");
      return;
    }
    
    if (channel === "ivr" && !script) {
      toast.error("Please enter a call script");
      return;
    }
    
    if ((channel === "sms" || channel === "whatsapp") && !message) {
      toast.error("Please enter a message");
      return;
    }
    
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact");
      return;
    }
    
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Campaign created successfully");
      navigate("/campaigns");
    }, 2000);
  };

  const handleSelectAll = () => {
    if (contacts.length > 0) {
      // If there are already selected contacts, clear the selection
      if (selectedContacts.length > 0) {
        setSelectedContacts([]);
      } else {
        // Otherwise select all contacts
        setSelectedContacts(contacts.map(contact => contact.id));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="name">Campaign Name</Label>
          <Input
            id="name"
            placeholder="Enter campaign name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Channel</Label>
          <Tabs value={channel} onValueChange={handleChannelChange} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="sms" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>SMS</span>
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </TabsTrigger>
              <TabsTrigger value="ivr" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>IVR Call</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sms" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="sms-message">SMS Message</Label>
                <Textarea
                  id="sms-message"
                  placeholder="Enter your SMS message"
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {message.length} / 160 characters
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="whatsapp" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-message">WhatsApp Message</Label>
                <Textarea
                  id="whatsapp-message"
                  placeholder="Enter your WhatsApp message"
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="ivr" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="ivr-script">IVR Call Script</Label>
                <Textarea
                  id="ivr-script"
                  placeholder="Enter your call script"
                  className="min-h-[120px]"
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                />
                <div className="text-xs text-muted-foreground">
                  Write your script with clear instructions for the call.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label>Contacts</Label>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4" />
                <span>Select Contacts</span>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAll}
              >
                {selectedContacts.length > 0 ? "Deselect All" : "Select All"}
              </Button>
            </div>
            
            <div className="space-y-4">
              <Select
                value={selectedContacts.length > 0 ? "selected" : "not-selected"}
                onValueChange={() => {}}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contacts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selected">
                    {selectedContacts.length} contacts selected
                  </SelectItem>
                  <SelectItem value="not-selected">
                    No contacts selected
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <div className="text-sm text-muted-foreground">
                For this demo, all contacts will be automatically selected
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate("/campaigns")}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateCampaignForm;
