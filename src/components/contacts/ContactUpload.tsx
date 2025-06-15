
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

const ContactUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        toast.error("Please upload a CSV file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast.error("Please upload a CSV file");
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      toast.success("Contacts uploaded successfully");
      setUploading(false);
      setFile(null);
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Contacts</CardTitle>
        <CardDescription>
          Upload a CSV file with your contacts. The file should have columns for name and phone number.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-muted"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded">
                  <Upload size={20} className="text-primary" />
                </div>
                <div className="ml-4 text-left">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <>
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <Upload size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Drag and drop your CSV file</h3>
              <p className="text-sm text-muted-foreground mb-4">
                or browse from your computer
              </p>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
                  Select File
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </Label>
            </>
          )}
        </div>
      </CardContent>
      {file && (
        <CardFooter className="flex justify-end">
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Contacts"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ContactUpload;
