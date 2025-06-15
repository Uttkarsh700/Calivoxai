
import { useState } from "react";
import { 
  createCampaign, 
  uploadVoiceRecording, 
  sendTestMessage,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  startCampaign,
  scheduleCampaign,
  cancelCampaign,
  getCampaignMessages
} from "@/api/campaigns";
import { Campaign, CampaignFormData, ChannelType, Message } from "@/types";
import { toast } from "sonner";

export function useCampaignApi() {
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Create a new campaign
  const handleCreateCampaign = async (
    campaignData: CampaignFormData,
    voiceRecordingBlob?: Blob
  ): Promise<Campaign | null> => {
    try {
      setIsCreating(true);
      
      let data = { ...campaignData };
      
      // If voice recording blob is provided, upload it first
      if (voiceRecordingBlob) {
        setIsUploading(true);
        const file = new File(
          [voiceRecordingBlob], 
          `${campaignData.name.replace(/\s+/g, '-')}-recording.wav`, 
          { type: 'audio/wav' }
        );
        
        const recordingUrl = await uploadVoiceRecording(file);
        data.voiceRecording = recordingUrl;
        setIsUploading(false);
      }
      
      const campaign = await createCampaign(data);
      toast.success(`${campaignData.channel.toUpperCase()} Campaign created successfully`);
      return campaign;
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign. Please try again.");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  // Send a test message
  const handleSendTest = async (
    channel: ChannelType, 
    phoneNumber: string, 
    content: string | File | Blob
  ): Promise<boolean> => {
    try {
      setIsSendingTest(true);
      
      let finalContent: string | File;
      
      // Convert Blob to File if needed
      if (content instanceof Blob && !(content instanceof File)) {
        finalContent = new File(
          [content], 
          `test-recording-${Date.now()}.wav`, 
          { type: 'audio/wav' }
        );
      } else {
        finalContent = content as string | File;
      }
      
      const result = await sendTestMessage(channel, phoneNumber, finalContent);
      
      if (result) {
        toast.success(`Test ${channel.toUpperCase()} sent successfully!`);
      } else {
        toast.error(`Failed to send test ${channel}`);
      }
      
      return result;
    } catch (error) {
      console.error(`Error sending test ${channel}:`, error);
      toast.error(`Failed to send test ${channel}. Please try again.`);
      return false;
    } finally {
      setIsSendingTest(false);
    }
  };

  // Fetch all campaigns
  const fetchCampaigns = async (): Promise<Campaign[]> => {
    try {
      setIsFetching(true);
      const campaigns = await getCampaigns();
      return campaigns;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to fetch campaigns");
      return [];
    } finally {
      setIsFetching(false);
    }
  };

  // Fetch a single campaign by ID
  const fetchCampaign = async (id: string): Promise<Campaign | null> => {
    try {
      setIsFetching(true);
      const campaign = await getCampaignById(id);
      return campaign;
    } catch (error) {
      console.error(`Error fetching campaign ${id}:`, error);
      toast.error("Failed to fetch campaign details");
      return null;
    } finally {
      setIsFetching(false);
    }
  };

  // Update an existing campaign
  const handleUpdateCampaign = async (id: string, data: Partial<Campaign>): Promise<Campaign | null> => {
    try {
      setIsLoading(true);
      const updated = await updateCampaign(id, data);
      if (updated) {
        toast.success("Campaign updated successfully");
      } else {
        toast.error("Campaign not found");
      }
      return updated;
    } catch (error) {
      console.error(`Error updating campaign ${id}:`, error);
      toast.error("Failed to update campaign");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a campaign
  const handleDeleteCampaign = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await deleteCampaign(id);
      if (success) {
        toast.success("Campaign deleted successfully");
      } else {
        toast.error("Campaign not found");
      }
      return success;
    } catch (error) {
      console.error(`Error deleting campaign ${id}:`, error);
      toast.error("Failed to delete campaign");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Start a campaign immediately
  const handleStartCampaign = async (id: string): Promise<Campaign | null> => {
    try {
      setIsLoading(true);
      const campaign = await startCampaign(id);
      if (campaign) {
        toast.success("Campaign started successfully");
      } else {
        toast.error("Campaign not found");
      }
      return campaign;
    } catch (error) {
      console.error(`Error starting campaign ${id}:`, error);
      toast.error("Failed to start campaign");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Schedule a campaign
  const handleScheduleCampaign = async (id: string, date: Date): Promise<Campaign | null> => {
    try {
      setIsLoading(true);
      const campaign = await scheduleCampaign(id, date);
      if (campaign) {
        toast.success(`Campaign scheduled for ${date.toLocaleString()}`);
      } else {
        toast.error("Campaign not found");
      }
      return campaign;
    } catch (error) {
      console.error(`Error scheduling campaign ${id}:`, error);
      toast.error("Failed to schedule campaign");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel a campaign
  const handleCancelCampaign = async (id: string): Promise<Campaign | null> => {
    try {
      setIsLoading(true);
      const campaign = await cancelCampaign(id);
      if (campaign) {
        toast.success("Campaign cancelled successfully");
      } else {
        toast.error("Campaign not found");
      }
      return campaign;
    } catch (error) {
      console.error(`Error cancelling campaign ${id}:`, error);
      toast.error("Failed to cancel campaign");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for a campaign
  const fetchCampaignMessages = async (campaignId: string): Promise<Message[]> => {
    try {
      setIsFetching(true);
      const messages = await getCampaignMessages(campaignId);
      return messages;
    } catch (error) {
      console.error(`Error fetching messages for campaign ${campaignId}:`, error);
      toast.error("Failed to fetch campaign messages");
      return [];
    } finally {
      setIsFetching(false);
    }
  };

  return {
    // States
    isCreating,
    isUploading,
    isSendingTest,
    isLoading,
    isFetching,
    
    // Campaign operations
    handleCreateCampaign,
    handleSendTest,
    fetchCampaigns,
    fetchCampaign,
    handleUpdateCampaign,
    handleDeleteCampaign,
    handleStartCampaign,
    handleScheduleCampaign,
    handleCancelCampaign,
    fetchCampaignMessages
  };
}
