import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Mic, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const spring = { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.8 };

const categories = ["Pottery", "Textiles", "Jewelry", "Basketry", "Woodwork", "Metalwork", "Painting", "Other"];

const CreateProduct = () => {
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [materials, setMaterials] = useState("");
  const [description, setDescription] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const [aiTitle, setAiTitle] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [aiKeywords, setAiKeywords] = useState("");
  const [aiTagline, setAiTagline] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setAiTitle("Handcrafted Blue Pottery Vase — Jaipur Heritage");
      setAiDescription(
        "This stunning blue pottery vase is a testament to the centuries-old craft tradition of Jaipur. Each piece is hand-formed using a blend of quartz stone powder and multani mitti, then hand-painted with cobalt blue motifs inspired by Persian and Mughal art. The natural, lead-free glaze gives it a distinctive luminous finish that catches light beautifully."
      );
      setAiKeywords("blue pottery, jaipur craft, handmade vase, ceramic art, indian handicraft, home decor");
      setAiTagline("Where ancient artistry meets your modern home.");
      setIsGenerating(false);
      setGenerated(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl pt-28 md:pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Create Product</h1>
          <p className="text-muted-foreground mb-8">Upload a photo, tell us about it — AI does the rest.</p>

          {/* Image Upload */}
          <label className="block mb-6 cursor-pointer">
            <div className="bg-surface rounded-3xl p-2 card-shadow overflow-hidden">
              {image ? (
                <img src={image} alt="Product" className="w-full aspect-square object-cover rounded-2xl" />
              ) : (
                <div className="w-full aspect-square rounded-2xl bg-muted flex flex-col items-center justify-center gap-3">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-muted-foreground font-medium">Tap to upload product photo</p>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>

          {/* Category */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Craft Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface card-shadow text-foreground hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Materials Used</label>
            <input
              type="text"
              placeholder="e.g., Clay, natural dyes, quartz"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl bg-surface card-shadow text-lg font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Description with voice */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Short Description</label>
            <div className="relative">
              <textarea
                placeholder="Describe your product in a few words..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-5 py-4 rounded-2xl bg-surface card-shadow text-lg font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <button className="absolute right-3 bottom-3 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Mic className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>

          {/* Time spent */}
          <div className="mb-8">
            <label className="text-sm font-medium text-foreground mb-2 block">Time to Make (hours)</label>
            <input
              type="number"
              placeholder="e.g., 8"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl bg-surface card-shadow text-lg font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Generate Button */}
          <Button
            variant="hero"
            size="xl"
            className="w-full mb-8"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Drafting with AI...
              </>
            ) : generated ? (
              <>
                <Check className="w-5 h-5" /> Regenerate
              </>
            ) : (
              "Draft listing with AI"
            )}
          </Button>

          {/* AI Generated Content */}
          {(generated || isGenerating) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: isGenerating ? 0.5 : 1, y: 0 }}
              transition={spring}
              className="space-y-6"
            >
              <div className="ai-zone">
                <label className="text-xs font-medium text-secondary uppercase tracking-wider mb-2 block">AI-Generated Title</label>
                <input
                  type="text"
                  value={aiTitle}
                  onChange={(e) => setAiTitle(e.target.value)}
                  className="w-full bg-transparent text-lg font-serif font-semibold text-foreground focus:outline-none"
                  placeholder={isGenerating ? "Generating..." : ""}
                />
              </div>

              <div className="ai-zone">
                <label className="text-xs font-medium text-secondary uppercase tracking-wider mb-2 block">AI-Generated Description</label>
                <textarea
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                  rows={5}
                  className="w-full bg-transparent text-base text-foreground leading-relaxed focus:outline-none resize-none"
                  placeholder={isGenerating ? "Generating..." : ""}
                />
              </div>

              <div className="ai-zone">
                <label className="text-xs font-medium text-secondary uppercase tracking-wider mb-2 block">Marketing Tagline</label>
                <input
                  type="text"
                  value={aiTagline}
                  onChange={(e) => setAiTagline(e.target.value)}
                  className="w-full bg-transparent text-base font-serif italic text-foreground focus:outline-none"
                  placeholder={isGenerating ? "Generating..." : ""}
                />
              </div>

              <div className="ai-zone">
                <label className="text-xs font-medium text-secondary uppercase tracking-wider mb-2 block">SEO Keywords</label>
                <input
                  type="text"
                  value={aiKeywords}
                  onChange={(e) => setAiKeywords(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none"
                  placeholder={isGenerating ? "Generating..." : ""}
                />
              </div>

              {generated && (
                <Button variant="hero" size="xl" className="w-full">
                  Publish Listing
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CreateProduct;
