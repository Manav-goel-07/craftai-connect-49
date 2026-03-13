import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Mic, MicOff, Loader2, Sparkles, Copy, Check, IndianRupee, Tag, BookOpen, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const spring = { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.8 };

interface ListingData {
  title: string;
  description: string;
  story: string;
  priceMin: number;
  priceMax: number;
  tags: string[];
}

interface VisionData {
  object?: string;
  material?: string;
  craft?: string;
  colors?: string;
  style?: string;
  origin?: string;
  raw?: string;
}

const AIListingGenerator = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [listing, setListing] = useState<ListingData | null>(null);
  const [vision, setVision] = useState<VisionData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Voice
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Editable fields
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStory, setEditStory] = useState("");
  const [editPriceMin, setEditPriceMin] = useState("");
  const [editPriceMax, setEditPriceMax] = useState("");
  const [editTags, setEditTags] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImage(result);
      // Extract base64 data (remove data:image/...;base64, prefix)
      const base64 = result.split(",")[1];
      setImageBase64(base64);
      setListing(null);
      setVision(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!imageBase64) {
      toast.error("Please upload a product photo first");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-product", {
        body: { imageBase64, voiceText: voiceText || undefined },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const l = data.listing as ListingData;
      setListing(l);
      setVision(data.vision as VisionData);

      // Populate editable fields
      setEditTitle(l.title || "");
      setEditDescription(l.description || "");
      setEditStory(l.story || "");
      setEditPriceMin(String(l.priceMin || ""));
      setEditPriceMax(String(l.priceMax || ""));
      setEditTags((l.tags || []).join(", "));

      toast.success("Listing generated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to analyze product");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Voice recording
  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4",
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        chunksRef.current = [];
        stream.getTracks().forEach((t) => t.stop());

        // Use Web Speech API for transcription as a simple fallback
        // For production, connect to a proper STT service
        toast.info("Voice recorded! Using browser transcription...");
        try {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          if (!SpeechRecognition) {
            toast.error("Speech recognition not supported in this browser");
            return;
          }
        } catch {
          toast.error("Speech recognition not available");
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      if (error instanceof Error && error.name === "NotAllowedError") {
        toast.error("Microphone access denied. Check browser permissions.");
      } else {
        toast.error("Failed to access microphone");
      }
    }
  }, []);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  // Use Web Speech API for live transcription
  const handleVoiceInput = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported. Please type your description.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText((prev) => (prev ? prev + " " + transcript : transcript));
      toast.success("Voice captured!");
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error);
      if (event.error === "not-allowed") {
        toast.error("Microphone permission denied");
      } else {
        toast.error("Speech recognition failed. Please try again.");
      }
    };

    recognition.start();
    setIsRecording(true);

    recognition.onend = () => setIsRecording(false);
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl pt-28 md:pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              AI Listing Generator
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Upload a photo of your craft. AI analyzes it and creates a complete marketplace listing.
            </p>
          </div>

          {/* Image Upload */}
          <label className="block mb-8 cursor-pointer group">
            <div className="bg-card rounded-3xl p-2 card-shadow overflow-hidden transition-shadow hover:card-shadow-hover">
              {image ? (
                <div className="relative">
                  <img src={image} alt="Product" className="w-full aspect-[4/3] object-cover rounded-2xl" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 rounded-2xl transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-card rounded-full px-4 py-2 card-shadow flex items-center gap-2 text-sm font-medium text-foreground">
                      <Camera className="w-4 h-4" /> Change photo
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[4/3] rounded-2xl bg-muted flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-semibold text-lg">Upload product photo</p>
                    <p className="text-muted-foreground text-sm mt-1">JPG or PNG, up to 10 MB</p>
                  </div>
                </div>
              )}
            </div>
            <input type="file" accept="image/jpeg,image/png" capture="environment" className="hidden" onChange={handleImageUpload} />
          </label>

          {/* Voice Input */}
          <div className="mb-8">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Tell us about your craft (optional)
            </label>
            <div className="relative">
              <textarea
                placeholder="e.g., My family has been making this pottery for 3 generations using local clay..."
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                rows={3}
                className="w-full px-5 py-4 pr-14 rounded-2xl bg-card card-shadow text-base font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <button
                type="button"
                onClick={isRecording ? handleStopRecording : handleVoiceInput}
                className={`absolute right-3 bottom-3 w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                  isRecording
                    ? "bg-destructive text-destructive-foreground animate-pulse"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            {isRecording && (
              <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                Listening... speak now
              </p>
            )}
          </div>

          {/* Generate Button */}
          <Button variant="hero" size="xl" className="w-full mb-10" onClick={handleGenerate} disabled={isAnalyzing || !image}>
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI analyzing your craft...
              </>
            ) : listing ? (
              <>
                <Sparkles className="w-5 h-5" />
                Regenerate Listing
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Listing with AI
              </>
            )}
          </Button>

          {/* Loading State */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="bg-card rounded-3xl p-8 card-shadow text-center mb-8"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Analyzing your craft...</h3>
                <p className="text-muted-foreground">Our AI is studying the image, identifying materials, and crafting your listing.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vision Analysis Badge */}
          <AnimatePresence>
            {vision && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
                className="bg-secondary/5 rounded-2xl p-5 mb-6"
              >
                <p className="text-xs font-medium text-secondary uppercase tracking-wider mb-3">
                  🔍 Image Analysis
                </p>
                <div className="flex flex-wrap gap-2">
                  {vision.object && <Badge label="Object" value={vision.object} />}
                  {vision.material && <Badge label="Material" value={vision.material} />}
                  {vision.craft && <Badge label="Craft" value={vision.craft} />}
                  {vision.colors && <Badge label="Colors" value={vision.colors} />}
                  {vision.style && <Badge label="Style" value={vision.style} />}
                  {vision.origin && <Badge label="Origin" value={vision.origin} />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Listing Preview */}
          <AnimatePresence>
            {listing && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
                className="space-y-5"
              >
                {/* Preview Card */}
                {image && (
                  <div className="bg-card rounded-3xl overflow-hidden card-shadow">
                    <img src={image} alt={editTitle} className="w-full aspect-[16/9] object-cover" />
                    <div className="p-6">
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-1">{editTitle}</h2>
                      <p className="text-primary font-semibold text-lg">
                        ₹{editPriceMin} – ₹{editPriceMax}
                      </p>
                    </div>
                  </div>
                )}

                {/* Editable Title */}
                <EditableField
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Product Title"
                  value={editTitle}
                  onChange={setEditTitle}
                  onCopy={() => copyToClipboard(editTitle, "title")}
                  copied={copiedField === "title"}
                />

                {/* Editable Description */}
                <EditableField
                  icon={<BookOpen className="w-4 h-4" />}
                  label="Product Description"
                  value={editDescription}
                  onChange={setEditDescription}
                  multiline
                  onCopy={() => copyToClipboard(editDescription, "desc")}
                  copied={copiedField === "desc"}
                />

                {/* Price */}
                <div className="ai-zone">
                  <div className="flex items-center gap-2 mb-3">
                    <IndianRupee className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                      Suggested Price Range
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Min (₹)</label>
                      <input
                        type="number"
                        value={editPriceMin}
                        onChange={(e) => setEditPriceMin(e.target.value)}
                        className="w-full bg-card rounded-xl px-4 py-3 text-lg font-semibold text-foreground card-shadow focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Max (₹)</label>
                      <input
                        type="number"
                        value={editPriceMax}
                        onChange={(e) => setEditPriceMax(e.target.value)}
                        className="w-full bg-card rounded-xl px-4 py-3 text-lg font-semibold text-foreground card-shadow focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Cultural Story */}
                <EditableField
                  icon={<BookOpen className="w-4 h-4" />}
                  label="Cultural Story"
                  value={editStory}
                  onChange={setEditStory}
                  multiline
                  onCopy={() => copyToClipboard(editStory, "story")}
                  copied={copiedField === "story"}
                />

                {/* Tags */}
                <div className="ai-zone">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-secondary uppercase tracking-wider">SEO Tags</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(editTags, "tags")}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      {copiedField === "tags" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedField === "tags" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground focus:outline-none"
                    placeholder="comma-separated tags"
                  />
                </div>

                {/* Publish */}
                <Button variant="hero" size="xl" className="w-full" onClick={() => toast.success("Listing saved! (Connect a database to persist)")}>
                  Publish Listing
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

// Small helper components

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 text-xs card-shadow">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  );
}

function EditableField({
  icon,
  label,
  value,
  onChange,
  multiline,
  onCopy,
  copied,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="ai-zone">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          <span className="text-xs font-medium text-secondary uppercase tracking-wider">{label}</span>
        </div>
        <button
          onClick={onCopy}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className="w-full bg-transparent text-base text-foreground leading-relaxed focus:outline-none resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-lg font-serif font-semibold text-foreground focus:outline-none"
        />
      )}
    </div>
  );
}

export default AIListingGenerator;
