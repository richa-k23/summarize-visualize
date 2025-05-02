import React, { useState, useEffect } from 'react';
import FileUploader from './components/FileUploader';
import FileOutput from './components/FileOutput';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Settings, X } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import './App.css';

const App = () => {
  const [summary, setSummary] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [hfApiKey, setHfApiKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showHfKey, setShowHfKey] = useState(false);
  
  useEffect(() => {
    const savedGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const savedHfKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
    
    if (savedGeminiKey) setGeminiApiKey(savedGeminiKey);
    if (savedHfKey) setHfApiKey(savedHfKey);
  }, []);
  
  const saveApiKeys = () => {
    localStorage.setItem('geminiApiKey', geminiApiKey);
    localStorage.setItem('hfApiKey', hfApiKey);
    setShowSettings(false);
    toast({
      title: "API keys saved",
      description: "Your API keys have been saved securely in your browser.",
    });
  };
  
  const getSummary = async (text) => {
    if (!geminiApiKey) {
      toast({
        variant: "destructive",
        title: "API key missing",
        description: "Please add your Gemini API key in settings.",
      });
      setShowSettings(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + geminiApiKey,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Summarize the following text in a concise paragraph. Make it descriptive enough to generate a good image from:
                    ${text}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 150,
            },
          }),
        }
      );
      
      const data = await response.json();
      if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
        const summaryText = data.candidates[0].content.parts[0].text;
        setSummary(summaryText);
        generateImage(summaryText);
        setShowOutput(true);
        toast({
          title: "Summary generated!",
          description: "Creating images based on the summary...",
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        variant: "destructive",
        title: "Error generating summary",
        description: "Please try again with different text or check your API key.",
      });
      setIsLoading(false);
    }
  };
  
  const generateImage = async (summary) => {
    if (!hfApiKey) {
      toast({
        variant: "destructive",
        title: "API key missing",
        description: "Please add your Hugging Face API key in settings.",
      });
      setShowSettings(true);
      setIsLoading(false);
      return;
    }
    
    setIsGeneratingImage(true);
    
    try {
      const imagePromises = [1, 2, 3].map(() => 
        fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${hfApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: summary,
            parameters: {
              negative_prompt: "blurry, bad quality, distorted",
              guidance_scale: 7.5,
              num_inference_steps: 30
            }
          })
        })
      );
      
      const responses = await Promise.all(imagePromises);
      const imageBlobs = await Promise.all(responses.map(res => res.blob()));
      const imageUrls = imageBlobs.map(blob => URL.createObjectURL(blob));
      
      setImages(imageUrls);
      toast({
        title: "Images generated!",
        description: "Your visualizations are ready.",
      });
    } catch (error) {
      console.error('Error generating images:', error);
      toast({
        variant: "destructive",
        title: "Error generating images",
        description: "Please try again or check your API key.",
      });
    } finally {
      setIsGeneratingImage(false);
      setIsLoading(false);
    }
  };
  
  const handleTextSubmit = (text) => {
    getSummary(text);
  };
  
  const handleRegenerateImage = (newSummary) => {
    setSummary(newSummary);
    generateImage(newSummary);
  };
  
  return (
    <div className="min-h-screen bg-pastel-blue py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center relative">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Summarize & Visualize
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload text or paste content to generate a concise summary and visualize it with AI-generated images.
          </p>
        </header>
        
        <div className="space-y-10">
          {!showOutput && (
            <FileUploader 
              onTextSubmit={handleTextSubmit} 
              isLoading={isLoading} 
            />
          )}
          
          {showOutput && (
            <FileOutput 
              summary={summary} 
              onRegenerateImage={handleRegenerateImage} 
              images={images}
              isGeneratingImage={isGeneratingImage}
            />
          )}
          
          {showOutput && (
            <div className="text-center">
              <button 
                onClick={() => {
                  setShowOutput(false);
                  setSummary('');
                  setImages([]);
                }}
                className="text-primary underline hover:text-primary/80"
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;