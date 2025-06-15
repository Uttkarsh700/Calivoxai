
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from "@/types";
import { ArrowUpRight, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getCampaigns } from '@/api/campaigns';

interface DashboardOverviewProps {
  campaigns?: Campaign[];
}

const DashboardOverview = ({ campaigns: propCampaigns }: DashboardOverviewProps) => {
  // Fetch campaigns if not provided via props
  const { data: fetchedCampaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: getCampaigns,
    enabled: !propCampaigns,
  });

  // Use prop campaigns if provided, otherwise use the fetched campaigns
  const campaigns = propCampaigns || fetchedCampaigns || [];
  
  // Calculate summary statistics
  const activeCampaigns = campaigns.filter(c => c.status === "in-progress").length;
  const scheduledCampaigns = campaigns.filter(c => c.status === "scheduled").length;
  const completedCampaigns = campaigns.filter(c => c.status === "completed").length;
  
  const totalMessages = campaigns.reduce((sum, campaign) => sum + campaign.contactsCount, 0);
  const deliveredMessages = campaigns.reduce((sum, campaign) => sum + campaign.progress.delivered, 0);
  const failedMessages = campaigns.reduce((sum, campaign) => sum + campaign.progress.failed, 0);
  
  // Calculate channel distribution
  const smsCount = campaigns.filter(c => c.channel === "sms").length;
  const whatsappCount = campaigns.filter(c => c.channel === "whatsapp").length;
  const ivrCount = campaigns.filter(c => c.channel === "ivr").length;
  
  // Data for the chart
  const chartData = [
    { name: 'SMS', value: smsCount },
    { name: 'WhatsApp', value: whatsappCount },
    { name: 'IVR', value: ivrCount },
  ];
  
  // Data for the delivery chart
  const deliveryData = campaigns.map(campaign => ({
    name: campaign.name.length > 15 ? campaign.name.substring(0, 15) + '...' : campaign.name,
    delivered: campaign.progress.delivered,
    failed: campaign.progress.failed,
    pending: campaign.progress.pending
  }));

  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              {deliveredMessages} delivered, {failedMessages} failed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Campaigns
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {scheduledCampaigns} scheduled, {completedCampaigns} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              SMS Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.channel === "sms").reduce((sum, c) => sum + c.contactsCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {smsCount} campaigns
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              WhatsApp Messages
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.channel === "whatsapp").reduce((sum, c) => sum + c.contactsCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {whatsappCount} campaigns
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Channel Distribution</CardTitle>
            <CardDescription>
              Distribution of campaigns across channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Delivery Status</CardTitle>
            <CardDescription>
              Delivery status of recent campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={deliveryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barSize={20}
                  layout="vertical"
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Bar dataKey="delivered" stackId="a" fill="#4ade80" />
                  <Bar dataKey="failed" stackId="a" fill="#f87171" />
                  <Bar dataKey="pending" stackId="a" fill="#94a3b8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
