import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface ArtisanCardProps {
  image: string;
  name: string;
  craft: string;
  location: string;
}

const spring = { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.8 };

const ArtisanCard = ({ image, name, craft, location }: ArtisanCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={spring}
    className="bg-surface rounded-3xl p-2 card-shadow hover:card-shadow-hover transition-shadow duration-300"
  >
    <img src={image} alt={name} className="artisan-image w-full" loading="lazy" />
    <div className="p-4 text-center">
      <h3 className="font-serif text-lg font-medium text-foreground">{name}</h3>
      <p className="text-sm text-primary font-medium mt-1">{craft}</p>
      <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
        <MapPin className="w-3 h-3" /> {location}
      </p>
    </div>
  </motion.div>
);

export default ArtisanCard;
