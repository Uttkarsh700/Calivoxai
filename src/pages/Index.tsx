
import AppLayout from "@/components/layout/AppLayout";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { MongoDBStatus } from "@/components/ui/mongodb-status";

const Index = () => {
  return (
    <AppLayout>
      <MongoDBStatus />
      <DashboardOverview />
    </AppLayout>
  );
};

export default Index;
