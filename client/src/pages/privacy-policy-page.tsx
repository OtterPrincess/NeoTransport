import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function PrivacyPolicyPage() {
  // Set page title
  useEffect(() => {
    document.title = 'Privacy Policy | Nestara';
  }, []);
  
  const [policyContent, setPolicyContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the privacy policy markdown file
    fetch('/src/assets/privacy-policy.md')
      .then(response => response.text())
      .then(text => {
        setPolicyContent(text);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading privacy policy:', error);
        setPolicyContent('**Error loading privacy policy. Please try again later.**');
        setLoading(false);
      });
  }, []);

  // Instead of using rehype-react which has typing issues, we'll just use a basic renderer
  // This is a simpler approach that still provides formatted content
  const renderMarkdown = () => {
    if (!policyContent) return { __html: '' };
    
    // Very simple markdown to HTML conversion for the policy
    const html = policyContent
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
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-[#9C27B0] border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="prose max-w-none" dangerouslySetInnerHTML={renderMarkdown()} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}