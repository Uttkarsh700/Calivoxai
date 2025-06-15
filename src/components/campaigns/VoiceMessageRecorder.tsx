
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VoiceRecorder from "@/components/campaigns/VoiceRecorder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ChannelType } from "@/types";
import { useCampaignApi } from "@/hooks/use-campaign-api";

interface VoiceMessageRecorderProps {
  channel: ChannelType;
  onRecordingComplete: (blob: Blob) => void;
  onModeChange: (useVoice: boolean) => void;
}

const VoiceMessageRecorder = ({ channel, onRecordingComplete, onModeChange }: VoiceMessageRecorderProps) => {
  const [useVoice, setUseVoice] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const { isSendingTest, handleSendTest } = useCampaignApi();

  const handleVoiceToggle = (checked: boolean) => {
    setUseVoice(checked);
    onModeChange(checked);
  };

  const handleVoiceRecordingComplete = (blob: Blob, url: string, duration: number) => {
    setAudioBlob(blob);
    onRecordingComplete(blob);
  };

  const handleSendTestVoice = async () => {
    if (!testPhoneNumber) {
      return;
    }

    if (!audioBlob) {
      return;
    }

    await handleSendTest(channel, testPhoneNumber, audioBlob);
  };

  return (
    <Card className="p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <Label htmlFor="use-voice-message">Use Voice Message</Label>
        <Switch
          id="use-voice-message"
          checked={useVoice}
          onCheckedChange={handleVoiceToggle}
        />
      </div>

      {useVoice && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Record a voice message to send instead of text
          </div>

          <VoiceRecorder
            onRecordingComplete={handleVoiceRecordingComplete}
            maxDuration={120}
          />

          {audioBlob && (
            <div className="space-y-4">
              <div className="font-medium">Send Test Voice Message</div>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Enter phone number"
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value)}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={isSendingTest || !audioBlob}
                  onClick={handleSendTestVoice}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Test
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Send a test voice message to verify your recording
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default VoiceMessageRecorder;
