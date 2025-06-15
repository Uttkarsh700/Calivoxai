import { Link, useLocation } from "react-router-dom";
import { MessageCircle, MessageSquare, Phone, PieChart, UploadCloud, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AppSidebar = () => {
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <div className="px-4 flex items-center justify-center">
          <Link to="/" className="text-xl font-bold text-white">Calivox ai</Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActiveRoute("/") ? "bg-accent" : ""}>
                  <Link to="/">
                    <PieChart className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className={isActiveRoute("/campaigns") || location.pathname.startsWith("/campaigns/") ? "bg-accent" : ""}
                >
                  <Link to="/campaigns">
                    <UploadCloud className="h-5 w-5" />
                    <span>Campaigns</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActiveRoute("/contacts") ? "bg-accent" : ""}>
                  <Link to="/contacts">
                    <Users className="h-5 w-5" />
                    <span>Contacts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Channels</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className={isActiveRoute("/sms-campaign") ? "bg-accent" : ""}
                >
                  <Link to="/sms-campaign">
                    <MessageSquare className="h-5 w-5" />
                    <span>SMS</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className={isActiveRoute("/whatsapp-campaign") ? "bg-accent" : ""}
                >
                  <Link to="/whatsapp-campaign">
                    <MessageCircle className="h-5 w-5" />
                    <span>WhatsApp</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className={isActiveRoute("/ivr-campaign") ? "bg-accent" : ""}
                >
                  <Link to="/ivr-campaign">
                    <Phone className="h-5 w-5" />
                    <span>IVR Call</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button className="w-full" asChild>
          <Link to="/create-campaign">
            Create Campaign
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
