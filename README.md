# Xpics - X/Twitter Post Visual Generator

Xpics is a powerful, highly customizable tool for creating beautiful, high-quality visuals of X (formerly Twitter) posts. Perfect for sharing tweets on Instagram, LinkedIn, or other visual-first platforms.

## 🚀 Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Image Generation**: `html-to-image` for high-quality exports
- **UI Components**: Radix UI (via shadcn/ui patterns)

## ✨ Features

### 🎨 Design & Customization
- **Background Styles**: Choose from a variety of beautiful preset gradients or upload your own custom background image.
- **Theme Switching**: Toggle between Light and Dark card modes to match your brand.
- **Aspect Ratios**: Presets for Square (1:1), Landscape (16:9), Portrait (9:16), and more, plus a fully custom dimension mode.
- **Smart Formatting**: Automatic detection and styling of hashtags (`#`) and mentions (`@`) in the post content.
- **Fine-grained Controls**: Adjust padding, border radius, and toggle elements like the X logo, verified badge, and response counts.

### 🛠️ Functionality
- **Real Tweet Fetching**: Simply paste an X/Twitter URL to automatically fetch the post content, user info, and images.
- **Interactive Editor**: Click and edit any text directly on the card (Name, Handle, Content, Date, Stats).
- **Media Support**: Upload custom avatars, post images, and **short videos** directly into the visual.
- **High-Quality Export**: Download your creations as PNG or JPG files with high pixel density.
- **Quick Share**: One-click "Copy to Clipboard" to quickly paste your visual into other apps.

## 📖 How to Use

1. **Import a Post**:
   - Paste a valid X/Twitter post URL into the input field at the top and click "Fetch".
   - *Alternatively*, you can manually edit all the fields if you want to create a mock post.

2. **Customize the Visual**:
   - Use the **Design** sidebar to choose your layout (With Background or Card Only).
   - Select a background gradient or click the **+** button to upload your own image.
   - Adjust the **Aspect Ratio** to fit your target platform (e.g., Square for Instagram Feed).
   - Toggle **Dark Mode**, **Verified Badge**, and other UI elements to your liking.

3. **Edit Content**:
   - Click directly on the text in the preview area to change the Name, Handle, or Tweet content.
   - Click the avatar or post image area to upload your own media.

4. **Export & Share**:
   - Click **Download** to save the image to your device.
   - Click **Copy to Clipboard** for a fast workflow.

## 🐛 Known Challenges & "The Hardest Bug"

### 🖼️ The CORS Tainted Canvas
The most difficult technical challenge in this app is the **CORS (Cross-Origin Resource Sharing)** restriction on external images. When you fetch a real tweet, the user's avatar and post images are hosted on `pbs.twimg.com`. 

Browsers consider these "cross-origin" and will "taint" the canvas if we try to convert the HTML to a PNG. This often results in blank images or export failures. 
- **The Solution**: We've implemented a robust proxy-aware fetching mechanism and recommend users manually upload images if the automatic fetch is blocked by their browser's security settings.

### ✍️ Textarea Overlay Sync
Implementing real-time hashtag and mention styling inside a `textarea` is notoriously tricky. Since standard textareas don't support rich text, we use a "Ghost Overlay" technique:
- A transparent `textarea` sits perfectly on top of a styled `div`.
- The challenge is keeping the scroll height, line spacing, and font metrics pixel-perfect between the two elements so the blue highlights align exactly with the text you're typing.

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

---
Built with ❤️ for the X community.
