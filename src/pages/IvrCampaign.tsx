
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Phone, UserCheck, Mic, StopCircle, Play, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockContacts } from "@/data/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadVoiceRecording, createCampaign, sendTestMessage } from "@/api/campaigns";

const IvrCampaign = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [script, setScript] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [contentType, setContentType] = useState<"script" | "recording">("script");
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [testPhoneNumber, setTestPhoneNumber] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setIsRecording(false);
        
        // Stop all tracks from the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setAudioBlob(null);
      setAudioUrl(null);
      
      // Start timer for recording duration
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds += 1;
        setRecordingDuration(seconds);
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Clear the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration(0);
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const sendTestCall = async () => {
    if (!testPhoneNumber) {
      toast.error("Please enter a phone number for the test call");
      return;
    }
    
    if (contentType === "recording" && !audioBlob) {
      toast.error("Please record a message first");
      return;
    }
    
    if (contentType === "script" && !script) {
      toast.error("Please enter a script for the test call");
      return;
    }
    
    setIsSendingTest(true);
    
    try {
      const content = contentType === "recording" && audioBlob 
        ? new File([audioBlob], "voice-recording.wav", { type: 'audio/wav' })
        : script;
        
      const result = await sendTestMessage("ivr", testPhoneNumber, content);
      
      if (result) {
        toast.success("Test call initiated successfully!");
      } else {
        toast.error("Failed to initiate test call");
      }
    } catch (error) {
      console.error("Error sending test call:", error);
      toast.error("Failed to send test call. Please try again.");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Please enter a campaign name");
      return;
    }
    
    if (contentType === "script" && !script) {
      toast.error("Please enter a call script");
      return;
    }
    
    if (contentType === "recording" && !audioBlob) {
      toast.error("Please record a voice message");
      return;
    }
    
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact");
      return;
    }
    
    setLoading(true);
    
    try {
      let voiceRecordingUrl = "";
      
      // If we have a recording, upload it
      if (contentType === "recording" && audioBlob) {
        const file = new File([audioBlob], `${name.replace(/\s+/g, '-')}-recording.wav`, { 
          type: 'audio/wav' 
        });
        voiceRecordingUrl = await uploadVoiceRecording(file);
      }
      
      // Create the campaign
      await createCampaign({
        name,
        channel: "ivr",
        script: contentType === "script" ? script : undefined,
        voiceRecording: contentType === "recording" ? voiceRecordingUrl : undefined,
        contacts: selectedContacts,
      });
      
      toast.success("IVR Campaign created successfully");
      navigate("/campaigns");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign. Please try again.");
    } finally {
      setLoading(false);
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create IVR Campaign</h1>
            <p className="text-muted-foreground">
              Set up a new Interactive Voice Response campaign
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
                <Phone className="h-5 w-5 mr-2 text-orange-500" />
                <Label>IVR Call Content</Label>
              </div>
              
              <Tabs 
                value={contentType} 
                onValueChange={(value) => setContentType(value as "script" | "recording")} 
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full mb-4">
                  <TabsTrigger value="script">Text Script</TabsTrigger>
                  <TabsTrigger value="recording">Voice Recording</TabsTrigger>
                </TabsList>
                
                <TabsContent value="script" className="space-y-4">
                  <Textarea
                    id="ivr-script"
                    placeholder="Enter your call script"
                    className="min-h-[120px]"
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Write your script with clear instructions for the automated call system
                  </div>
                </TabsContent>
                
                <TabsContent value="recording" className="space-y-4">
                  <Card className="p-6">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      {!audioUrl ? (
                        <div className="w-full text-center">
                          <div className="mb-4 text-muted-foreground">
                            Record your voice message for the campaign
                          </div>
                          
                          {isRecording ? (
                            <div className="flex flex-col items-center space-y-3">
                              <div className="text-red-500 animate-pulse flex items-center">
                                <Mic className="h-6 w-6 mr-2" />
                                Recording... {formatDuration(recordingDuration)}
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={stopRecording}
                              >
                                <StopCircle className="h-4 w-4 mr-2 text-red-500" />
                                Stop Recording
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              type="button" 
                              onClick={startRecording}
                            >
                              <Mic className="h-4 w-4 mr-2" />
                              Start Recording
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-4">
                            <div className="font-medium">Voice Recording</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDuration(recordingDuration)}
                            </div>
                          </div>
                          
                          <audio 
                            src={audioUrl} 
                            controls 
                            className="w-full mb-4"
                          ></audio>
                          
                          <div className="flex justify-end space-x-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={deleteRecording}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                            <Button 
                              type="button" 
                              size="sm" 
                              onClick={startRecording}
                            >
                              <Mic className="h-4 w-4 mr-2" />
                              Re-record
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div className="font-medium">Send Test Call</div>
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="Enter phone number"
                          value={testPhoneNumber}
                          onChange={(e) => setTestPhoneNumber(e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          disabled={isSendingTest || (!audioUrl && contentType === "recording")}
                          onClick={sendTestCall}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Test
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Send a test call to verify your voice recording works correctly
                      </p>
                    </div>
                  </Card>
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
                    {selectedContacts.length > 0 
                      ? `${selectedContacts.length} contacts will receive this call`
                      : "Select contacts to call with this message"}
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate("/campaigns")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create IVR Campaign"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default IvrCampaign;
