
import { Campaign } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getChannelColor } from "@/data/mock-data";

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const getChannelIcon = () => {
    switch (campaign.channel) {
      case "sms":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "whatsapp":
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case "ivr":
        return <Phone className="h-4 w-4 text-orange-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusBadge = () => {
    switch (campaign.status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "in-progress":
        return <Badge variant="default" className="bg-blue-500">In Progress</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const calculateProgress = () => {
    const { sent, delivered, failed } = campaign.progress;
    const processed = sent + delivered + failed;
    return (processed / campaign.contactsCount) * 100;
  };

  const progressValue = calculateProgress();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getChannelIcon()}
            <Badge variant="outline" className="capitalize">
              {campaign.channel}
            </Badge>
          </div>
          {getStatusBadge()}
        </div>
        <CardTitle className="text-lg mt-2">{campaign.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground mb-4">
          {campaign.message || campaign.script || "No content"}
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progressValue)}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <div className="text-green-500 font-medium">{campaign.progress.delivered}</div>
              <div className="text-xs text-muted-foreground">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-500 font-medium">{campaign.progress.sent - campaign.progress.delivered}</div>
              <div className="text-xs text-muted-foreground">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-red-500 font-medium">{campaign.progress.failed}</div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          {campaign.scheduledFor ? new Date(campaign.scheduledFor).toLocaleDateString() : new Date(campaign.createdAt).toLocaleDateString()}
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link to={`/campaigns/${campaign.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;
