import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  artisan: string;
  category: string;
}

const spring = { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.8 };

const ProductCard = ({ id, image, title, price, artisan, category }: ProductCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={spring}
    className="group"
  >
    <Link to={`/product/${id}`} className="block">
      <div className="bg-surface rounded-3xl p-2 card-shadow transition-shadow duration-300 group-hover:card-shadow-hover">
        <div className="overflow-hidden rounded-2xl">
          <img
            src={image}
            alt={title}
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4 pb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{category}</p>
          <h3 className="font-serif text-lg font-medium text-foreground leading-snug mb-1">{title}</h3>
          <div className="flex items-center justify-between">
            <span className="font-sans font-semibold text-foreground tabular-nums">₹{price.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">by {artisan}</span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default ProductCard;
