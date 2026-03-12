import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

import productCeramic from "@/assets/product-ceramic.jpg";
import productTextile from "@/assets/product-textile.jpg";
import productJewelry from "@/assets/product-jewelry.jpg";
import productBasket from "@/assets/product-basket.jpg";

const categories = ["All", "Ceramics", "Textiles", "Jewelry", "Basketry", "Woodwork", "Metalwork"];

const allProducts = [
  { id: "1", image: productCeramic, title: "Blue Pottery Vase", price: 2400, artisan: "Priya Devi", category: "Ceramics" },
  { id: "2", image: productTextile, title: "Indigo Hand-woven Stole", price: 1800, artisan: "Rajan Kumar", category: "Textiles" },
  { id: "3", image: productJewelry, title: "Brass Heritage Necklace", price: 3200, artisan: "Kamala Bai", category: "Jewelry" },
  { id: "4", image: productBasket, title: "Bamboo Storage Basket", price: 950, artisan: "Mohan Lal", category: "Basketry" },
  { id: "5", image: productCeramic, title: "Terracotta Diya Set", price: 450, artisan: "Priya Devi", category: "Ceramics" },
  { id: "6", image: productTextile, title: "Block Print Scarf", price: 1200, artisan: "Sita Devi", category: "Textiles" },
  { id: "7", image: productJewelry, title: "Silver Anklet Pair", price: 2800, artisan: "Kamala Bai", category: "Jewelry" },
  { id: "8", image: productBasket, title: "Cane Fruit Bowl", price: 680, artisan: "Mohan Lal", category: "Basketry" },
];

const spring = { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.8 };

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allProducts.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.artisan.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-28 md:pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Marketplace</h1>
          <p className="text-muted-foreground mb-8">Discover authentic handmade crafts from artisans across India.</p>
        </motion.div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search crafts or artisans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-surface card-shadow text-lg font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button variant="outline" size="lg" className="gap-2 rounded-2xl h-14">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface card-shadow text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id + p.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.03 * i }}
            >
              <ProductCard {...p} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg">No crafts found. Try a different search.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Marketplace;
