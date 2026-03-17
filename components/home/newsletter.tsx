'use client';

import { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-8 md:p-12">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-2xl mx-auto text-center text-primary-foreground">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary-foreground/20 mb-6">
              <Mail className="h-6 w-6" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Get the latest updates on new products, exclusive deals, and special offers delivered to your inbox.
            </p>

            {isSubmitted ? (
              <div className="flex items-center justify-center gap-2 text-primary-foreground">
                <div className="p-2 rounded-full bg-primary-foreground/20">
                  <Check className="h-5 w-5" />
                </div>
                <span className="font-medium">Thanks for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={isLoading}
                  className="whitespace-nowrap"
                >
                  {isLoading ? (
                    'Subscribing...'
                  ) : (
                    <>
                      Subscribe
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            <p className="text-xs text-primary-foreground/60 mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
