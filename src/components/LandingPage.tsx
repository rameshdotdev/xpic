import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Palette, 
  Maximize2, 
  Zap, 
  Layers, 
  Smartphone, 
  Shield,
  Twitter,
  Github,
  Instagram,
  Video,
  Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from './ThemeToggle';
import { XLogo } from './tweet/TweetComponents';

interface LandingPageProps {
  onStart: () => void;
  children?: React.ReactNode;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <XLogo className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-black tracking-tighter">xpic</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              onClick={onStart}
              className="rounded-full px-6 font-bold shadow-lg shadow-primary/10"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold mb-6">
              <Sparkles className="w-3 h-3" />
              <span>THE MODERN WAY TO SHARE POSTS</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.95] mb-6">
              Turn X posts into <br />
              <span className="text-primary">stunning videos & images.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 leading-relaxed">
              Stop sharing boring screenshots. Create stunning, high-quality visuals and motion videos with beautiful backgrounds and custom layouts in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={onStart}
                size="lg"
                className="w-full sm:w-auto px-8 py-6 rounded-xl text-base font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/10"
              >
                Create your first xpic
                <ArrowRight className="w-4 h-4" />
              </Button>
              <a 
                href="#features"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto px-8 py-6 rounded-xl text-base font-bold flex items-center justify-center"
                )}
              >
                See Features
              </a>
            </div>
          </motion.div>

          {/* Hero Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-24 relative"
          >
            <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full" />
            <Card className="relative p-4 rounded-[40px] border-border shadow-2xl overflow-hidden max-w-5xl mx-auto bg-card">
              <div className="aspect-video bg-gradient-to-br from-primary to-purple-600 rounded-[32px] flex items-center justify-center p-12">
                <div className="bg-background p-8 rounded-3xl shadow-2xl max-w-lg w-full text-left space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-full" />
                    <div>
                      <div className="h-4 w-32 bg-muted rounded-full mb-2" />
                      <div className="h-3 w-24 bg-muted/50 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded-full" />
                    <div className="h-4 w-full bg-muted rounded-full" />
                    <div className="h-4 w-2/3 bg-muted rounded-full" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {children}

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Built for creators.</h2>
            <p className="text-lg text-muted-foreground">Everything you need to make your content stand out.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Video className="w-8 h-8 text-red-500" />,
                title: "Video Support",
                description: "Upload short videos directly into your visuals. Perfect for sharing dynamic content and screen recordings."
              },
              {
                icon: <Camera className="w-8 h-8 text-yellow-500" />,
                title: "Frame Capture",
                description: "Found a perfect moment in a video? Capture any frame instantly and turn it into a high-quality image."
              },
              {
                icon: <Zap className="w-8 h-8 text-orange-500" />,
                title: "Instant Fetch",
                description: "Just paste the link and we'll fetch the tweet data instantly. No manual typing required."
              },
              {
                icon: <Layers className="w-8 h-8 text-green-500" />,
                title: "Quote Retweets",
                description: "Full support for quote retweets. Display the original context beautifully."
              },
              {
                icon: <Palette className="w-8 h-8 text-blue-500" />,
                title: "Custom Backgrounds",
                description: "Choose from beautiful gradients, solid colors, or upload your own image to match your brand."
              },
              {
                icon: <Shield className="w-8 h-8 text-indigo-500" />,
                title: "High Quality",
                description: "Export in high-resolution PNG, JPG, or MP4 formats. Crisp and clear on every screen."
              }
            ].map((feature, i) => (
              <Card key={i} className="p-8 rounded-[24px] border-border hover:shadow-lg transition-all group bg-card">
                <div className="mb-5 p-3.5 bg-muted rounded-xl w-fit group-hover:scale-105 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple as 1, 2, 3.</h2>
            <p className="text-lg text-muted-foreground">Go from a link to a masterpiece in seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Paste Link",
                description: "Copy the URL of any X post and paste it into our generator."
              },
              {
                step: "02",
                title: "Customize",
                description: "Choose your design, background, and aspect ratio. Make it yours."
              },
              {
                step: "03",
                title: "Export & Share",
                description: "Download your high-quality image or copy it directly to your clipboard."
              }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-black text-muted/20 mb-4">{step.step}</div>
                <div className="absolute top-8 left-0">
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-primary text-primary-foreground rounded-[40px] mx-6 mb-24">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">Always free. <br />No strings attached.</h2>
          <p className="text-lg opacity-80 mb-10 max-w-2xl mx-auto">
            We believe beautiful content should be accessible to everyone. No watermarks, no subscriptions, just pure creativity.
          </p>
          <Button 
            onClick={onStart}
            size="lg"
            variant="secondary"
            className="px-10 py-6 rounded-xl text-lg font-bold shadow-xl"
          >
            Start Creating for Free
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Is xpic really free?",
                a: "Yes! xpic is completely free to use. We don't add watermarks and you don't even need an account to get started."
              },
              {
                q: "What formats can I export in?",
                a: "You can export your creations in high-quality PNG or JPG formats. For video posts, you can export as an MP4 video file or capture a static frame as an image."
              },
              {
                q: "Does it work with private accounts?",
                a: "Due to X's API restrictions, we can only fetch data from public accounts. If a post is private, you can still manually edit the content in our generator."
              },
              {
                q: "Can I use it on my phone?",
                a: "Absolutely! xpic is fully responsive and works perfectly on mobile browsers, so you can create on the go."
              }
            ].map((item, i) => (
              <Card key={i} className="p-6 bg-muted/50 rounded-[24px] border-none">
                <h3 className="text-base font-bold mb-3 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {item.q}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-4">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <XLogo className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-black tracking-tighter">xpic</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full"><Twitter className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="rounded-full"><Github className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="rounded-full"><Instagram className="w-5 h-5" /></Button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-12 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 xpic. All rights reserved. Built with ❤️ by <a href="https://imramesh.in" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">imramesh.in</a>
        </div>
      </footer>
    </div>
  );
};
