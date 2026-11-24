import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Scissors,
  Sparkles,
  Receipt,
  Package,
  Award,
  Tag,
  Star,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { Badge } from '../ui/Badge.js';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
    { label: 'Appointments', to: '/dashboard/appointments', icon: CalendarDays },
    { label: 'Customers CRM', to: '/dashboard/customers', icon: Users },
    { label: 'Staff & Stylists', to: '/dashboard/staff', icon: Scissors },
    { label: 'Services Menu', to: '/dashboard/services', icon: Sparkles },
    { label: 'Billing & Invoices', to: '/dashboard/billing', icon: Receipt },
    { label: 'Inventory', to: '/dashboard/inventory', icon: Package },
    { label: 'Loyalty Rewards', to: '/dashboard/loyalty', icon: Award },
    { label: 'Promotions & Coupons', to: '/dashboard/promotions', icon: Tag },
    { label: 'Reviews & Ratings', to: '/dashboard/reviews', icon: Star },
    { label: 'Analytics', to: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Salon Settings', to: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#202020]/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#F3F0E8] border-r border-[#202020]/10 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-[#202020]/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#7CCBEE] flex items-center justify-center text-[#143644]">
              <Sparkles className="w-4 h-4 fill-[#143644]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-[#202020]">
                Salon<span className="text-[#42A9D8]">Flow</span>
              </span>
              <span className="block text-[9px] tracking-widest text-[#646464] uppercase font-mono">
                Management
              </span>
            </div>
          </Link>
          <Link
            to="/"
            title="View Public Site"
            className="p-1.5 rounded-full hover:bg-white text-[#646464] hover:text-[#202020] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-white text-[#202020] shadow-soft border border-[#7CCBEE]/50 font-bold'
                    : 'text-[#575757] hover:bg-white/60 hover:text-[#202020]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#42A9D8]' : 'text-[#646464]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7CCBEE]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#202020]/10 bg-white/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#7CCBEE]/30 border border-[#7CCBEE] flex items-center justify-center font-display font-bold text-sm text-[#0E4A66] overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#202020] truncate">{user?.name}</p>
              <Badge variant="blue" size="sm" className="mt-0.5 scale-90 origin-left">
                {user?.role?.replace('_', ' ') || 'STAFF'}
              </Badge>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
