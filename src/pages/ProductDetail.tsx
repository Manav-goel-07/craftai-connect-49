import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Heart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

import productCeramic from "@/assets/product-ceramic.jpg";
import productTextile from "@/assets/product-textile.jpg";
import productJewelry from "@/assets/product-jewelry.jpg";
import productBasket from "@/assets/product-basket.jpg";
import artisan1 from "@/assets/artisan-portrait-1.jpg";

const spring = { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.8 };

const productData: Record<string, any> = {
  "1": {
    image: productCeramic,
    title: "Blue Pottery Vase — Jaipur Heritage",
    price: 2400,
    category: "Ceramics",
    artisan: { name: "Priya Devi", image: artisan1, location: "Jaipur, Rajasthan", craft: "Pottery & Ceramics" },
    description:
      "This stunning blue pottery vase is a testament to the centuries-old craft tradition of Jaipur. Each piece is hand-formed using a blend of quartz stone powder and multani mitti, then hand-painted with cobalt blue motifs inspired by Persian and Mughal art.",
    story:
      "For four decades, Priya's family has shaped clay into art. What began in a small workshop has blossomed into a living heritage — each pot a conversation between earth and artisan.",
    materials: "Quartz stone powder, multani mitti, natural cobalt oxide",
    timeToMake: "12 hours",
  },
};

const relatedProducts = [
  { id: "2", image: productTextile, title: "Indigo Hand-woven Stole", price: 1800, artisan: "Rajan Kumar", category: "Textiles" },
  { id: "3", image: productJewelry, title: "Brass Heritage Necklace", price: 3200, artisan: "Kamala Bai", category: "Jewelry" },
  { id: "4", image: productBasket, title: "Bamboo Storage Basket", price: 950, artisan: "Mohan Lal", category: "Basketry" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const product = productData[id || "1"] || productData["1"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 md:pt-28 pb-16">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring}>
            <div className="bg-surface rounded-3xl p-2 card-shadow">
              <img src={product.image} alt={product.title} className="w-full aspect-square object-cover rounded-2xl" />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.15 }}>
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-2">{product.category}</p>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">{product.title}</h1>
            <p className="font-sans text-3xl font-bold text-foreground tabular-nums mb-6">₹{product.price.toLocaleString()}</p>

            <p className="text-foreground/80 leading-relaxed mb-6">{product.description}</p>

            <div className="flex gap-3 mb-8">
              <Button variant="hero" size="lg" className="flex-1">Add to Cart</Button>
              <Button variant="outline" size="lg" className="rounded-2xl"><Heart className="w-5 h-5" /></Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-muted/50 rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Materials</p>
                <p className="text-sm font-medium text-foreground">{product.materials}</p>
              </div>
              <div className="bg-muted/50 rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Time to Make</p>
                <p className="text-sm font-medium text-foreground">{product.timeToMake}</p>
              </div>
            </div>

            {/* Artisan story */}
            <div className="bg-surface rounded-3xl p-6 card-shadow">
              <div className="flex items-center gap-3 mb-4">
                <img src={product.artisan.image} alt={product.artisan.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-foreground">{product.artisan.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {product.artisan.location}</p>
                </div>
              </div>
              <p className="font-serif text-sm italic text-foreground/80 leading-relaxed">{product.story}</p>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        <div className="mt-20">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
