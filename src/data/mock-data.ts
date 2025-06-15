
import { Campaign, ChannelType, Contact, Message } from "@/types";

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "+1234567890",
    email: "john@example.com",
    status: "active",
    tags: ["customer", "vip"],
    createdAt: new Date("2023-01-15")
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "+1987654321",
    email: "jane@example.com",
    status: "active",
    tags: ["customer"],
    createdAt: new Date("2023-02-20")
  },
  {
    id: "3",
    name: "Robert Johnson",
    phone: "+1122334455",
    email: "robert@example.com",
    status: "inactive",
    createdAt: new Date("2023-03-10")
  },
  {
    id: "4",
    name: "Lisa Brown",
    phone: "+1555666777",
    email: "lisa@example.com",
    status: "active",
    tags: ["prospect"],
    createdAt: new Date("2023-04-05")
  },
  {
    id: "5",
    name: "Michael Wilson",
    phone: "+1999888777",
    status: "pending",
    createdAt: new Date("2023-05-12")
  },
  {
    id: "6",
    name: "Sarah Davis",
    phone: "+1777888999",
    email: "sarah@example.com",
    status: "active",
    tags: ["customer", "new"],
    createdAt: new Date("2023-06-01")
  }
];

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Winter Sale Announcement",
    channel: "sms",
    message: "Get 30% off on all products until the end of the month! Shop now at example.com/sale",
    contactsCount: 1250,
    status: "completed",
    progress: {
      pending: 0,
      sent: 1250,
      delivered: 1180,
      failed: 70
    },
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2023-12-01")
  },
  {
    id: "2",
    name: "Customer Satisfaction Survey",
    channel: "whatsapp",
    message: "Hello! We value your opinion. Please take a moment to complete our customer satisfaction survey: example.com/survey",
    contactsCount: 850,
    status: "in-progress",
    progress: {
      pending: 320,
      sent: 530,
      delivered: 490,
      failed: 40
    },
    createdAt: new Date("2023-12-10"),
    updatedAt: new Date("2023-12-10")
  },
  {
    id: "3",
    name: "Appointment Reminder",
    channel: "ivr",
    script: "Hello, this is a reminder about your appointment scheduled for tomorrow. Press 1 to confirm, press 2 to reschedule.",
    contactsCount: 450,
    status: "scheduled",
    scheduledFor: new Date("2023-12-15T09:00:00"),
    progress: {
      pending: 450,
      sent: 0,
      delivered: 0,
      failed: 0
    },
    createdAt: new Date("2023-12-05"),
    updatedAt: new Date("2023-12-05")
  },
  {
    id: "4",
    name: "New Product Launch",
    channel: "whatsapp",
    message: "Exciting news! We've just launched our new product. Check it out at example.com/newproduct",
    contactsCount: 2000,
    status: "draft",
    progress: {
      pending: 2000,
      sent: 0,
      delivered: 0,
      failed: 0
    },
    createdAt: new Date("2023-12-08"),
    updatedAt: new Date("2023-12-08")
  }
];

export const mockMessages: Message[] = [
  {
    id: "1",
    campaignId: "1",
    contactId: "1",
    content: "Get 30% off on all products until the end of the month! Shop now at example.com/sale",
    channel: "sms",
    status: "delivered",
    sentAt: new Date("2023-12-01T10:15:00"),
    deliveredAt: new Date("2023-12-01T10:15:05"),
    createdAt: new Date("2023-12-01T10:14:50"),
    updatedAt: new Date("2023-12-01T10:15:05")
  },
  {
    id: "2",
    campaignId: "1",
    contactId: "2",
    content: "Get 30% off on all products until the end of the month! Shop now at example.com/sale",
    channel: "sms",
    status: "failed",
    sentAt: new Date("2023-12-01T10:15:00"),
    errorMessage: "Invalid phone number",
    createdAt: new Date("2023-12-01T10:14:50"),
    updatedAt: new Date("2023-12-01T10:15:10")
  }
];

export const getChannelColor = (channel: ChannelType): string => {
  switch (channel) {
    case "sms":
      return "bg-blue-500";
    case "whatsapp":
      return "bg-green-500";
    case "ivr":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
};

export const getChannelIcon = (channel: ChannelType): string => {
  switch (channel) {
    case "sms":
      return "message-square";
    case "whatsapp":
      return "message-circle";
    case "ivr":
      return "phone";
    default:
      return "message-square";
  }
};
