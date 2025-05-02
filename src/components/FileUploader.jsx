import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileText, ArrowRight } from 'lucide-react';

const FileUploader = ({ onTextSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileUpload(e.target.files[0]);
    }
  };
  
  const handleFileUpload = async (file) => {
    try {
      const fileContent = await readFileAsText(file);
      setText(fileContent);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    }
  };
  
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onTextSubmit(text);
    }
  };
  
  return (
    <Card className="w-full p-6 bg-pastel-blue/20 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div 
          className={`file-drop-area ${isDragging ? 'active' : ''} bg-white`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.doc,.docx,.pdf,.md"
          />
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <FileText className="h-12 w-12 text-primary" />
            <h3 className="font-medium text-lg">Drag & drop a text file here</h3>
            <p className="text-sm text-muted-foreground">Or click to browse</p>
            <p className="text-xs text-muted-foreground">Supports: TXT, DOC, DOCX, PDF, MD</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="text" className="block text-sm font-medium">
            Or paste your text:
          </label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here..."
            className="min-h-[200px] p-4 bg-white"
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!text.trim() || isLoading}
            className="bg-primary text-primary-foreground"
          >
            {isLoading ? 'Processing...' : 'Summarize'}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FileUploader;