"use client";

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Download,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { generateSimplification } from '@/lib/gemini';

export function PolicySimplifier() {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [simplifiedSections, setSimplifiedSections] = useState<any[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
      };
      reader.readAsText(file);
      toast.success(`File "${file.name}" uploaded successfully!`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const handleSimplify = async () => {
    if (!content.trim()) {
      toast.error('Please provide legal text to simplify');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setSimplifiedSections([]);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await generateSimplification(content);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Parse the result into sections
      const sections = result.split('\n\n').filter(section => section.trim()).map((section, index) => ({
        id: index,
        original: section.includes('Original:') ? section.split('Original:')[1]?.split('Simplified:')[0]?.trim() : '',
        simplified: section.includes('Simplified:') ? section.split('Simplified:')[1]?.trim() : section,
        complexity: Math.floor(Math.random() * 3) + 1, // Mock complexity score
      }));

      setSimplifiedSections(sections);
      toast.success('Legal document simplified successfully!');
    } catch (error) {
      toast.error('Failed to simplify document. Please try again.');
      console.error('Simplification error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getComplexityColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getComplexityLabel = (level: number) => {
    switch (level) {
      case 1: return 'Simple';
      case 2: return 'Moderate';
      case 3: return 'Complex';
      default: return 'Unknown';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <Zap className="mr-3 h-8 w-8 text-primary" />
            AI Policy Simplifier
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload legal documents or paste text to get AI-powered simplifications in plain English
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Document Input
              </CardTitle>
              <CardDescription>
                Upload a legal document or paste text directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
              >
                <input {...getInputProps()} />
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive
                    ? 'Drop your legal document here...'
                    : 'Drag & drop a file here, or click to select'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports: TXT, PDF files
                </p>
              </div>

              {uploadedFile && (
                <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded-lg">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{uploadedFile.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
              )}

              <Separator />

              {/* Text Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Or paste legal text directly:
                </label>
                <Textarea
                  placeholder="Paste your legal document text here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </div>

              <Button 
                onClick={handleSimplify}
                disabled={!content.trim() || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Simplifying...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Simplify Document
                  </>
                )}
              </Button>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    Processing document... {progress}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Simplified Results
              </CardTitle>
              <CardDescription>
                AI-generated simplifications and explanations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {simplifiedSections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                  <p>No simplifications yet</p>
                  <p className="text-sm">Upload a document and click "Simplify" to get started</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {simplifiedSections.map((section) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: section.id * 0.1 }}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <Badge 
                          className={`${getComplexityColor(section.complexity)} text-white`}
                        >
                          {getComplexityLabel(section.complexity)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(section.simplified)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {section.original && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground">Original:</h4>
                          <p className="text-sm bg-muted/30 p-2 rounded italic">
                            {section.original}
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Simplified:</h4>
                        <p className="text-sm">{section.simplified}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        {simplifiedSections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center space-x-4"
          >
            <Button variant="outline" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                const allText = simplifiedSections.map(s => s.simplified).join('\n\n');
                copyToClipboard(allText);
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy All
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}