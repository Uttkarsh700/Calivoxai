import { useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const { signOut } = useClerk();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start"
      onClick={() => signOut()}
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </Button>
  );
} 