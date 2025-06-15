import { ObjectId } from 'mongodb';

export type ChannelType = 'sms' | 'whatsapp' | 'ivr';

export type ContactStatus = 'active' | 'inactive' | 'pending';

export type DeliveryStatus = 'pending' | 'sent' | 'delivered' | 'failed';

export interface Contact {
  _id?: string | ObjectId;
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: ContactStatus;
  tags?: string[];
  createdAt: Date;
}

export interface Campaign {
  _id?: string | ObjectId;
  id: string;
  name: string;
  channel: ChannelType;
  message?: string;
  script?: string;
  voiceRecording?: string;
  contactsCount: number;
  status: 'draft' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  progress: {
    pending: number;
    sent: number;
    delivered: number;
    failed: number;
  };
  scheduledFor?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id?: string | ObjectId;
  id: string;
  campaignId: string;
  contactId: string;
  content: string;
  channel: ChannelType;
  status: DeliveryStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  voiceRecordingUrl?: string;
  duration?: number;
}

export interface CampaignFormData {
  name: string;
  channel: ChannelType;
  message?: string;
  script?: string;
  voiceRecording?: string;
  contacts: string[];
  scheduledFor?: Date;
  useVoiceMessage?: boolean;
  targetGroups?: string[];
  sendImmediately?: boolean;
  deliveryWindow?: {
    start: string;
    end: string;
  };
}

export interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  messagesSent: number;
  messagesDelivered: number;
  deliveryRate: number;
}

export interface CampaignFilter {
  status?: ('draft' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled')[];
  channel?: ChannelType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}
