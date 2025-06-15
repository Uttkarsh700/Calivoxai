import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Profile } from './pages/Profile';
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Campaigns from "./pages/Campaigns";
import CreateCampaign from "./pages/CreateCampaign";
import SmsCampaign from "./pages/SmsCampaign";
import WhatsappCampaign from "./pages/WhatsappCampaign";
import IvrCampaign from "./pages/IvrCampaign";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/sign-in/*" element={<SignIn />} />
              <Route path="/sign-up/*" element={<SignUp />} />

              {/* Protected routes */}
              <Route
                path="/profile"
                element={
                  <>
                    <SignedIn>
                      <Profile />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              {/* Main protected routes */}
              <Route
                path="/"
                element={
                  <>
                    <SignedIn>
                      <Index />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/contacts"
                element={
                  <>
                    <SignedIn>
                      <Contacts />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/campaigns"
                element={
                  <>
                    <SignedIn>
                      <Campaigns />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/create-campaign"
                element={
                  <>
                    <SignedIn>
                      <CreateCampaign />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/sms-campaign"
                element={
                  <>
                    <SignedIn>
                      <SmsCampaign />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/whatsapp-campaign"
                element={
                  <>
                    <SignedIn>
                      <WhatsappCampaign />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/ivr-campaign"
                element={
                  <>
                    <SignedIn>
                      <IvrCampaign />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
