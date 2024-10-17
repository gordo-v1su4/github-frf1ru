import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { generateLumaVideo } from '../utils/lumaApi';

interface VideoGenerationPopupProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
  onGenerate: (videoUrl: string) => void;
}

const VideoGenerationPopup: React.FC<VideoGenerationPopupProps> = ({ isOpen, imageUrl, onClose, onGenerate }) => {
  const [engine, setEngine] = useState<'Luma' | 'Kling'>('Luma');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<string>('');

  const handleGenerate = async () => {
    if (imageUrl) {
      setIsGenerating(true);
      setError(null);
      setGenerationStatus('Starting generation...');
      try {
        if (engine === 'Luma') {
          const videoUrl = await generateLumaVideo(imageUrl, prompt);
          onGenerate(videoUrl);
          setGenerationStatus('Video generated successfully!');
        } else {
          console.log('Kling API not implemented yet');
          setError('Kling API is not implemented yet');
        }
      } catch (error) {
        console.error('Error generating video:', error);
        setError(`Failed to generate video: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setGenerationStatus('');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Video</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ToggleGroup type="single" value={engine} onValueChange={(value: string) => setEngine(value as 'Luma' | 'Kling')}>
            <ToggleGroupItem value="Luma">Luma</ToggleGroupItem>
            <ToggleGroupItem value="Kling">Kling</ToggleGroupItem>
          </ToggleGroup>
          <Input
            placeholder="Enter prompt for video generation"
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {generationStatus && <p className="text-blue-500 text-sm">{generationStatus}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleGenerate} disabled={isGenerating || !imageUrl || !prompt}>
            {isGenerating ? 'Generating...' : 'Generate Video'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoGenerationPopup;