
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { checkMongoConnection } from "@/lib/mongodb";

export function MongoDBStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      try {
        const connected = await checkMongoConnection();
        setIsConnected(connected);
      } catch (error) {
        console.error("Error checking MongoDB connection:", error);
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
  }, []);

  if (isConnected === null) {
    return (
      <Alert className="mb-4 bg-gray-100">
        <AlertCircle className="h-4 w-4 text-gray-500" />
        <AlertTitle>Checking Database Connection</AlertTitle>
        <AlertDescription>
          Verifying connection to database...
        </AlertDescription>
      </Alert>
    );
  }

  if (isConnected) {
    return (
      <Alert className="mb-4 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>Database Connected</AlertTitle>
        <AlertDescription>
          Using simulated database connection for development.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Database Connection Failed</AlertTitle>
      <AlertDescription>
        Unable to connect to database. Please check your connection settings.
      </AlertDescription>
    </Alert>
  );
}
