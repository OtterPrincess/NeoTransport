import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function TermsOfServicePage() {
  // Set page title
  useEffect(() => {
    document.title = 'Terms of Service | Nestara';
  }, []);
  
  const [termsContent, setTermsContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the terms of service markdown file
    fetch('/src/assets/terms-of-service.md')
      .then(response => response.text())
      .then(text => {
        setTermsContent(text);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading terms of service:', error);
        setTermsContent('**Error loading terms of service. Please try again later.**');
        setLoading(false);
      });
  }, []);

  // Simple markdown renderer
  const renderMarkdown = () => {
    if (!termsContent) return { __html: '' };
    
    // Very simple markdown to HTML conversion for the terms
    const html = termsContent
      .replace(/^# (.*$)/gm, '<h1>$1</h1>') // h1
      .replace(/^## (.*$)/gm, '<h2>$1</h2>') // h2
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // italic
      .replace(/^\s*-\s*(.*$)/gm, '<li>$1</li>') // list items
      .replace(/<\/li>\n<li>/g, '</li><li>') // fix list items
      .replace(/^\n<li>/g, '<ul><li>') // start ul
      .replace(/<\/li>\n(?![<])/g, '</li></ul>\n') // end ul
      .replace(/\n\n/g, '<br /><br />'); // line breaks
    
    return { __html: html };
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ) : (
            <div className="prose prose-purple max-w-none" dangerouslySetInnerHTML={renderMarkdown()} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}