import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Share2, BookOpen, Eye, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

import productCeramic from "@/assets/product-ceramic.jpg";
import productTextile from "@/assets/product-textile.jpg";

const spring = { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.8 };

const stats = [
  { icon: Package, label: "Products", value: "12", color: "text-primary" },
  { icon: Eye, label: "Views Today", value: "142", color: "text-secondary" },
  { icon: ShoppingCart, label: "Orders", value: "8", color: "text-primary" },
  { icon: TrendingUp, label: "Revenue", value: "₹24,800", color: "text-secondary" },
];

const quickActions = [
  { icon: Plus, label: "Create Product", path: "/create-product", desc: "Upload a photo, let AI do the rest" },
  { icon: Share2, label: "Social Media Post", path: "/social-generator", desc: "Generate captions & hashtags" },
  { icon: BookOpen, label: "Craft Story", path: "/story-generator", desc: "Tell your story with AI" },
];

const recentProducts = [
  { id: "1", image: productCeramic, title: "Blue Pottery Vase", views: 89, status: "Published" },
  { id: "2", image: productTextile, title: "Indigo Stole", views: 53, status: "Draft" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-28 md:pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-1">My Shop</h1>
          <p className="text-muted-foreground">Welcome back. Here's how your crafts are doing.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.05 * i }}
              className="bg-surface rounded-3xl p-6 card-shadow"
            >
              <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
              <p className="font-sans text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">AI Marketing Tools</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.path}
                className="group bg-surface rounded-3xl p-6 card-shadow hover:card-shadow-hover transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <a.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-sans font-semibold text-foreground mb-1">{a.label}</h3>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold text-foreground">My Products</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/create-product">+ Add Product</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {recentProducts.map((p) => (
              <div key={p.id} className="bg-surface rounded-2xl p-3 card-shadow flex items-center gap-4">
                <img src={p.image} alt={p.title} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{p.title}</h4>
                  <p className="text-sm text-muted-foreground">👀 {p.views} views</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  p.status === "Published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Link
          to="/create-product"
          className="bg-primary text-primary-foreground rounded-full px-6 py-4 flex items-center gap-3 float-shadow hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Listing
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
