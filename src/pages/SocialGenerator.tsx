import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Instagram, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const spring = { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.8 };

const SocialGenerator = () => {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [caption, setCaption] = useState("");
  const [pinterestDesc, setPinterestDesc] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [promoText, setPromoText] = useState("");

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCaption(
        "Every curve tells a story of patience. This handcrafted blue pottery vase carries 300 years of Jaipur's artistic heritage into your home. 🏺✨\n\nMade with love by artisan hands that have mastered the art passed down through generations."
      );
      setPinterestDesc(
        "Handcrafted Blue Pottery Vase from Jaipur | Authentic Indian Handicraft | Hand-painted cobalt blue motifs | Perfect for modern home decor | Eco-friendly & lead-free glaze"
      );
      setHashtags(
        "#HandmadeWithLove #IndianCrafts #BluePottery #JaipurArt #ArtisanMade #HandcraftedDecor #SustainableLiving #CraftAI #TraditionalArt #HomeDecor"
      );
      setPromoText(
        "🏺 New Arrival: Handcrafted Blue Pottery Vase — Where 300 years of tradition meets your modern home. Shop now and support local artisans!"
      );
      setIsGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="p-2 rounded-xl hover:bg-muted transition-colors"
    >
      {copiedField === field ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl pt-28 md:pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Social Media Generator</h1>
          <p className="text-muted-foreground mb-8">Generate captions, hashtags, and promotional text for your products.</p>

          <div className="space-y-6 mb-8">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Product Name</label>
              <input
                type="text"
                placeholder="e.g., Blue Pottery Vase"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-surface card-shadow text-lg font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Product Category</label>
              <input
                type="text"
                placeholder="e.g., Ceramics"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-surface card-shadow text-lg font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <Button variant="hero" size="xl" className="w-full" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Social Content"}
            </Button>
          </div>

          {generated && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
              className="space-y-4"
            >
              {[
                { icon: Instagram, label: "Instagram Caption", value: caption, field: "caption" },
                { icon: Hash, label: "Pinterest Description", value: pinterestDesc, field: "pinterest" },
                { icon: Hash, label: "Hashtags", value: hashtags, field: "hashtags" },
                { icon: Hash, label: "Promotional Text", value: promoText, field: "promo" },
              ].map((item) => (
                <div key={item.field} className="ai-zone">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-secondary" />
                      <label className="text-xs font-medium text-secondary uppercase tracking-wider">{item.label}</label>
                    </div>
                    <CopyButton text={item.value} field={item.field} />
                  </div>
                  <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">{item.value}</p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SocialGenerator;
