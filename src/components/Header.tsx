"use client";

import { Heart, Plus, Map, BookOpen, Users, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--header-backdrop)] border-b border-[var(--border)] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Heart className="w-8 h-8 text-[var(--coral-pink)] fill-current" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-[var(--text-primary)]">
                CourseCoc
              </span>
              <Badge
                variant="secondary"
                className="bg-[var(--light-pink)] text-[var(--coral-pink)] border-[var(--coral-pink)] text-xs"
              >
                Beta
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button className="flex items-center space-x-2 text-[var(--coral-pink)] font-medium transition-colors duration-200">
              <Map className="w-5 h-5" />
              <span>Map</span>
            </button>
            <button className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--coral-pink)] font-medium transition-colors duration-200">
              <BookOpen className="w-5 h-5" />
              <span>My Courses</span>
            </button>
            <button className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--coral-pink)] font-medium transition-colors duration-200">
              <Users className="w-5 h-5" />
              <span>Community</span>
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-gradient-to-r from-[var(--very-light-pink)] via-[var(--light-pink)] to-[var(--coral-pink)] text-white hover:shadow-lg hover:shadow-[var(--pink-shadow)] transition-all duration-300 transform hover:-translate-y-0.5">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--coral-pink)] transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)]">
            <div className="flex flex-col space-y-4">
              <button className="flex items-center space-x-2 text-[var(--coral-pink)] font-medium py-2">
                <Map className="w-5 h-5" />
                <span>Map</span>
              </button>
              <button className="flex items-center space-x-2 text-[var(--text-secondary)] font-medium py-2">
                <BookOpen className="w-5 h-5" />
                <span>My Courses</span>
              </button>
              <button className="flex items-center space-x-2 text-[var(--text-secondary)] font-medium py-2">
                <Users className="w-5 h-5" />
                <span>Community</span>
              </button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-[var(--very-light-pink)] via-[var(--light-pink)] to-[var(--coral-pink)] text-white mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
