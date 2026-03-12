import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-secondary text-secondary-foreground">
    <div className="container section-padding">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="font-serif text-2xl font-bold mb-4">
            Craft<span className="text-primary">AI</span>
          </h3>
          <p className="text-secondary-foreground/70 max-w-md leading-relaxed">
            Empowering local artisans to share their craft with the world. 
            AI-powered tools that handle the marketing, so you can focus on your hands.
          </p>
        </div>
        <div>
          <h4 className="font-sans font-semibold mb-4 text-sm uppercase tracking-wider text-secondary-foreground/50">Platform</h4>
          <div className="flex flex-col gap-3">
            <Link to="/marketplace" className="text-secondary-foreground/70 hover:text-primary transition-colors">Marketplace</Link>
            <Link to="/dashboard" className="text-secondary-foreground/70 hover:text-primary transition-colors">For Artisans</Link>
            <Link to="/about" className="text-secondary-foreground/70 hover:text-primary transition-colors">About</Link>
          </div>
        </div>
        <div>
          <h4 className="font-sans font-semibold mb-4 text-sm uppercase tracking-wider text-secondary-foreground/50">Support</h4>
          <div className="flex flex-col gap-3">
            <Link to="/help" className="text-secondary-foreground/70 hover:text-primary transition-colors">Help Center</Link>
            <Link to="/contact" className="text-secondary-foreground/70 hover:text-primary transition-colors">Contact</Link>
            <Link to="/privacy" className="text-secondary-foreground/70 hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-secondary-foreground/10 text-center text-sm text-secondary-foreground/40">
        © 2026 CraftAI. Made with care for artisans everywhere.
      </div>
    </div>
  </footer>
);

export default Footer;
