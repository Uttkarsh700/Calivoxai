import { Campaign, ChannelType, CampaignFormData, Message } from "@/types";
import { getCampaignsCollection, getMessagesCollection } from "@/lib/mongodb";

// Get all campaigns
export async function getCampaigns(): Promise<Campaign[]> {
  console.log("API: Fetching all campaigns");
  
  // In a real implementation, this would make an API call to a backend
  // For demonstration, we'll return mock data
  return [
    {
      id: "campaign-1",
      name: "Welcome SMS",
      channel: "sms",
      message: "Welcome to our service!",
      contactsCount: 100,
      status: "completed",
      progress: {
        pending: 0,
        sent: 100,
        delivered: 95,
        failed: 5
      },
      scheduledFor: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "campaign-2",
      name: "Promotion WhatsApp",
      channel: "whatsapp",
      message: "Check out our new promotion!",
      contactsCount: 200,
      status: "in-progress",
      progress: {
        pending: 50,
        sent: 150,
        delivered: 145,
        failed: 5
      },
      scheduledFor: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "campaign-3",
      name: "Survey Call",
      channel: "ivr",
      script: "Hello, we'd like to ask you a few questions...",
      contactsCount: 50,
      status: "scheduled",
      progress: {
        pending: 50,
        sent: 0,
        delivered: 0,
        failed: 0
      },
      scheduledFor: new Date(Date.now() + 86400000), // tomorrow
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
}

// Get a single campaign by ID
export async function getCampaignById(id: string): Promise<Campaign | null> {
  console.log(`API: Fetching campaign with id ${id}`);
  
  const campaigns = await getCampaigns();
  return campaigns.find(campaign => campaign.id === id) || null;
}

// Create a new campaign
export async function createCampaign(campaignData: CampaignFormData): Promise<Campaign> {
  console.log("API: Creating campaign with data:", campaignData);
  
  try {
    const campaignId = `campaign-${Date.now()}`;
    const campaignsCollection = await getCampaignsCollection();
    
    const newCampaign: Campaign = {
      id: campaignId,
      name: campaignData.name,
      channel: campaignData.channel,
      message: campaignData.message,
      script: campaignData.script,
      voiceRecording: campaignData.voiceRecording,
      contactsCount: campaignData.contacts.length,
      status: 'draft',
      progress: {
        pending: campaignData.contacts.length,
        sent: 0,
        delivered: 0,
        failed: 0
      },
      scheduledFor: campaignData.scheduledFor,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await campaignsCollection.insertOne(newCampaign);
    return newCampaign;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw new Error("Failed to create campaign");
  }
}

// Update an existing campaign
export async function updateCampaign(id: string, campaignData: Partial<Campaign>): Promise<Campaign | null> {
  console.log(`API: Updating campaign ${id} with data:`, campaignData);
  
  try {
    const campaignsCollection = await getCampaignsCollection();
    
    // Get the current campaign
    const currentCampaign = await campaignsCollection.findOne({ id });
    
    if (!currentCampaign) {
      return null;
    }
    
    // Update campaign
    const updatedCampaign = {
      ...currentCampaign,
      ...campaignData,
      updatedAt: new Date()
    };
    
    await campaignsCollection.updateOne(
      { id },
      { $set: updatedCampaign }
    );
    
    return updatedCampaign;
  } catch (error) {
    console.error(`Error updating campaign ${id}:`, error);
    return null;
  }
}

// Delete a campaign
export async function deleteCampaign(id: string): Promise<boolean> {
  console.log(`API: Deleting campaign ${id}`);
  
  try {
    const campaignsCollection = await getCampaignsCollection();
    const messagesCollection = await getMessagesCollection();
    
    // Delete campaign
    const result = await campaignsCollection.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return false;
    }
    
    // Delete associated messages
    await messagesCollection.deleteMany({ campaignId: id });
    
    return true;
  } catch (error) {
    console.error(`Error deleting campaign ${id}:`, error);
    return false;
  }
}

// Schedule a campaign to run
export async function scheduleCampaign(id: string, scheduledFor: Date): Promise<Campaign | null> {
  console.log(`API: Scheduling campaign ${id} for ${scheduledFor}`);
  
  try {
    const campaignsCollection = await getCampaignsCollection();
    
    const campaign = await campaignsCollection.findOne({ id });
    
    if (!campaign) {
      return null;
    }
    
    // Update campaign status and scheduled time
    const updatedCampaign = {
      ...campaign,
      status: 'scheduled' as const,
      scheduledFor,
      updatedAt: new Date()
    };
    
    await campaignsCollection.updateOne(
      { id },
      { $set: updatedCampaign }
    );
    
    return updatedCampaign;
  } catch (error) {
    console.error(`Error scheduling campaign ${id}:`, error);
    return null;
  }
}

// Start a campaign immediately
export async function startCampaign(id: string): Promise<Campaign | null> {
  console.log(`API: Starting campaign ${id}`);
  
  try {
    const campaignsCollection = await getCampaignsCollection();
    
    const campaign = await campaignsCollection.findOne({ id });
    
    if (!campaign) {
      return null;
    }
    
    // Update campaign status
    const updatedCampaign = {
      ...campaign,
      status: 'in-progress' as const,
      updatedAt: new Date()
    };
    
    await campaignsCollection.updateOne(
      { id },
      { $set: updatedCampaign }
    );
    
    // Simulate the start of sending messages
    simulateCampaignProgress(campaign.id);
    
    return updatedCampaign;
  } catch (error) {
    console.error(`Error starting campaign ${id}:`, error);
    return null;
  }
}

// Cancel a campaign 
export async function cancelCampaign(id: string): Promise<Campaign | null> {
  console.log(`API: Cancelling campaign ${id}`);
  
  try {
    const campaignsCollection = await getCampaignsCollection();
    
    const campaign = await campaignsCollection.findOne({ id });
    
    if (!campaign) {
      return null;
    }
    
    // Update campaign status
    const updatedCampaign = {
      ...campaign,
      status: 'cancelled' as const,
      updatedAt: new Date()
    };
    
    await campaignsCollection.updateOne(
      { id },
      { $set: updatedCampaign }
    );
    
    return updatedCampaign;
  } catch (error) {
    console.error(`Error cancelling campaign ${id}:`, error);
    return null;
  }
}

// Upload a voice recording
export async function uploadVoiceRecording(file: File, campaignId?: string): Promise<string> {
  console.log(`API: Uploading voice recording${campaignId ? ` for campaign ${campaignId}` : ''}`);
  
  // Simulate API delay - in a real app, this would upload to cloud storage
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real application, this would return a URL to the uploaded file
      const recordingUrl = `https://api.example.com/recordings/${file.name.replace(/\s+/g, '-')}`;
      resolve(recordingUrl);
    }, 1500);
  });
}

// Send a test message
export async function sendTestMessage(channelType: ChannelType, phoneNumber: string, content: string | File): Promise<boolean> {
  console.log(`API: Sending test ${channelType} message to ${phoneNumber}`);
  
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real application, this would return true if the message was sent successfully
      resolve(true);
    }, 1000);
  });
}

// Get messages for a campaign
export async function getCampaignMessages(campaignId: string): Promise<Message[]> {
  console.log(`API: Fetching messages for campaign ${campaignId}`);
  
  try {
    const messagesCollection = await getMessagesCollection();
    const messages = await messagesCollection.find({ campaignId }).toArray();
    
    return messages.map(message => ({
      ...message,
      id: message.id || message._id?.toString()
    }));
  } catch (error) {
    console.error(`Error fetching messages for campaign ${campaignId}:`, error);
    return [];
  }
}

// Helper function to simulate campaign progress
async function simulateCampaignProgress(campaignId: string) {
  const updateProgress = async () => {
    try {
      const campaignsCollection = await getCampaignsCollection();
      const messagesCollection = await getMessagesCollection();
      
      // Get current campaign
      const campaign = await campaignsCollection.findOne({ id: campaignId });
      
      if (!campaign || campaign.status === 'cancelled' || campaign.progress.pending <= 0) {
        if (campaign && campaign.status !== 'cancelled' && campaign.progress.pending <= 0) {
          // Mark campaign as completed
          await campaignsCollection.updateOne(
            { id: campaignId },
            { $set: { 
                status: 'completed',
                updatedAt: new Date()
              } 
            }
          );
        }
        return;
      }
      
      // Randomly determine how many messages to send in this batch
      const batchSize = Math.min(
        Math.floor(Math.random() * 10) + 1,
        campaign.progress.pending
      );
      
      // Generate success rate (80-95%)
      const successRate = 0.8 + Math.random() * 0.15;
      const deliveredCount = Math.floor(batchSize * successRate);
      const failedCount = batchSize - deliveredCount;
      
      // Update campaign progress
      const newPending = campaign.progress.pending - batchSize;
      const newSent = campaign.progress.sent + batchSize;
      const newDelivered = campaign.progress.delivered + deliveredCount;
      const newFailed = campaign.progress.failed + failedCount;
      
      await campaignsCollection.updateOne(
        { id: campaignId },
        { 
          $set: { 
            'progress.pending': newPending,
            'progress.sent': newSent,
            'progress.delivered': newDelivered,
            'progress.failed': newFailed,
            updatedAt: new Date()
          } 
        }
      );
      
      // Create message records for this batch
      const messagesToInsert: Message[] = [];
      
      for (let i = 0; i < batchSize; i++) {
        const isDelivered = i < deliveredCount;
        const now = new Date();
        
        const message: Message = {
          id: `msg-${Date.now()}-${i}`,
          campaignId,
          contactId: `contact-${Math.floor(Math.random() * 1000)}`,
          content: campaign.message || campaign.script || "Campaign message",
          channel: campaign.channel,
          status: isDelivered ? 'delivered' : 'failed',
          sentAt: now,
          deliveredAt: isDelivered ? now : undefined,
          errorMessage: isDelivered ? undefined : "Network error or invalid number",
          createdAt: now,
          updatedAt: now,
          voiceRecordingUrl: campaign.voiceRecording
        };
        
        messagesToInsert.push(message);
      }
      
      if (messagesToInsert.length > 0) {
        await messagesCollection.insertMany(messagesToInsert);
      }
      
      // Continue simulation if there are pending messages
      if (newPending > 0) {
        setTimeout(updateProgress, 1000 + Math.random() * 2000);
      } else {
        // Mark as completed
        await campaignsCollection.updateOne(
          { id: campaignId },
          { $set: { status: 'completed', updatedAt: new Date() } }
        );
      }
      
    } catch (error) {
      console.error(`Error simulating campaign progress for ${campaignId}:`, error);
    }
  };
  
  // Start the simulation after a short delay
  setTimeout(updateProgress, 1000);
}
