import { useUser, useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function Profile() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.imageUrl}
            alt={user.fullName || 'Profile'}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            <p className="text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Account Information</h2>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>

          <Button
            onClick={() => signOut()}
            variant="destructive"
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
} 