
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RefreshCw, Copy } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

const FileOutput = ({ summary, onRegenerateImage, images, isGeneratingImage }) => {
  const [editedSummary, setEditedSummary] = useState(summary);
  
  const handleRegenerateImage = () => {
    if (editedSummary.trim()) {
      onRegenerateImage(editedSummary);
    }
  };
  
  const handleCopyImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      toast({
        title: "Image copied!",
        description: "Image has been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy image:', err);
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Could not copy image. Try saving it instead.",
      });
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="p-6 bg-white shadow-md">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Summary</h3>
            <ScrollArea className="h-32 rounded-md border">
              <div className="p-4">
                <textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  className="w-full h-full bg-pastel-blue/30 text-foreground font-medium resize-none border-none focus:outline-none"
                  rows={3}
                />
              </div>
            </ScrollArea>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleRegenerateImage}
              disabled={!editedSummary.trim() || isGeneratingImage}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              {isGeneratingImage ? 'Generating...' : 'Regenerate Image'}
              <RefreshCw className={`ml-2 h-4 w-4 ${isGeneratingImage ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Generated Images</h3>
        
        {isGeneratingImage ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((_, index) => (
              <div 
                key={index} 
                className="aspect-square rounded-lg bg-pastel-gray/50 animate-pulse flex items-center justify-center"
              >
                <div className="text-muted-foreground">Loading...</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((imageUrl, index) => (
              <Card key={index} className="overflow-hidden card-hover relative group">
                <img 
                  src={imageUrl} 
                  alt={`Generated image based on summary ${index + 1}`}
                  className="w-full h-full object-cover aspect-square"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="bg-white/70 hover:bg-white"
                    onClick={() => handleCopyImage(imageUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileOutput;