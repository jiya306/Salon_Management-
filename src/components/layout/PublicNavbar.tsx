import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, User, Calendar } from 'lucide-react';
import { Button } from '../ui/Button.js';
import { useAuth } from '../../context/AuthContext.js';

export const PublicNavbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    { label: 'Services', href: '/#services' },
    { label: 'Stylists', href: '/#stylists' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Offers', href: '/#offers' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'Gallery', href: '/#gallery' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F9F7F3]/90 backdrop-blur-md border-b border-[#202020]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-[#7CCBEE] flex items-center justify-center text-[#143644] shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-[#143644]" />
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-[#202020]">
              Salon<span className="text-[#42A9D8]">Flow</span>
            </span>
            <span className="hidden sm:block text-[10px] tracking-widest text-[#646464] uppercase font-mono">
              Luxury Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#3A3A3A] hover:text-[#202020] hover:underline underline-offset-8 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <Link to="/dashboard">
              <Button variant="outline" size="sm" icon={<User className="w-4 h-4" />}>
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          <Link to="/book">
            <Button variant="primary" size="sm" icon={<Calendar className="w-4 h-4" />}>
              Book Appointment
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#202020] rounded-full hover:bg-[#F3F0E8]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#F9F7F3] border-b border-[#202020]/10 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-base font-medium text-[#202020] hover:text-[#42A9D8]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-[#202020]/10 flex flex-col gap-2.5">
            {user ? (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full">
                  Dashboard ({user.name})
                </Button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
            <Link to="/book" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" className="w-full">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
