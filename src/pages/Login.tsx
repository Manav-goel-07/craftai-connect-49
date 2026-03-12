import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const spring = { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.8 };

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-md pt-28 md:pt-32 pb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2 text-center">Welcome Back</h1>
          <p className="text-muted-foreground text-center mb-8">Log in to your CraftAI account.</p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-surface card-shadow text-lg font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-surface card-shadow text-lg font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>

            <Button variant="hero" size="xl" className="w-full">Log In</Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-background px-4 text-sm text-muted-foreground">or</span></div>
            </div>

            <Button variant="outline" size="lg" className="w-full rounded-2xl h-14">
              Continue with Google
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
