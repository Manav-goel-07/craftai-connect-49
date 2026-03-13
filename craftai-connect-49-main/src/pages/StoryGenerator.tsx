import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const spring = { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.8 };

const StoryGenerator = () => {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState<{ brandStory: string; cultural: string; emotional: string } | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setStory({
        brandStory:
          "For four decades, the Devi family's hands have known no other language than clay. What began as a humble practice in the narrow lanes of Jaipur has blossomed into a living heritage — each pot a conversation between earth and artisan, fired not just by flames, but by generations of devotion.",
        cultural:
          "Blue pottery is one of Jaipur's most iconic craft traditions, brought to India via Persia and Central Asia in the 14th century. Unlike conventional pottery, it uses no clay — instead relying on quartz stone powder, raw glaze, and multani mitti. This unique technique produces the distinctive cobalt blue and turquoise hues that have become synonymous with Rajasthani artistry.",
        emotional:
          "When you hold a piece of Devi pottery, you're holding 40 years of mornings that began before dawn. Of calloused fingers that somehow still move with impossible tenderness. Of a grandmother's voice saying 'slower, slower' as she guided young hands on the wheel. This isn't mass-produced decor — it's a family's heartbeat, shaped in clay.",
      });
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl pt-28 md:pt-32 pb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Tell My Story</h1>
          <p className="text-muted-foreground mb-8">Write one sentence about your craft. AI will craft your full story.</p>

          <textarea
            placeholder="e.g., My family has been making pottery for 40 years."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="w-full px-5 py-4 rounded-2xl bg-surface card-shadow text-lg font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none mb-6"
          />

          <Button variant="hero" size="xl" className="w-full mb-8" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> Crafting your story...</> : <><BookOpen className="w-5 h-5" /> Generate My Story</>}
          </Button>

          {story && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="space-y-6">
              {[
                { label: "Brand Story", text: story.brandStory },
                { label: "Cultural Background", text: story.cultural },
                { label: "Emotional Storytelling", text: story.emotional },
              ].map((s) => (
                <div key={s.label} className="bg-surface rounded-3xl p-6 md:p-8 card-shadow">
                  <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">{s.label}</p>
                  <p className="font-serif text-lg text-foreground leading-relaxed italic">{s.text}</p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StoryGenerator;
