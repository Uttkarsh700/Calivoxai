
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import CreateCampaignForm from "@/components/campaigns/CreateCampaignForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ChannelType } from "@/types";
import { mockContacts } from "@/data/mock-data";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [channel, setChannel] = useState<ChannelType | undefined>(undefined);
  
  useEffect(() => {
    const channelParam = searchParams.get("channel") as ChannelType | null;
    if (channelParam && ["sms", "whatsapp", "ivr"].includes(channelParam)) {
      setChannel(channelParam);
    }
  }, [searchParams]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
            <p className="text-muted-foreground">
              Set up a new communication campaign
            </p>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <CreateCampaignForm contacts={mockContacts} defaultChannel={channel} />
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateCampaign;
