import { Heart } from "lucide-react";
import { Badge } from "../ui/badge";

export function Footer() {
  return (
    <footer className="bg-[var(--text-primary)] text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-8 h-8 text-[var(--coral-pink)] fill-current" />
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">CourseCoc</span>
                <Badge
                  variant="secondary"
                  className="bg-[var(--coral-pink)] text-white border-[var(--coral-pink)] text-xs"
                >
                  Beta
                </Badge>
              </div>
            </div>
            <p className="text-white/70 mb-6 leading-relaxed max-w-md">
              Create perfect date courses and turn ordinary moments into
              extraordinary memories. Every love story deserves a beautiful
              journey.
            </p>
            <div className="flex items-center space-x-4 text-sm text-white/60">
              <span>Made with ❤️ for couples worldwide</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3 text-white/70">
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  Templates
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3 text-white/70">
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--coral-pink)] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/60 text-sm mb-4 md:mb-0">
            © 2024 CourseCoc. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-white/60">
            <a
              href="#"
              className="hover:text-[var(--coral-pink)] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-[var(--coral-pink)] transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-[var(--coral-pink)] transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
