
import { Campaign } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CampaignProgressProps {
  campaign: Campaign;
}

const CampaignProgress = ({ campaign }: CampaignProgressProps) => {
  const { pending, sent, delivered, failed } = campaign.progress;
  const total = campaign.contactsCount;
  
  const calculatePercentage = (value: number) => {
    return Math.round((value / total) * 100);
  };
  
  const deliveredPercent = calculatePercentage(delivered);
  const sentPercent = calculatePercentage(sent - delivered);
  const failedPercent = calculatePercentage(failed);
  const pendingPercent = calculatePercentage(pending);
  
  const pieData = [
    { name: "Delivered", value: delivered, color: "#22c55e" },
    { name: "Sent", value: sent - delivered, color: "#facc15" },
    { name: "Failed", value: failed, color: "#ef4444" },
    { name: "Pending", value: pending, color: "#94a3b8" },
  ].filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Progress</CardTitle>
        <CardDescription>
          Real-time delivery status for {campaign.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{deliveredPercent + sentPercent + failedPercent}%</span>
            </div>
            <Progress
              value={deliveredPercent + sentPercent + failedPercent}
              className="h-2"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col p-3 border rounded-lg">
              <div className="text-2xl font-semibold">{delivered}</div>
              <div className="text-sm text-muted-foreground">Delivered</div>
              <div className="mt-1 text-xs text-green-500">{deliveredPercent}%</div>
            </div>
            
            <div className="flex flex-col p-3 border rounded-lg">
              <div className="text-2xl font-semibold">{sent - delivered}</div>
              <div className="text-sm text-muted-foreground">Sent</div>
              <div className="mt-1 text-xs text-yellow-500">{sentPercent}%</div>
            </div>
            
            <div className="flex flex-col p-3 border rounded-lg">
              <div className="text-2xl font-semibold">{failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
              <div className="mt-1 text-xs text-red-500">{failedPercent}%</div>
            </div>
            
            <div className="flex flex-col p-3 border rounded-lg">
              <div className="text-2xl font-semibold">{pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
              <div className="mt-1 text-xs text-gray-500">{pendingPercent}%</div>
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                  }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#fff"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignProgress;
