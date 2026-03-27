import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Copy,
  Share2,
  Coffee,
  Moon,
  Sun,
  Maximize2,
  CheckCircle2,
  MessageCircle,
  Repeat2,
  Heart,
  BarChart3,
  Link as LinkIcon,
  X,
  Palette,
  Layout,
  Type,
  Check,
  ChevronDown,
  Image,
  Eye,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Github,
  Twitter,
  Instagram,
  Layers,
  Smartphone,
  Monitor,
  Settings2,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  MoreHorizontal,
  LogOut,
  Home,
  Verified,
} from "lucide-react";
import { toPng, toJpeg } from "html-to-image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";
import { useTheme } from "./components/theme-provider";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// --- Theme Toggle ---
function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

// --- Types ---

interface PostData {
  name: string;
  handle: string;
  avatar: string;
  content: string;
  date: string;
  time: string;
  views: string;
  replies: string;
  reposts: string;
  likes: string;
  isVerified: boolean;
  postImage?: string;
  quotedPost?: {
    name: string;
    handle: string;
    avatar: string;
    content: string;
    date: string;
    isVerified: boolean;
  };
}

type AspectRatio =
  | "1:1"
  | "16:9"
  | "4:3"
  | "9:16"
  | "custom"
  | "instagramFeed"
  | "instagramStories"
  | "linkedinPost"
  | "twitterProfileCover";
type ExportFormat = "png" | "jpg";

interface Config {
  background: string;
  customBackground?: string;
  isDarkMode: boolean;
  aspectRatio: AspectRatio;
  showIcon: boolean;
  showUsername: boolean;
  showVerified: boolean;
  showDateTime: boolean;
  showResponses: boolean;
  padding: number;
  rounded: number;
  exportFormat: ExportFormat;
  showQuotedPost: boolean;
  customWidth: number;
  customHeight: number;
  showBackground: boolean;
}

// --- Constants ---

const PRESET_BACKGROUNDS = [
  "linear-gradient(45deg, #8E2DE2, #4A00E0)",
  "linear-gradient(45deg, #f953c6, #b91d73)",
  "linear-gradient(45deg, #00c6ff, #0072ff)",
  "linear-gradient(45deg, #11998e, #38ef7d)",
  "linear-gradient(45deg, #ff9966, #ff5e62)",
  "linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)",
  "linear-gradient(45deg, #000000, #434343)",
  "#ffffff",
  "#000000",
];

const renderContent = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\s+)/);
  return parts.map((part, index) => {
    if ((part.startsWith("#") || part.startsWith("@")) && part.length > 1) {
      return (
        <span key={index} className="text-[#1D9BF0]">
          {part}
        </span>
      );
    }
    return part;
  });
};

const ASPECT_RATIOS: { label: string; value: AspectRatio; ratio: number }[] = [
  { label: "Square (1:1)", value: "1:1", ratio: 1 },
  { label: "Landscape (16:9)", value: "16:9", ratio: 16 / 9 },
  { label: "Portrait (9:16)", value: "9:16", ratio: 9 / 16 },
  { label: "Classic (4:3)", value: "4:3", ratio: 4 / 3 },
  { label: "Instagram Feed", value: "instagramFeed", ratio: 1 },
  { label: "Instagram Stories", value: "instagramStories", ratio: 9 / 16 },
  { label: "LinkedIn Post", value: "linkedinPost", ratio: 1.91 / 1 },
  {
    label: "Twitter Profile Cover",
    value: "twitterProfileCover",
    ratio: 3 / 1,
  },
  { label: "Custom", value: "custom", ratio: 1 },
];

const DEFAULT_POST: PostData = {
  name: "Virat Kohli",
  handle: "imvkohli",
  avatar:
    "https://res.cloudinary.com/dvzsnzhka/image/upload/v1769007827/gkjxru66p2genxtvk1uq.jpg",
  content:
    "Here's an idea 🧐 do something good and don't post about it on social media.\n\nBut if you really can't resist ... post it everywhere using Xpic!",
  date: "27 Mar, 2026",
  time: "09:21 AM",
  views: "1.1M",
  replies: "1.2K",
  reposts: "5.5K",
  likes: "3.9K",
  isVerified: true,
  postImage: undefined,
  quotedPost: {
    name: "X",
    handle: "X",
    avatar: "https://picsum.photos/seed/x/200/200",
    content: "Welcome to the new era of social media. 𝕏",
    date: "24 Jul, 2023",
    isVerified: true,
  },
};

// --- Components ---

const XLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

function LandingPage({
  onStart,
  children,
}: {
  onStart: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <XLogo className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-black tracking-tighter">xpic</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
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
              <span className="text-primary">visual masterpieces.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 leading-relaxed">
              Stop sharing boring screenshots. Create stunning, high-quality
              visuals with beautiful backgrounds and custom layouts in seconds.
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
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 rounded-xl text-base font-bold"
              >
                <a href="#features">See Features</a>
              </Button>
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Built for creators.
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to make your content stand out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Palette className="w-8 h-8 text-blue-500" />,
                title: "Custom Backgrounds",
                description:
                  "Choose from beautiful gradients, solid colors, or upload your own image to match your brand.",
              },
              {
                icon: <Maximize2 className="w-8 h-8 text-purple-500" />,
                title: "Social Presets",
                description:
                  "Perfectly sized for Instagram, Twitter, LinkedIn, and more. No more manual cropping.",
              },
              {
                icon: <Zap className="w-8 h-8 text-orange-500" />,
                title: "Instant Fetch",
                description:
                  "Just paste the link and we'll fetch the tweet data instantly. No manual typing required.",
              },
              {
                icon: <Layers className="w-8 h-8 text-green-500" />,
                title: "Quote Retweets",
                description:
                  "Full support for quote retweets. Display the original context beautifully.",
              },
              {
                icon: <Smartphone className="w-8 h-8 text-pink-500" />,
                title: "Mobile Ready",
                description:
                  "Create stunning visuals right from your phone. Responsive design at its best.",
              },
              {
                icon: <Shield className="w-8 h-8 text-indigo-500" />,
                title: "High Quality",
                description:
                  "Export in high-resolution PNG or JPG formats. Crisp and clear on every screen.",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="p-8 rounded-[24px] border-border hover:shadow-lg transition-all group bg-card"
              >
                <div className="mb-5 p-3.5 bg-muted rounded-xl w-fit group-hover:scale-105 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Simple as 1, 2, 3.
            </h2>
            <p className="text-lg text-muted-foreground">
              Go from a link to a masterpiece in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Paste Link",
                description:
                  "Copy the URL of any X post and paste it into our generator.",
              },
              {
                step: "02",
                title: "Customize",
                description:
                  "Choose your design, background, and aspect ratio. Make it yours.",
              },
              {
                step: "03",
                title: "Export & Share",
                description:
                  "Download your high-quality image or copy it directly to your clipboard.",
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-black text-muted/20 mb-4">
                  {step.step}
                </div>
                <div className="absolute top-8 left-0">
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-24 px-6 bg-primary text-primary-foreground rounded-[40px] mx-6 mb-24"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
            Always free. <br />
            No strings attached.
          </h2>
          <p className="text-lg opacity-80 mb-10 max-w-2xl mx-auto">
            We believe beautiful content should be accessible to everyone. No
            watermarks, no subscriptions, just pure creativity.
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
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Is xpic really free?",
                a: "Yes! xpic is completely free to use. We don't add watermarks and you don't even need an account to get started.",
              },
              {
                q: "What formats can I export in?",
                a: "You can export your creations in high-quality PNG or JPG formats. PNG is recommended for the best quality and transparency support.",
              },
              {
                q: "Does it work with private accounts?",
                a: "Due to X's API restrictions, we can only fetch data from public accounts. If a post is private, you can still manually edit the content in our generator.",
              },
              {
                q: "Can I use it on my phone?",
                a: "Absolutely! xpic is fully responsive and works perfectly on mobile browsers, so you can create on the go.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="p-6 bg-muted/50 rounded-[24px] border-none"
              >
                <h3 className="text-base font-bold mb-3 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {item.q}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-4">
                  {item.a}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          © 2026 xpic. All rights reserved. Built with ❤️ by{" "}
          <a
            href="https://imramesh.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            imramesh.in
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const { theme } = useTheme();
  const [view, setView] = useState<"landing" | "generator">("landing");
  const [postUrl, setPostUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState<PostData>(DEFAULT_POST);
  const [config, setConfig] = useState<Config>({
    background: PRESET_BACKGROUNDS[0],
    customBackground: undefined,
    isDarkMode: true,
    aspectRatio: "1:1",
    showIcon: true,
    showUsername: true,
    showVerified: true,
    showDateTime: true,
    showResponses: true,
    padding: 64,
    rounded: 24,
    exportFormat: "png",
    showQuotedPost: false,
    customWidth: 600,
    customHeight: 600,
    showBackground: true,
  });

  const previewRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const quotedAvatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // Update config isDarkMode based on theme
  useEffect(() => {
    if (theme === "dark") {
      setConfig((prev) => ({ ...prev, isDarkMode: true }));
    } else if (theme === "light") {
      setConfig((prev) => ({ ...prev, isDarkMode: false }));
    } else {
      const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setConfig((prev) => ({ ...prev, isDarkMode: isSystemDark }));
    }
  }, [theme]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData({ ...postData, postImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPostData({ ...postData, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const onAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleAvatarUpload(file);
  };

  const onAvatarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleAvatarUpload(file);
    }
  };

  const handleQuotedAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && postData.quotedPost) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData({
          ...postData,
          quotedPost: {
            ...postData.quotedPost!,
            avatar: reader.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig({ ...config, customBackground: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      let dataUrl: string;
      const options = { cacheBust: true, pixelRatio: 2 };
      const targetRef = config.showBackground ? previewRef : cardRef;

      if (!targetRef.current) return;

      switch (config.exportFormat) {
        case "jpg":
          dataUrl = await toJpeg(targetRef.current, options);
          break;
        default:
          dataUrl = await toPng(targetRef.current, options);
      }

      const link = document.createElement("a");
      link.download = `x-post-${Date.now()}.${config.exportFormat}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
    }
  };

  const handleCopy = async () => {
    const targetRef = config.showBackground ? previewRef : cardRef;
    if (!targetRef.current) return;
    try {
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy image", err);
      toast.error("Failed to copy image");
    }
  };

  const fetchTweet = async () => {
    if (!postUrl) return;

    const tweetId = postUrl.match(/\/status\/(\d+)/)?.[1];
    if (!tweetId) {
      toast.error("Please enter a valid X/Twitter post URL");
      return;
    }

    setIsLoading(true);
    try {
      const url = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en`;

      const res = await fetch(url).catch((error) => {
        const msg = error instanceof Error ? error.message : String(error);
        throw new Error(
          `Failed to connect to the tweet API: ${msg}. This might be due to a network issue or CORS restrictions in your browser.`,
        );
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(
            "Tweet not found. It might be private, deleted, or the ID is incorrect.",
          );
        }
        if (res.status === 403) {
          throw new Error(
            "This tweet is private or restricted. The syndication API cannot access it.",
          );
        }
        throw new Error(
          `Failed to fetch tweet (Status: ${res.status}). The API might be temporarily unavailable.`,
        );
      }

      const data = await res.json().catch(() => {
        throw new Error(
          "Failed to parse tweet data. The API response might be malformed.",
        );
      });

      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Received invalid data from the tweet API.");
      }

      const user = data.user;
      if (!user || typeof user !== "object" || Array.isArray(user)) {
        console.error("API Response missing user object:", data);
        throw new Error(
          "Tweet data is incomplete (missing user information). This usually happens with private or restricted posts.",
        );
      }

      const dateObj = new Date(data.created_at || Date.now());
      const formattedDate = isNaN(dateObj.getTime())
        ? "Unknown Date"
        : dateObj.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

      const formattedTime = isNaN(dateObj.getTime())
        ? "Unknown Time"
        : dateObj.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

      const newPostData: PostData = {
        name: user.name || user.screen_name || "Unknown User",
        handle: user.screen_name || "unknown",
        avatar: user.profile_image_url_https
          ? user.profile_image_url_https.replace("_normal", "")
          : "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
        content: data.text || data.full_text || "",
        date: formattedDate,
        time: formattedTime,
        views: "1.2M",
        replies: (data.reply_count || 0).toLocaleString(),
        reposts: (data.retweet_count || 0).toLocaleString(),
        likes: (data.favorite_count || 0).toLocaleString(),
        isVerified: !!user.verified,
        postImage: data.mediaDetails?.[0]?.media_url_https,
      };

      if (
        data.quoted_tweet &&
        typeof data.quoted_tweet === "object" &&
        !Array.isArray(data.quoted_tweet) &&
        data.quoted_tweet.user &&
        typeof data.quoted_tweet.user === "object" &&
        !Array.isArray(data.quoted_tweet.user)
      ) {
        const qUser = data.quoted_tweet.user;
        const qDateObj = new Date(data.quoted_tweet.created_at || Date.now());
        newPostData.quotedPost = {
          name: qUser.name || qUser.screen_name || "Unknown User",
          handle: qUser.screen_name || "unknown",
          avatar: qUser.profile_image_url_https
            ? qUser.profile_image_url_https.replace("_normal", "")
            : "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
          content: data.quoted_tweet.text || data.quoted_tweet.full_text || "",
          date: isNaN(qDateObj.getTime())
            ? "Unknown Date"
            : qDateObj.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
          isVerified: !!qUser.verified,
        };
        setConfig((prev) => ({ ...prev, showQuotedPost: true }));
      } else {
        setConfig((prev) => ({ ...prev, showQuotedPost: false }));
      }

      setPostData(newPostData);
      toast.success("Post fetched successfully!");
    } catch (err) {
      console.error("Error fetching tweet:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching the tweet.";
      toast.error(errorMessage, {
        description:
          "Possible reasons: Private/deleted post, age-restricted content, AdBlockers, or CORS restrictions.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LandingPage
      onStart={() =>
        document
          .getElementById("editor")
          ?.scrollIntoView({ behavior: "smooth" })
      }
    >
      <section
        id="editor"
        className="bg-muted/30 border-y border-border scroll-mt-16"
      >
        <div className="max-w-[1400px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-start">
          {/* Sidebar Controls */}
          <aside className="space-y-8">
            <header>
              <h1 className="text-2xl font-bold tracking-tight">
                Generate X Screenshots
              </h1>
            </header>

            {/* URL Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder="Paste the link of the post"
                  className="pl-11 py-6 bg-card border-border rounded-xl shadow-sm"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchTweet()}
                />
              </div>
              <Button
                onClick={fetchTweet}
                disabled={isLoading}
                variant="outline"
                className="h-auto py-4 px-6 rounded-xl"
              >
                {isLoading ? "Fetching..." : "Fetch"}
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Media
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-6 bg-card border-border rounded-xl hover:bg-muted transition-colors shadow-sm font-medium text-sm"
                >
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  Upload Image
                </Button>
                {postData.postImage && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPostData({ ...postData, postImage: undefined })
                    }
                    className="px-4 py-6 bg-card border-border rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors shadow-sm font-medium text-sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Customize
                </h2>
                <button
                  onClick={() => {
                    setConfig({
                      background: PRESET_BACKGROUNDS[0],
                      isDarkMode: true,
                      aspectRatio: "1:1",
                      showIcon: true,
                      showUsername: true,
                      showVerified: true,
                      showDateTime: true,
                      showResponses: true,
                      padding: 64,
                      rounded: 24,
                      exportFormat: "png",
                      showQuotedPost: false,
                      customWidth: 600,
                      customHeight: 600,
                      showBackground: true,
                    });
                    setPostData(DEFAULT_POST);
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Design Selection */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Select the design
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Design 1: Only Tweet */}
                  <button
                    onClick={() =>
                      setConfig({ ...config, showBackground: false })
                    }
                    className={cn(
                      "relative aspect-square bg-card border-2 rounded-2xl transition-all overflow-hidden group",
                      !config.showBackground
                        ? "border-primary ring-4 ring-primary/10"
                        : "border-border hover:border-muted-foreground/30",
                    )}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="w-full space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-muted" />
                          <div className="h-2 w-16 bg-muted rounded-full" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2 w-full bg-muted rounded-full" />
                          <div className="h-2 w-full bg-muted rounded-full" />
                          <div className="h-2 w-2/3 bg-muted rounded-full" />
                        </div>
                      </div>
                    </div>
                    {!config.showBackground && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>

                  {/* Design 2: With Background */}
                  <button
                    onClick={() =>
                      setConfig({ ...config, showBackground: true })
                    }
                    className={cn(
                      "relative aspect-square bg-muted border-2 rounded-2xl transition-all overflow-hidden group",
                      config.showBackground
                        ? "border-primary ring-4 ring-primary/10"
                        : "border-border hover:border-muted-foreground/30",
                    )}
                  >
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center p-6">
                      <div className="w-full bg-card rounded-lg p-3 shadow-sm space-y-2 scale-90">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-muted" />
                          <div className="h-1.5 w-12 bg-muted rounded-full" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 w-full bg-muted rounded-full" />
                          <div className="h-1.5 w-full bg-muted rounded-full" />
                          <div className="h-1.5 w-1/2 bg-muted rounded-full" />
                        </div>
                      </div>
                    </div>
                    {config.showBackground && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                </div>

                {config.showBackground && (
                  <div className="space-y-3 p-4 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Palette className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Background Style
                        </span>
                      </div>
                      <div
                        className="w-8 h-8 rounded-full border-2 border-background shadow-sm cursor-pointer"
                        style={{ background: config.background }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_BACKGROUNDS.map((bg) => (
                        <button
                          key={bg}
                          onClick={() =>
                            setConfig({
                              ...config,
                              background: bg,
                              customBackground: undefined,
                            })
                          }
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                            config.background === bg && !config.customBackground
                              ? "border-primary scale-110 shadow-md"
                              : "border-transparent",
                          )}
                          style={{ background: bg }}
                        />
                      ))}
                      <button
                        onClick={() => backgroundInputRef.current?.click()}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center transition-all hover:scale-110 hover:border-primary overflow-hidden",
                          config.customBackground
                            ? "border-primary scale-110 shadow-md"
                            : "",
                        )}
                      >
                        {config.customBackground ? (
                          <img
                            src={config.customBackground}
                            alt="Custom"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <input
                        type="file"
                        ref={backgroundInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleBackgroundUpload}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                <Toggle
                  icon={<Moon className="w-4 h-4" />}
                  label="Dark Card"
                  active={config.isDarkMode}
                  onChange={(val) => setConfig({ ...config, isDarkMode: val })}
                />

                {config.showBackground && (
                  <>
                    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
                      <div className="flex items-center gap-3">
                        <Maximize2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Aspect Ratio
                        </span>
                      </div>
                      <Select
                        value={config.aspectRatio}
                        onValueChange={(val) =>
                          setConfig({
                            ...config,
                            aspectRatio: val as AspectRatio,
                          })
                        }
                      >
                        <SelectTrigger className="w-35 border-none bg-transparent focus:ring-0 h-auto p-1 text-right font-medium text-muted-foreground">
                          <SelectValue placeholder="Select ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          {ASPECT_RATIOS.map((ratio) => (
                            <SelectItem key={ratio.value} value={ratio.value}>
                              {ratio.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {config.aspectRatio === "custom" && (
                      <div className="p-4 bg-card border border-border rounded-xl grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Width
                          </label>
                          <Input
                            type="number"
                            className="h-9 bg-muted/50 border-border rounded-lg"
                            value={config.customWidth}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                customWidth: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Height
                          </label>
                          <Input
                            type="number"
                            className="h-9 bg-muted/50 border-border rounded-lg"
                            value={config.customHeight}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                customHeight: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-card border border-border rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Layout className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Padding</span>
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">
                          {config.padding}px
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={120}
                        step={1}
                        value={[config.padding]}
                        onValueChange={(val) =>
                          setConfig({ ...config, padding: val[0] })
                        }
                      />
                    </div>
                  </>
                )}

                <div className="p-4 bg-card border border-border rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Verified className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Rounded</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                      {config.rounded}px
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={48}
                    step={1}
                    value={[config.rounded]}
                    onValueChange={(val) =>
                      setConfig({ ...config, rounded: val[0] })
                    }
                  />
                </div>

                <Toggle
                  icon={<XLogo className="w-4 h-4" />}
                  label="Icon"
                  active={config.showIcon}
                  onChange={(val) => setConfig({ ...config, showIcon: val })}
                />
                <Toggle
                  icon={<Type className="w-4 h-4" />}
                  label="Username"
                  active={config.showUsername}
                  onChange={(val) =>
                    setConfig({ ...config, showUsername: val })
                  }
                />
                <Toggle
                  icon={<Verified className="w-4 h-4" />}
                  label="Verified"
                  active={config.showVerified}
                  onChange={(val) =>
                    setConfig({ ...config, showVerified: val })
                  }
                />
                <Toggle
                  icon={<Sun className="w-4 h-4" />}
                  label="Date & Time"
                  active={config.showDateTime}
                  onChange={(val) =>
                    setConfig({ ...config, showDateTime: val })
                  }
                />
                <Toggle
                  icon={<Heart className="w-4 h-4" />}
                  label="Responses"
                  active={config.showResponses}
                  onChange={(val) =>
                    setConfig({ ...config, showResponses: val })
                  }
                />
                <Toggle
                  icon={<Repeat2 className="w-4 h-4" />}
                  label="Quote Post"
                  active={config.showQuotedPost}
                  onChange={(val) =>
                    setConfig({ ...config, showQuotedPost: val })
                  }
                />
              </div>
            </div>

            {config.showQuotedPost && postData.quotedPost && (
              <div className="space-y-4 p-4 bg-white border border-[#EFF3F4] rounded-xl">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#536471]">
                  Quoted Post
                </h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-3 py-2 text-sm border border-[#EFF3F4] rounded-lg focus:ring-2 focus:ring-blue-500/20"
                    value={postData.quotedPost.name}
                    onChange={(e) =>
                      setPostData({
                        ...postData,
                        quotedPost: {
                          ...postData.quotedPost!,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Handle"
                    className="w-full px-3 py-2 text-sm border border-[#EFF3F4] rounded-lg focus:ring-2 focus:ring-blue-500/20"
                    value={postData.quotedPost.handle}
                    onChange={(e) =>
                      setPostData({
                        ...postData,
                        quotedPost: {
                          ...postData.quotedPost!,
                          handle: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Date"
                    className="w-full px-3 py-2 text-sm border border-[#EFF3F4] rounded-lg focus:ring-2 focus:ring-blue-500/20"
                    value={postData.quotedPost.date}
                    onChange={(e) =>
                      setPostData({
                        ...postData,
                        quotedPost: {
                          ...postData.quotedPost!,
                          date: e.target.value,
                        },
                      })
                    }
                  />
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-medium text-[#536471]">
                      Avatar
                    </span>
                    <button
                      onClick={() => quotedAvatarInputRef.current?.click()}
                      className="text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600"
                    >
                      Change
                    </button>
                    <input
                      type="file"
                      ref={quotedAvatarInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleQuotedAvatarUpload}
                    />
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Verified
                    </span>
                    <Switch
                      checked={postData.quotedPost.isVerified}
                      onCheckedChange={(val) =>
                        setPostData({
                          ...postData,
                          quotedPost: {
                            ...postData.quotedPost!,
                            isVerified: val,
                          },
                        })
                      }
                    />
                  </div>
                  <Textarea
                    placeholder="Content"
                    className="w-full px-3 py-2 text-sm bg-card border-border rounded-xl focus:ring-2 focus:ring-primary/20 resize-none"
                    rows={3}
                    value={postData.quotedPost.content}
                    onChange={(e) =>
                      setPostData({
                        ...postData,
                        quotedPost: {
                          ...postData.quotedPost!,
                          content: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Export Format</span>
                </div>
                <Select
                  value={config.exportFormat}
                  onValueChange={(val) =>
                    setConfig({ ...config, exportFormat: val as ExportFormat })
                  }
                >
                  <SelectTrigger className="w-20 border-none bg-transparent focus:ring-0 h-auto p-1 text-right font-medium text-muted-foreground">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPEG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open("https://www.buymeacoffee.com", "_blank")
                  }
                  className="flex items-center justify-center p-6 bg-card border-border rounded-xl hover:bg-muted transition-colors shadow-sm"
                >
                  <Coffee className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="flex items-center justify-center p-6 bg-card border-border rounded-xl hover:bg-muted transition-colors shadow-sm"
                >
                  <Copy className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="col-span-1 flex items-center justify-center gap-2 p-6 bg-card border-border rounded-xl hover:bg-muted transition-colors shadow-sm font-medium text-sm"
                >
                  <Download className="w-5 h-5 text-muted-foreground" />
                  <span className="hidden xl:inline">Download</span>
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      "https://twitter.com/intent/tweet?text=Check out this X Post Screenshot Generator!",
                      "_blank",
                    )
                  }
                  className="col-span-1 flex items-center justify-center gap-2 p-6 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm font-medium text-sm"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="hidden xl:inline">Post</span>
                </Button>
              </div>
            </div>
          </aside>

          {/* Preview Area */}
          <main className="flex items-center justify-center min-h-[600px] bg-card rounded-3xl border border-border shadow-sm overflow-hidden p-12">
            <div
              ref={previewRef}
              className={cn(
                "relative flex items-center justify-center overflow-hidden transition-all duration-500",
                config.showBackground && "shadow-2xl",
              )}
              style={{
                background: config.showBackground
                  ? config.customBackground
                    ? `url(${config.customBackground}) center/cover no-repeat`
                    : config.background
                  : "transparent",
                padding: config.showBackground ? `${config.padding}px` : "0",
                width: config.showBackground
                  ? config.aspectRatio === "custom"
                    ? `${config.customWidth}px`
                    : "100%"
                  : "auto",
                height: config.showBackground
                  ? config.aspectRatio === "custom"
                    ? `${config.customHeight}px`
                    : "auto"
                  : "auto",
                aspectRatio:
                  config.showBackground && config.aspectRatio !== "custom"
                    ? ASPECT_RATIOS.find((r) => r.value === config.aspectRatio)
                        ?.ratio
                    : undefined,
                maxHeight:
                  config.showBackground && config.aspectRatio === "custom"
                    ? "none"
                    : "min(80vh, 1200px)",
                margin: "0 auto",
                borderRadius:
                  config.showBackground && config.aspectRatio === "custom"
                    ? "0px"
                    : "24px",
              }}
            >
              <motion.div
                ref={cardRef}
                layout
                className={cn(
                  "w-full max-w-[500px] p-6 shadow-2xl transition-colors duration-300 overflow-hidden",
                  config.isDarkMode
                    ? "bg-[#000000] text-white"
                    : "bg-white text-[#0F1419]",
                )}
                style={{ borderRadius: `${config.rounded}px` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => avatarInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={onAvatarDrop}
                    >
                      <img
                        src={postData.avatar}
                        alt={postData.name}
                        className="w-12 h-12 rounded-full object-cover border border-border/10"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Palette className="w-4 h-4 text-white" />
                      </div>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={onAvatarFileChange}
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <input
                          className="font-bold text-[15px] leading-tight bg-transparent border-none p-0 focus:ring-0 w-fit"
                          value={postData.name}
                          onChange={(e) =>
                            setPostData({ ...postData, name: e.target.value })
                          }
                          style={{ width: `${postData.name.length - 3}ch` }}
                        />
                        {config.showVerified && (
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 24 24"
                            className="text-blue-500 -ml-1"
                            height="20"
                            width="20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="m23 12-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"></path>
                          </svg>
                        )}
                      </div>
                      {config.showUsername && (
                        <div className="flex items-center text-[15px] text-[#536471] leading-tight">
                          <span>@</span>
                          <input
                            className="bg-transparent border-none p-0 focus:ring-0 w-fit min-w-[20px] text-[#536471]"
                            value={postData.handle}
                            onChange={(e) =>
                              setPostData({
                                ...postData,
                                handle: e.target.value,
                              })
                            }
                            style={{ width: `${postData.handle.length + 1}ch` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {config.showIcon && (
                    <XLogo
                      className={cn(
                        "w-6 h-6",
                        config.isDarkMode ? "text-white" : "text-black",
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 text-[17px] leading-relaxed whitespace-pre-wrap font-normal pointer-events-none">
                    {renderContent(postData.content)}
                  </div>
                  <textarea
                    className={cn(
                      "w-full text-[17px] leading-relaxed whitespace-pre-wrap font-normal bg-transparent border-none p-0 focus:ring-0 resize-none overflow-hidden text-transparent",
                      config.isDarkMode ? "caret-white" : "caret-[#0F1419]",
                    )}
                    value={postData.content}
                    onChange={(e) => {
                      setPostData({ ...postData, content: e.target.value });
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    rows={1}
                    ref={(el) => {
                      if (el) {
                        el.style.height = "auto";
                        el.style.height = el.scrollHeight + "px";
                      }
                    }}
                  />
                </div>

                {/* Post Image */}
                {postData.postImage && (
                  <div className="mb-4 relative rounded-2xl overflow-hidden border border-border/20">
                    <img
                      src={postData.postImage}
                      alt="Post content"
                      className="w-full h-auto object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Quoted Post */}
                {config.showQuotedPost && postData.quotedPost && (
                  <div
                    className={cn(
                      "mb-4 p-3 rounded-2xl border border-border/20 transition-colors",
                      config.isDarkMode ? "bg-white/5" : "bg-black/5",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={postData.quotedPost.avatar}
                        alt={postData.quotedPost.name}
                        className="w-5 h-5 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-bold text-[14px]">
                        {postData.quotedPost.name}
                      </span>
                      {postData.quotedPost.isVerified && (
                        <Verified className="w-3.5 h-3.5 text-[#1d9bf0]" />
                      )}
                      <span className="text-[14px] text-[#536471]">
                        @{postData.quotedPost.handle}
                      </span>
                      <span className="text-[14px] text-[#536471]">·</span>
                      <span className="text-[14px] text-[#536471]">
                        {postData.quotedPost.date}
                      </span>
                    </div>
                    <div className="text-[14px] leading-normal">
                      {renderContent(postData.quotedPost.content)}
                    </div>
                  </div>
                )}

                {/* Date & Time */}
                {config.showDateTime && (
                  <div className="flex items-center gap-1 text-[15px] text-[#536471] mb-4 pb-4 border-b border-[#EFF3F4]/10">
                    <input
                      className="bg-transparent border-none p-0 focus:ring-0 w-fit text-[#536471]"
                      value={postData.time}
                      onChange={(e) =>
                        setPostData({ ...postData, time: e.target.value })
                      }
                      style={{ width: `7ch` }}
                    />
                    <span>·</span>
                    <input
                      className="bg-transparent border-none p-0 focus:ring-0 w-fit text-[#536471]"
                      value={postData.date}
                      onChange={(e) =>
                        setPostData({ ...postData, date: e.target.value })
                      }
                      style={{ width: `${postData.date.length + 1}ch` }}
                    />
                  </div>
                )}

                {/* Stats */}
                {config.showResponses && (
                  <div className="flex items-center justify-between text-[14px] text-[#536471] font-medium">
                    <StatItem
                      label="Views"
                      value={postData.views}
                      isDark={config.isDarkMode}
                      onChange={(val) =>
                        setPostData({ ...postData, views: val })
                      }
                    />
                    <StatItem
                      label="Replies"
                      value={postData.replies}
                      isDark={config.isDarkMode}
                      onChange={(val) =>
                        setPostData({ ...postData, replies: val })
                      }
                    />
                    <StatItem
                      label="Reposts"
                      value={postData.reposts}
                      isDark={config.isDarkMode}
                      onChange={(val) =>
                        setPostData({ ...postData, reposts: val })
                      }
                    />
                    <StatItem
                      label="Likes"
                      value={postData.likes}
                      isDark={config.isDarkMode}
                      onChange={(val) =>
                        setPostData({ ...postData, likes: val })
                      }
                    />
                  </div>
                )}
              </motion.div>
            </div>
          </main>
        </div>
      </section>
    </LandingPage>
  );
}

// --- Sub-components ---

function Toggle({
  icon,
  label,
  active,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl transition-all hover:border-primary/30">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <Switch checked={active} onCheckedChange={onChange} />
    </div>
  );
}

function StatItem({
  label,
  value,
  isDark,
  onChange,
}: {
  label: string;
  value: string;
  isDark: boolean;
  onChange: (val: string) => void;
}) {
  const displayValue = value || "";
  return (
    <div className="flex items-center gap-1">
      <input
        className={cn(
          "bg-transparent border-none p-0 focus:ring-0 w-fit min-w-[10px] text-center",
          isDark ? "text-white" : "text-foreground",
        )}
        value={displayValue}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: `${displayValue.length + 0.5}ch` }}
      />
      <span>{label}</span>
    </div>
  );
}
