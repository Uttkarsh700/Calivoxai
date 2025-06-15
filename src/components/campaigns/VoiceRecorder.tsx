
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, StopCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, url: string, duration: number) => void;
  onDelete?: () => void;
  maxDuration?: number; // in seconds
}

const VoiceRecorder = ({ onRecordingComplete, onDelete, maxDuration = 300 }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setIsRecording(false);
        
        onRecordingComplete(audioBlob, audioUrl, recordingDuration);
        
        // Stop all tracks from the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingDuration(0);
      
      // Start timer for recording duration
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds += 1;
        setRecordingDuration(seconds);
        
        if (seconds >= maxDuration) {
          stopRecording();
          toast.info(`Recording stopped at maximum duration of ${formatDuration(maxDuration)}`);
        }
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Clear the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration(0);
    
    if (onDelete) {
      onDelete();
    }
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaRecorderRef.current && isRecording) {
        const tracks = mediaRecorderRef.current.stream?.getTracks();
        tracks?.forEach(track => track.stop());
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [isRecording, audioUrl]);
  
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        {!audioUrl ? (
          <div className="w-full text-center">
            <div className="mb-4 text-muted-foreground">
              Record your voice message
            </div>
            
            {isRecording ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="text-red-500 animate-pulse flex items-center">
                  <Mic className="h-6 w-6 mr-2" />
                  Recording... {formatDuration(recordingDuration)}
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={stopRecording}
                >
                  <StopCircle className="h-4 w-4 mr-2 text-red-500" />
                  Stop Recording
                </Button>
              </div>
            ) : (
              <Button 
                type="button" 
                onClick={startRecording}
              >
                <Mic className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            )}
          </div>
        ) : (
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="font-medium">Voice Recording</div>
              <div className="text-sm text-muted-foreground">
                {formatDuration(recordingDuration)}
              </div>
            </div>
            
            <audio 
              src={audioUrl} 
              controls 
              className="w-full mb-4"
            ></audio>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={deleteRecording}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button 
                type="button" 
                size="sm" 
                onClick={startRecording}
              >
                <Mic className="h-4 w-4 mr-2" />
                Re-record
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VoiceRecorder;
