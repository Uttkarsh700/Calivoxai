import { useUser, useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

export function AuthTest() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Authentication Status</h2>
      
      {isSignedIn ? (
        <div className="space-y-4">
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-green-800">✅ Signed in as: {user?.fullName}</p>
            <p className="text-sm text-green-600">Email: {user?.primaryEmailAddress?.emailAddress}</p>
          </div>
          
          <div className="flex gap-4">
            <Button onClick={() => signOut()}>Sign Out</Button>
            <Button variant="outline" onClick={() => window.location.href = '/profile'}>
              Go to Profile
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="text-yellow-800">⚠️ Not signed in</p>
          </div>
          
          <div className="flex gap-4">
            <Button onClick={() => window.location.href = '/sign-in'}>Sign In</Button>
            <Button variant="outline" onClick={() => window.location.href = '/sign-up'}>
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 