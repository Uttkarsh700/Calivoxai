
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare, UserCheck, Send } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockContacts } from "@/data/mock-data";
import { useCampaignApi } from "@/hooks/use-campaign-api";
import VoiceMessageRecorder from "@/components/campaigns/VoiceMessageRecorder";

const SmsCampaign = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [useVoiceMessage, setUseVoiceMessage] = useState(false);
  const [voiceRecordingBlob, setVoiceRecordingBlob] = useState<Blob | null>(null);
  const [testPhoneNumber, setTestPhoneNumber] = useState("");
  
  const { isCreating, isSendingTest, handleCreateCampaign, handleSendTest } = useCampaignApi();

  const sendTestSms = async () => {
    if (!testPhoneNumber) {
      toast.error("Please enter a phone number for the test SMS");
      return;
    }
    
    if (useVoiceMessage) {
      if (!voiceRecordingBlob) {
        toast.error("Please record a voice message first");
        return;
      }
      await handleSendTest("sms", testPhoneNumber, voiceRecordingBlob);
    } else {
      if (!message) {
        toast.error("Please enter a message for the test SMS");
        return;
      }
      await handleSendTest("sms", testPhoneNumber, message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Please enter a campaign name");
      return;
    }
    
    if (!useVoiceMessage && !message) {
      toast.error("Please enter a message");
      return;
    }
    
    if (useVoiceMessage && !voiceRecordingBlob) {
      toast.error("Please record a voice message");
      return;
    }
    
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact");
      return;
    }
    
    const campaign = await handleCreateCampaign(
      {
        name,
        channel: "sms",
        message: useVoiceMessage ? undefined : message,
        contacts: selectedContacts,
        useVoiceMessage
      },
      useVoiceMessage ? voiceRecordingBlob : undefined
    );
    
    if (campaign) {
      navigate("/campaigns");
    }
  };

  const handleSelectAll = () => {
    if (mockContacts.length > 0) {
      // If there are already selected contacts, clear the selection
      if (selectedContacts.length > 0) {
        setSelectedContacts([]);
      } else {
        // Otherwise select all contacts
        setSelectedContacts(mockContacts.map(contact => contact.id));
      }
    }
  };

  const handleVoiceRecordingComplete = (blob: Blob) => {
    setVoiceRecordingBlob(blob);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create SMS Campaign</h1>
            <p className="text-muted-foreground">
              Set up a new SMS campaign
            </p>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
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
              <div className="flex items-center mb-2">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                <Label>SMS Message</Label>
              </div>
              
              {!useVoiceMessage && (
                <>
                  <Textarea
                    id="sms-message"
                    placeholder="Enter your SMS message"
                    className="min-h-[120px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={useVoiceMessage}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {message.length} / 160 characters
                  </div>
                  
                  <Card className="p-4 mt-4">
                    <div className="space-y-4">
                      <div className="font-medium">Send Test SMS</div>
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="Enter phone number"
                          value={testPhoneNumber}
                          onChange={(e) => setTestPhoneNumber(e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          disabled={isSendingTest || !message}
                          onClick={sendTestSms}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Test
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Send a test SMS to verify your message formatting
                      </p>
                    </div>
                  </Card>
                </>
              )}
              
              <VoiceMessageRecorder 
                channel="sms" 
                onRecordingComplete={handleVoiceRecordingComplete}
                onModeChange={setUseVoiceMessage}
              />
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
                    {selectedContacts.length > 0 
                      ? `${selectedContacts.length} contacts will receive this message`
                      : "Select contacts to send this message to"}
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate("/campaigns")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create SMS Campaign"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default SmsCampaign;
