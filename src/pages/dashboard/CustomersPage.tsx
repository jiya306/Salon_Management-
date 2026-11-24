import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Award,
  Calendar,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { api } from '../../services/api/apiClient.js';
import { Customer, Staff, Service } from '../../types/index.js';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Badge } from '../../components/ui/Badge.js';
import { Modal } from '../../components/ui/Modal.js';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerAppointments, setCustomerAppointments] = useState<any[]>([]);

  // Add Customer Form
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (selectedTier !== 'All') params.tier = selectedTier;

      const res = await api.get('/customers', params);
      if (res.success && res.data) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, selectedTier]);

  const openCustomerDetail = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setDetailModalOpen(true);
    try {
      const res = await api.get(`/customers/${customer._id}/appointments`);
      if (res.success && res.data) {
        setCustomerAppointments(res.data);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formEmail) {
      setFormError('Please enter name, phone, and email.');
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');
      const res = await api.post('/customers', {
        fullName: formName,
        phone: formPhone,
        email: formEmail,
        address: formAddress,
        notes: formNotes,
      });

      if (res.success) {
        setAddModalOpen(false);
        fetchCustomers();
        setFormName('');
        setFormPhone('');
        setFormEmail('');
        setFormAddress('');
        setFormNotes('');
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to add customer');
    } finally {
      setFormLoading(false);
    }
  };

  const tiers = ['All', 'Bronze', 'Silver', 'Gold', 'Platinum'];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Gold':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Silver':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-[#F3F0E8] text-[#575757] border-[#202020]/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
            Customer CRM Directory
          </h1>
          <p className="text-xs text-[#646464] mt-1 font-mono">
            {customers.length} registered salon guests
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setAddModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Customer
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedTier === t
                  ? 'bg-[#202020] text-white shadow-soft font-bold'
                  : 'bg-[#F3F0E8] text-[#646464] hover:bg-neutral-200'
              }`}
            >
              {t} {t !== 'All' ? 'Tier' : ''}
            </button>
          ))}
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="p-0 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F3F0E8] border-b border-[#202020]/10 text-[#646464] uppercase font-mono tracking-wider">
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Loyalty Tier</th>
                <th className="py-3 px-4">Points</th>
                <th className="py-3 px-4">Total Visits</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]/5">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#646464]">
                    No customer records found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => openCustomerDetail(c)}
                    className="hover:bg-[#F9F7F3] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#202020] block text-sm">{c.fullName}</span>
                      <span className="text-[#646464] text-[11px] block">{c.address || 'Mumbai'}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span className="text-[#202020] block font-medium">{c.phone}</span>
                      <span className="text-[#646464] block">{c.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getTierColor(
                          c.loyaltyTier
                        )}`}
                      >
                        {c.loyaltyTier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0E4A66]">
                      {c.loyaltyPoints} pts
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#202020]">
                      {c.totalVisits} visits
                    </td>
                    <td className="py-3.5 px-4 font-bold font-display text-sm text-[#202020]">
                      ₹{(c.totalSpending || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCustomerDetail(c);
                        }}
                        className="px-3 py-1 rounded-full bg-white hover:bg-[#7CCBEE] text-[#202020] hover:text-[#143644] font-semibold text-xs border border-[#202020]/10 transition-colors"
                      >
                        Profile →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Detail Profile Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedCustomer?.fullName || 'Customer Profile'}
        description="Comprehensive guest history, spending, loyalty points, and notes."
        maxWidth="2xl"
      >
        {selectedCustomer && (
          <div className="space-y-6 text-xs">
            {/* Top Stat Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#F9F7F3] border border-[#202020]/10">
                <span className="text-[#646464] block">Loyalty Tier</span>
                <span className="font-display font-bold text-base text-[#202020] block mt-0.5">
                  {selectedCustomer.loyaltyTier}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F9F7F3] border border-[#202020]/10">
                <span className="text-[#646464] block">Loyalty Points</span>
                <span className="font-display font-bold text-base text-[#42A9D8] block mt-0.5">
                  {selectedCustomer.loyaltyPoints} pts
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F9F7F3] border border-[#202020]/10">
                <span className="text-[#646464] block">Total Visits</span>
                <span className="font-display font-bold text-base text-[#202020] block mt-0.5">
                  {selectedCustomer.totalVisits}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F9F7F3] border border-[#202020]/10">
                <span className="text-[#646464] block">Lifetime Value</span>
                <span className="font-display font-bold text-base text-[#2B9A66] block mt-0.5">
                  ₹{(selectedCustomer.totalSpending || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-4 rounded-xl bg-white border border-[#202020]/10 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#646464]">Phone:</span>
                <span className="font-mono font-bold text-[#202020]">{selectedCustomer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#646464]">Email:</span>
                <span className="font-mono text-[#202020]">{selectedCustomer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#646464]">Address:</span>
                <span className="text-[#202020]">{selectedCustomer.address || 'Mumbai'}</span>
              </div>
              {selectedCustomer.notes && (
                <div className="pt-2 border-t border-[#202020]/10">
                  <span className="text-[#646464] block mb-1">Stylist Preferences / Notes:</span>
                  <p className="text-[#202020] italic bg-[#F9F7F3] p-2.5 rounded-lg border border-[#202020]/10">
                    "{selectedCustomer.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Appointment History for this guest */}
            <div>
              <h4 className="font-display font-bold text-sm text-[#202020] mb-3">
                Appointment History ({customerAppointments.length})
              </h4>
              <div className="max-h-48 overflow-y-auto divide-y divide-[#202020]/10 border border-[#202020]/10 rounded-xl bg-white">
                {customerAppointments.length === 0 ? (
                  <p className="py-4 text-center text-[#646464]">No appointment records loaded.</p>
                ) : (
                  customerAppointments.map((apt: any) => (
                    <div key={apt._id} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#202020] block">{apt.serviceName}</span>
                        <span className="text-[11px] text-[#646464] font-mono">
                          {apt.appointmentDate} • Stylist: {apt.stylistName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-display text-xs text-[#202020] block">
                          ₹{apt.finalPrice}
                        </span>
                        <Badge variant={apt.status === 'Completed' ? 'success' : 'neutral'} size="sm">
                          {apt.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Customer Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Customer"
        description="Register a new guest into the SalonFlow CRM."
      >
        <form onSubmit={handleAddCustomer} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">{formError}</div>
          )}

          <Input
            label="Full Name *"
            placeholder="e.g. Diya Sethi"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />

          <Input
            label="Mobile Phone *"
            placeholder="+91 98201 33011"
            value={formPhone}
            onChange={(e) => setFormPhone(e.target.value)}
            required
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="diya.sethi@gmail.com"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            required
          />

          <Input
            label="Residential Address"
            placeholder="Bandra West, Mumbai"
            value={formAddress}
            onChange={(e) => setFormAddress(e.target.value)}
          />

          <Input
            label="Client Preferences & Notes"
            placeholder="e.g. Sensitive skin, likes iced chamomile tea"
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={formLoading}>
              Save Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
