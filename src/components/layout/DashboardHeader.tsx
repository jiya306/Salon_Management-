import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, CalendarPlus, CheckCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useNotifications } from '../../context/NotificationContext.js';
import { Button } from '../ui/Button.js';
import { Badge } from '../ui/Badge.js';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#F9F7F3]/90 backdrop-blur-md border-b border-[#202020]/10 px-4 sm:px-8 flex items-center justify-between">
      {/* Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-full hover:bg-[#F3F0E8] text-[#202020]"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display font-bold text-lg sm:text-xl text-[#202020]">
            Welcome, {user?.name?.split(' ')[0] || 'Stylist'}
          </h2>
          <p className="text-[11px] text-[#646464] font-mono">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <Link to="/book">
          <Button
            variant="primary"
            size="sm"
            icon={<CalendarPlus className="w-4 h-4" />}
            className="hidden sm:inline-flex"
          >
            New Booking
          </Button>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full bg-white border border-[#202020]/10 hover:bg-[#F3F0E8] transition-colors text-[#202020]"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#42A9D8] ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-float border border-[#202020]/10 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-[#202020]/10">
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-sm text-[#202020]">Notifications</h4>
                  {unreadCount > 0 && <Badge variant="blue" size="sm">{unreadCount} new</Badge>}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-[11px] text-[#42A9D8] hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#202020]/5 my-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#646464] text-center py-6">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => {
                        if (!n.read) markAsRead(n._id);
                      }}
                      className={`py-2.5 px-2 rounded-xl cursor-pointer transition-colors ${
                        !n.read ? 'bg-[#B8E7FA]/20' : 'hover:bg-[#F9F7F3]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-[#202020]">{n.title}</p>
                        <span className="text-[10px] text-[#646464] shrink-0 font-mono">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#575757] mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
