import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  IndianRupee,
  Calendar,
  Users,
  Scissors,
  Award,
} from 'lucide-react';
import { api } from '../../services/api/apiClient.js';
import { Card } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';

export const AnalyticsPage: React.FC = () => {
  const [revenueData, setRevenueData] = useState<any>(null);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [serviceData, setServiceData] = useState<any>(null);
  const [staffData, setStaffData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [revRes, aptRes, custRes, svcRes, stRes] = await Promise.all([
          api.get('/analytics/revenue'),
          api.get('/analytics/appointments'),
          api.get('/analytics/customers'),
          api.get('/analytics/services'),
          api.get('/analytics/staff'),
        ]);

        if (revRes.success) setRevenueData(revRes.data);
        if (aptRes.success) setAppointmentData(aptRes.data);
        if (custRes.success) setCustomerData(custRes.data);
        if (svcRes.success) setServiceData(svcRes.data);
        if (stRes.success) setStaffData(stRes.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ['#7CCBEE', '#42A9D8', '#1D76A0', '#0E4A66'];

  const monthlyRev = revenueData?.monthlyRevenue || [];
  const paymentMethods = revenueData?.methodBreakdown || [];
  const appointmentStatuses = appointmentData?.statusBreakdown || [];
  const popularServices = serviceData?.popularServices?.slice(0, 6) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
          Business Analytics & Intelligence
        </h1>
        <p className="text-xs text-[#646464] mt-1 font-mono">
          Real-time metrics aggregated directly across MongoDB collections
        </p>
      </div>

      {/* Row 1: Monthly Revenue Trend & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue */}
        <Card className="lg:col-span-8 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-base text-[#202020]">
                Annual Revenue Projection (INR)
              </h3>
              <p className="text-xs text-[#646464]">Monthly turnover from settled appointment invoices</p>
            </div>
            <Badge variant="blue" size="sm">2026 Financial Year</Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRev} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7CCBEE" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#7CCBEE" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F0E8" />
                <XAxis dataKey="month" stroke="#646464" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#646464"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid rgba(32,32,32,0.1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#42A9D8"
                  strokeWidth={2.5}
                  fill="url(#analyticsRevGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Methods Breakdown */}
        <Card className="lg:col-span-4 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-[#202020] mb-1">
              Payment Mode Share
            </h3>
            <p className="text-xs text-[#646464] mb-4">Distribution by payment channel</p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentMethods.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => `₹${Number(val).toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-[#202020]/10 font-mono">
            {paymentMethods.map((m: any, i: number) => (
              <div key={m.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-[#646464]">{m.name}:</span>
                <span className="font-bold text-[#202020]">₹{(m.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 2: Appointment Statuses & Most Popular Treatments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appointment Statuses */}
        <Card className="lg:col-span-6 p-6">
          <h3 className="font-display font-bold text-base text-[#202020] mb-1">
            Appointment Status Distribution
          </h3>
          <p className="text-xs text-[#646464] mb-6">Booking completion vs cancellation tracking</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentStatuses} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F0E8" />
                <XAxis dataKey="status" stroke="#646464" fontSize={11} tickLine={false} />
                <YAxis stroke="#646464" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid rgba(32,32,32,0.1)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#42A9D8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Most Popular Services */}
        <Card className="lg:col-span-6 p-6">
          <h3 className="font-display font-bold text-base text-[#202020] mb-1">
            Top Performing Treatments
          </h3>
          <p className="text-xs text-[#646464] mb-6">Ranked by client booking volume & revenue</p>

          <div className="space-y-4">
            {popularServices.map((svc: any, idx: number) => (
              <div key={svc.name} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#202020] truncate max-w-xs">
                    {idx + 1}. {svc.name}
                  </span>
                  <div className="text-right font-mono font-bold text-[#202020] shrink-0">
                    ₹{svc.revenue.toLocaleString('en-IN')}{' '}
                    <span className="text-[#646464] font-normal text-[11px]">({svc.bookings} bkgs)</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F3F0E8] overflow-hidden">
                  <div
                    className="h-full bg-[#7CCBEE] rounded-full"
                    style={{
                      width: `${Math.min(100, (svc.bookings / (popularServices[0]?.bookings || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Staff Performance Matrix */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-base text-[#202020] mb-1">
          Stylist & Artist Performance Leaderboard
        </h3>
        <p className="text-xs text-[#646464] mb-6">Revenue attribution and commission metrics per stylist</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F3F0E8] border-b border-[#202020]/10 text-[#646464] uppercase font-mono tracking-wider">
                <th className="py-3 px-4">Stylist Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Completed Bookings</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Revenue Generated</th>
                <th className="py-3 px-4 text-right">Commission Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]/5">
              {staffData.map((st) => (
                <tr key={st.id} className="hover:bg-[#F9F7F3] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#202020]">{st.name}</td>
                  <td className="py-3.5 px-4 text-[#646464]">{st.role}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#202020]">{st.completedBookings}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-600">★ {st.rating}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#42A9D8]">
                    ₹{(st.revenue || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2B9A66] text-right">
                    ₹{(st.commission || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
