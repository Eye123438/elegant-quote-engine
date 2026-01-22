import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        {/* Logo */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mx-auto mb-8">
          <span className="text-2xl font-bold text-primary-foreground">JL</span>
        </div>

        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <span className="text-8xl md:text-9xl font-bold gradient-text">404</span>
        </motion.div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="gold" size="lg" asChild>
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/services">
              <Search className="mr-2 h-5 w-5" />
              View Services
            </Link>
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-8 text-muted-foreground">
          <Link to="/about" className="hover:text-accent transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
          <Link to="/portfolio" className="hover:text-accent transition-colors">Portfolio</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
