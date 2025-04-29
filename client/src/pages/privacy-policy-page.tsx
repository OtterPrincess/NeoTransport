import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useTitle } from '@/hooks/use-title';

// Import markdown parser for rendering the policy
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeReact from 'rehype-react';

export default function PrivacyPolicyPage() {
  useTitle('Privacy Policy | Nestara');
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

  // Process markdown content to HTML
  const createProcessor = () => {
    return unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeReact, { createElement: React.createElement });
  }
    
  const contentHtml = policyContent ? createProcessor().processSync(policyContent).result : null;

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
            <div className="prose max-w-none">
              {contentHtml}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}