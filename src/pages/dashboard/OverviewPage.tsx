import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  IndianRupee,
  Scissors,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { api } from '../../services/api/apiClient.js';
import { Card } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';

export const OverviewPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/dashboard');
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const cards = data?.cards || {
    todayAppointmentsCount: 0,
    totalCustomers: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    activeStaffCount: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  };

  const revenueChart = data?.revenueChart || [];
  const lowStock = data?.lowStockProducts || [];
  const recentAppointments = data?.recentAppointments || [];

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
            Executive Dashboard
          </h1>
          <p className="text-xs text-[#646464] mt-1 font-mono">
            SalonFlow Operations & Performance Matrix
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/book">
            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
              New Appointment
            </Button>
          </Link>
          <Link to="/dashboard/billing">
            <Button variant="outline" size="sm">
              Generate Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-[#646464] mb-2">
            <span className="text-xs font-semibold">Today's Appointments</span>
            <CalendarDays className="w-4 h-4 text-[#42A9D8]" />
          </div>
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#202020]">
            {cards.todayAppointmentsCount}
          </p>
          <span className="text-[11px] text-[#42A9D8] font-mono mt-1 block">Live Schedule</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-[#646464] mb-2">
            <span className="text-xs font-semibold">Today's Revenue</span>
            <IndianRupee className="w-4 h-4 text-[#2B9A66]" />
          </div>
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#202020]">
            ₹{cards.todayRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-[#2B9A66] font-mono mt-1 block">Settled Payments</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-[#646464] mb-2">
            <span className="text-xs font-semibold">Monthly Revenue</span>
            <IndianRupee className="w-4 h-4 text-[#42A9D8]" />
          </div>
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#202020]">
            ₹{cards.monthlyRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-[#646464] font-mono mt-1 block">Current Month</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-[#646464] mb-2">
            <span className="text-xs font-semibold">Total Customers</span>
            <Users className="w-4 h-4 text-[#202020]" />
          </div>
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#202020]">
            {cards.totalCustomers}
          </p>
          <span className="text-[11px] text-[#646464] font-mono mt-1 block">CRM Database</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-[#646464] mb-2">
            <span className="text-xs font-semibold">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-display font-extrabold text-2xl text-[#202020]">
            {cards.pendingAppointments}
          </p>
          <span className="text-[11px] text-amber-600 font-mono mt-1 block">Awaiting Confirmation</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-[#646464] mb-2">
            <span className="text-xs font-semibold">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-[#2B9A66]" />
          </div>
          <p className="font-display font-extrabold text-2xl text-[#202020]">
            {cards.completedAppointments}
          </p>
          <span className="text-[11px] text-[#2B9A66] font-mono mt-1 block">Successful Sessions</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-[#646464] mb-2">
            <span className="text-xs font-semibold">Cancelled</span>
            <XCircle className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="font-display font-extrabold text-2xl text-[#202020]">
            {cards.cancelledAppointments}
          </p>
          <span className="text-[11px] text-[#646464] font-mono mt-1 block">Rescheduled/No-show</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-[#646464] mb-2">
            <span className="text-xs font-semibold">Active Staff</span>
            <Scissors className="w-4 h-4 text-[#42A9D8]" />
          </div>
          <p className="font-display font-extrabold text-2xl text-[#202020]">
            {cards.activeStaffCount}
          </p>
          <span className="text-[11px] text-[#42A9D8] font-mono mt-1 block">On Duty Today</span>
        </Card>
      </div>

      {/* Revenue & Appointments Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-bold text-lg text-[#202020]">
              7-Day Revenue & Appointments Trend
            </h3>
            <p className="text-xs text-[#646464]">Direct aggregation from settled MongoDB payment records</p>
          </div>
          <Link to="/dashboard/analytics" className="text-xs font-semibold text-[#42A9D8] hover:underline flex items-center gap-1">
            Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7CCBEE" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#7CCBEE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F0E8" />
              <XAxis dataKey="day" stroke="#646464" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#646464"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid rgba(32,32,32,0.1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#42A9D8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Two Column Section: Recent Appointments & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Appointments */}
        <Card className="lg:col-span-7 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-[#202020]">
              Recent Appointments
            </h3>
            <Link to="/dashboard/appointments" className="text-xs font-semibold text-[#42A9D8] hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-[#202020]/5">
            {recentAppointments.length === 0 ? (
              <p className="text-xs text-[#646464] py-6 text-center">No recent appointments</p>
            ) : (
              recentAppointments.map((apt: any) => (
                <div key={apt._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-[#202020] block">{apt.customerName}</span>
                    <span className="text-[#646464] block font-mono text-[11px]">{apt.serviceName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[11px] text-[#202020] block font-bold">
                      {apt.appointmentDate} • {apt.startTime}
                    </span>
                    <Badge
                      variant={
                        apt.status === 'Completed'
                          ? 'success'
                          : apt.status === 'Cancelled'
                          ? 'danger'
                          : 'blue'
                      }
                      size="sm"
                      className="mt-0.5"
                    >
                      {apt.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="lg:col-span-5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-display font-bold text-base text-[#202020]">
                Low Stock Alerts
              </h3>
            </div>
            <Link to="/dashboard/inventory" className="text-xs font-semibold text-[#42A9D8] hover:underline">
              Manage Stock
            </Link>
          </div>

          <div className="space-y-3">
            {lowStock.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#2B9A66] bg-green-50/50 rounded-xl">
                All inventory quantities are above minimum reorder levels.
              </div>
            ) : (
              lowStock.map((prod: any) => (
                <div
                  key={prod._id}
                  className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-[#202020] truncate">{prod.name}</p>
                    <p className="text-[10px] text-[#646464] font-mono">SKU: {prod.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-red-600 block">
                      {prod.stockQuantity} left
                    </span>
                    <span className="text-[10px] text-[#646464]">Min: {prod.minStockLevel}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
