import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mic, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ArtisanCard from "@/components/ArtisanCard";

import heroImage from "@/assets/hero-artisan.jpg";
import craftsCollection from "@/assets/crafts-collection.jpg";
import artisan1 from "@/assets/artisan-portrait-1.jpg";
import artisan2 from "@/assets/artisan-portrait-2.jpg";
import productCeramic from "@/assets/product-ceramic.jpg";
import productTextile from "@/assets/product-textile.jpg";
import productJewelry from "@/assets/product-jewelry.jpg";
import productBasket from "@/assets/product-basket.jpg";

const spring = { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.8 };

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { ...spring, delay: 0.1 },
};

const products = [
  { id: "1", image: productCeramic, title: "Blue Pottery Vase", price: 2400, artisan: "Priya Devi", category: "Ceramics" },
  { id: "2", image: productTextile, title: "Indigo Hand-woven Stole", price: 1800, artisan: "Rajan Kumar", category: "Textiles" },
  { id: "3", image: productJewelry, title: "Brass Heritage Necklace", price: 3200, artisan: "Kamala Bai", category: "Jewelry" },
  { id: "4", image: productBasket, title: "Bamboo Storage Basket", price: 950, artisan: "Mohan Lal", category: "Basketry" },
];

const artisans = [
  { image: artisan1, name: "Priya Devi", craft: "Pottery & Ceramics", location: "Jaipur, Rajasthan" },
  { image: artisan2, name: "Rajan Kumar", craft: "Brass Metalwork", location: "Moradabad, UP" },
];

const features = [
  { icon: Mic, title: "Voice-First Listings", desc: "Speak about your craft. Our AI writes the listing for you." },
  { icon: Sparkles, title: "AI Storytelling", desc: "Turn a simple sentence into a compelling brand story." },
  { icon: Globe, title: "Global Reach", desc: "SEO keywords, social posts, and translations — all generated." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-20 md:pt-0">
        <div className="container grid md:grid-cols-2 items-center min-h-screen gap-8 md:gap-16">
          <motion.div {...fadeUp} className="pt-16 md:pt-0">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">AI-Powered Craft Platform</p>
            <h1 className="fluid-hero font-serif font-bold text-foreground mb-6">
              Your Craft.<br />The World's Stage.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mb-8">
              Focus on your hands. Let our AI write the stories, find the keywords, and build your digital shop.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">Start Selling <ArrowRight className="w-5 h-5 ml-1" /></Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/marketplace">Explore Crafts</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: 0.3 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden card-shadow">
              <img src={heroImage} alt="Artisan hands shaping clay on a pottery wheel" className="w-full object-cover aspect-[4/3]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-surface">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              From hands to the world — in minutes
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ ...spring, delay: 0.1 + i * 0.1 }}
                className="bg-background rounded-3xl p-8 card-shadow text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Crafts */}
      <section className="section-padding">
        <div className="container">
          <motion.div {...fadeUp} className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Popular Crafts</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Handmade with soul</h2>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link to="/marketplace">View all <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, i) => (
              <motion.div key={p.id} {...fadeUp} transition={{ ...spring, delay: 0.05 * i }}>
                <ProductCard {...p} />
              </motion.div>
            ))}
          </div>

          <div className="md:hidden mt-8 text-center">
            <Button variant="outline" asChild>
              <Link to="/marketplace">View all crafts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Artisans */}
      <section className="section-padding bg-surface">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Featured Artisans</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Meet the makers</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {artisans.map((a, i) => (
              <motion.div key={a.name} {...fadeUp} transition={{ ...spring, delay: 0.1 * i }}>
                <ArtisanCard {...a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with crafts collection image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={craftsCollection} alt="Collection of handmade Indian crafts" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-secondary/80" />
        </div>
        <div className="container section-padding relative z-10 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-secondary-foreground mb-6">
              Ready to share your craft<br />with the world?
            </h2>
            <p className="text-secondary-foreground/70 text-lg mb-8 max-w-lg mx-auto">
              Join hundreds of artisans already using AI to grow their craft business.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">Join as Artisan <ArrowRight className="w-5 h-5 ml-1" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
