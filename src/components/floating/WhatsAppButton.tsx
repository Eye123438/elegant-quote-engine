import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = '254700000000'; // Update with actual number
const DEFAULT_MESSAGE = 'Hello! I am interested in your services.';

export function WhatsAppButton() {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check if popup was shown in this session
    const popupShown = sessionStorage.getItem('exitPopupShown');
    if (popupShown) {
      setHasShownPopup(true);
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves through the top of the page
      if (e.clientY <= 0 && !hasShownPopup && !popupShown) {
        setShowExitPopup(true);
        setHasShownPopup(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShownPopup]);

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
    window.open(url, '_blank');
  };

  const handlePromoClick = () => {
    const promoMessage = 'Hello! I saw your special 10% discount offer and I am interested!';
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(promoMessage)}`;
    window.open(url, '_blank');
    setShowExitPopup(false);
  };

  return (
    <>
      {/* WhatsApp Floating Button - positioned on left to not overlap AI chat */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="h-7 w-7" />
          
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-card text-foreground px-4 py-2 rounded-lg shadow-lg whitespace-nowrap border border-border"
            >
              <span className="font-medium">Chat with us on WhatsApp</span>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-card border-l border-b border-border rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitPopup(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-border">
                {/* Close button */}
                <button
                  onClick={() => setShowExitPopup(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Header with gradient */}
                <div className="bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground text-center">
                  <motion.div
                    initial={{ rotate: -10, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4"
                  >
                    <Gift className="h-8 w-8 text-accent-foreground" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">Wait! Don't Leave Yet!</h3>
                  <p className="text-primary-foreground/80">We have a special offer for you</p>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                  <div className="mb-6">
                    <span className="inline-block text-5xl font-bold text-accent mb-2">10% OFF</span>
                    <p className="text-muted-foreground">
                      Get 10% discount on your first project when you contact us today!
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      variant="gold" 
                      size="lg" 
                      className="w-full"
                      onClick={handlePromoClick}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Claim Discount on WhatsApp
                    </Button>
                    <button
                      onClick={() => setShowExitPopup(false)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      No thanks, I'll pay full price
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
