import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#202020] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#7CCBEE] flex items-center justify-center text-[#143644]">
                <Sparkles className="w-4 h-4 fill-[#143644]" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                Salon<span className="text-[#7CCBEE]">Flow</span>
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Your Beauty. Your Time. Your Salon. An exquisite sanctuary offering bespoke hair, skincare, and bridal transformations.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#7CCBEE] hover:text-[#143644] transition-all flex items-center justify-center text-neutral-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#7CCBEE] hover:text-[#143644] transition-all flex items-center justify-center text-neutral-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#7CCBEE] hover:text-[#143644] transition-all flex items-center justify-center text-neutral-300">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-base mb-4 text-[#7CCBEE]">Discover</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><a href="#services" className="hover:text-white transition-colors">Hair Care & Colors</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Bridal & HD Airbrush</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">HydraFacial Therapy</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Gel Nails & Sculpting</a></li>
              <li><a href="#stylists" className="hover:text-white transition-colors">Meet Master Stylists</a></li>
              <li><Link to="/book" className="text-[#7CCBEE] hover:underline">Online Booking Wizard</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-display font-bold text-base mb-4 text-[#7CCBEE]">Studio Sanctuary</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#7CCBEE] shrink-0 mt-0.5" />
                <span>Waterfield Road, Bandra West, Mumbai, Maharashtra 400050</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#7CCBEE] shrink-0" />
                <span>+91 98200 45678 / +91 98200 12345</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#7CCBEE] shrink-0" />
                <span>concierge@salonflow.com</span>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="font-display font-bold text-base mb-4 text-[#7CCBEE]">Opening Hours</h4>
            <div className="space-y-2 text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7CCBEE]" />
                <span className="text-white font-medium">Monday – Sunday</span>
              </div>
              <p className="pl-6 text-xs text-neutral-400 font-mono">09:00 AM – 08:00 PM</p>
              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <p className="text-white font-medium mb-1">VIP Private Styling</p>
                <p className="text-neutral-400">Early morning & bridal sessions available on advance appointment request.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} SalonFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Hygiene Standards</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
