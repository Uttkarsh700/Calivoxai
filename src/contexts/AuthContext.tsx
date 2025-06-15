import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log('Clerk Key:', clerkPubKey); // Debug log

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Clerk
    if (!clerkPubKey) {
      console.error('Missing Clerk Publishable Key');
    } else {
      console.log('Clerk initialized with key:', clerkPubKey);
    }
  }, []);

  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
    >
      {children}
    </ClerkProvider>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl={window.location.pathname} />
      </SignedOut>
    </>
  );
} 