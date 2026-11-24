import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Search,
  Filter,
  Plus,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { api } from '../../services/api/apiClient.js';
import { Appointment, Service, Staff, AppointmentStatus } from '../../types/index.js';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { Input } from '../../components/ui/Input.js';
import { Modal } from '../../components/ui/Modal.js';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & View Mode
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedStylist, setSelectedStylist] = useState('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Form State for new appointment
  const [formServiceId, setFormServiceId] = useState('');
  const [formStylistId, setFormStylistId] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState('10:00');
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formCustomerPhone, setFormCustomerPhone] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedStylist !== 'all') params.stylist = selectedStylist;
      if (selectedDate) params.date = selectedDate;

      const res = await api.get('/appointments', params);
      if (res.success && res.data) {
        setAppointments(res.data);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [search, selectedStatus, selectedStylist, selectedDate]);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const [staffRes, svcRes] = await Promise.all([
          api.get('/staff'),
          api.get('/services'),
        ]);
        if (staffRes.success) setStaff(staffRes.data);
        if (svcRes.success) setServices(svcRes.data);
      } catch (e) {
        // ignore
      }
    };
    loadResources();
  }, []);

  const handleStatusChange = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      const res = await api.patch(`/appointments/${appointmentId}/status`, {
        status: newStatus,
        paymentStatus: newStatus === 'Completed' ? 'Paid' : undefined,
      });

      if (res.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === appointmentId ? res.data : a))
        );
        if (selectedAppointment?._id === appointmentId) {
          setSelectedAppointment(res.data);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formServiceId || !formDate || !formTime || !formCustomerName || !formCustomerPhone) {
      setCreateError('Please complete all required fields.');
      return;
    }

    try {
      setCreateLoading(true);
      setCreateError('');
      const res = await api.post('/appointments', {
        serviceId: formServiceId,
        stylistId: formStylistId || 'any',
        appointmentDate: formDate,
        startTime: formTime,
        customerName: formCustomerName,
        customerPhone: formCustomerPhone,
        notes: formNotes,
        bookingSource: 'Walk-in / Reception',
      });

      if (res.success) {
        setCreateModalOpen(false);
        fetchAppointments();
        // Reset form
        setFormCustomerName('');
        setFormCustomerPhone('');
        setFormNotes('');
      }
    } catch (err: any) {
      setCreateError(err.message || 'Booking failed');
    } finally {
      setCreateLoading(false);
    }
  };

  const statusOptions = [
    'All',
    'Pending',
    'Confirmed',
    'Checked In',
    'In Progress',
    'Completed',
    'Cancelled',
    'No Show',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
            Appointments Scheduling
          </h1>
          <p className="text-xs text-[#646464] mt-1 font-mono">
            {appointments.length} appointments in registry
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-[#F3F0E8] p-1 rounded-full border border-[#202020]/10 text-xs font-semibold">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-[#202020] shadow-soft font-bold'
                  : 'text-[#646464]'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-[#202020] shadow-soft font-bold'
                  : 'text-[#646464]'
              }`}
            >
              Calendar
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            New Booking
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search by customer, phone, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-3.5 outline-none focus:border-[#42A9D8]"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                Status: {opt}
              </option>
            ))}
          </select>

          {/* Stylist selector */}
          <select
            value={selectedStylist}
            onChange={(e) => setSelectedStylist(e.target.value)}
            className="min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-3.5 outline-none focus:border-[#42A9D8]"
          >
            <option value="all">All Stylists</option>
            {staff.map((st) => (
              <option key={st._id} value={st._id}>
                {st.fullName}
              </option>
            ))}
          </select>

          {/* Date Picker Filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-3.5 outline-none focus:border-[#42A9D8]"
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              className="text-xs text-[#646464] hover:text-[#202020] underline"
            >
              Clear date
            </button>
          )}
        </div>
      </Card>

      {/* Main View: List or Calendar */}
      {viewMode === 'list' ? (
        <Card className="p-0 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F3F0E8] border-b border-[#202020]/10 text-[#646464] uppercase font-mono tracking-wider">
                  <th className="py-3 px-4">Appointment ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Stylist</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]/5">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#646464]">
                      No appointments matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr
                      key={apt._id}
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setDetailModalOpen(true);
                      }}
                      className="hover:bg-[#F9F7F3] cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0E4A66]">
                        {apt.appointmentId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#202020] block">{apt.customerName}</span>
                        <span className="text-[#646464] text-[11px] font-mono">{apt.customerPhone}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#202020] block">{apt.serviceName}</span>
                        <span className="text-[#646464] text-[11px] font-mono">{apt.duration} mins</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#202020]">
                        {apt.stylistName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#202020] block">{apt.appointmentDate}</span>
                        <span className="text-[#646464] text-[11px] font-mono">
                          {apt.startTime} - {apt.endTime}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold font-display text-sm text-[#202020]">
                        ₹{(apt.finalPrice || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            apt.status === 'Completed'
                              ? 'success'
                              : apt.status === 'Cancelled'
                              ? 'danger'
                              : apt.status === 'In Progress'
                              ? 'blue'
                              : apt.status === 'Checked In'
                              ? 'blue'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {apt.status}
                        </Badge>
                      </td>
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status === 'Confirmed' && (
                            <button
                              onClick={() => handleStatusChange(apt._id, 'Checked In')}
                              className="px-2.5 py-1 rounded-full bg-[#B8E7FA]/40 hover:bg-[#7CCBEE] text-[#0E4A66] font-semibold text-[11px] transition-colors"
                            >
                              Check In
                            </button>
                          )}
                          {apt.status === 'Checked In' && (
                            <button
                              onClick={() => handleStatusChange(apt._id, 'In Progress')}
                              className="px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold text-[11px] transition-colors"
                            >
                              Start
                            </button>
                          )}
                          {apt.status === 'In Progress' && (
                            <button
                              onClick={() => handleStatusChange(apt._id, 'Completed')}
                              className="px-2.5 py-1 rounded-full bg-[#2B9A66]/20 hover:bg-[#2B9A66] hover:text-white text-[#2B9A66] font-semibold text-[11px] transition-colors"
                            >
                              Complete
                            </button>
                          )}
                          {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleStatusChange(apt._id, 'Cancelled')}
                              className="p-1 rounded-full text-red-500 hover:bg-red-50"
                              title="Cancel Appointment"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Calendar Schedule Grid */
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-[#202020]">
              Day Schedule Board
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.slice(0, 12).map((apt) => (
                <div
                  key={apt._id}
                  onClick={() => {
                    setSelectedAppointment(apt);
                    setDetailModalOpen(true);
                  }}
                  className="p-4 rounded-2xl border border-[#202020]/10 bg-white hover:border-[#42A9D8] transition-all cursor-pointer shadow-soft space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#42A9D8]">{apt.startTime}</span>
                    <Badge variant={apt.status === 'Completed' ? 'success' : 'blue'} size="sm">
                      {apt.status}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#202020]">{apt.customerName}</h4>
                    <p className="text-xs text-[#575757]">{apt.serviceName}</p>
                  </div>
                  <div className="pt-2 border-t border-[#202020]/10 flex items-center justify-between text-[11px] text-[#646464]">
                    <span>With {apt.stylistName}</span>
                    <span className="font-bold text-[#202020]">₹{apt.finalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Appointment Detail / Status Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedAppointment?.appointmentId || 'Appointment Details'}
        description="Review full booking records and adjust service progression status."
      >
        {selectedAppointment && (
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#F9F7F3] border border-[#202020]/10">
              <div>
                <span className="text-[#646464] block">Customer</span>
                <span className="font-bold text-[#202020] text-sm">{selectedAppointment.customerName}</span>
                <span className="font-mono text-[11px] text-[#646464] block">{selectedAppointment.customerPhone}</span>
              </div>
              <div>
                <span className="text-[#646464] block">Stylist</span>
                <span className="font-bold text-[#202020] text-sm">{selectedAppointment.stylistName}</span>
              </div>
              <div>
                <span className="text-[#646464] block">Service</span>
                <span className="font-bold text-[#202020]">{selectedAppointment.serviceName}</span>
                <span className="font-mono text-[11px] text-[#646464] block">{selectedAppointment.duration} mins</span>
              </div>
              <div>
                <span className="text-[#646464] block">Slot</span>
                <span className="font-bold text-[#202020]">
                  {selectedAppointment.appointmentDate} ({selectedAppointment.startTime} - {selectedAppointment.endTime})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#202020]/10">
              <span className="font-medium text-[#646464]">Final Amount Due</span>
              <span className="font-display font-bold text-lg text-[#202020]">
                ₹{(selectedAppointment.finalPrice || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#646464] block mb-2">
                Update Appointment Lifecycle:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  variant={selectedAppointment.status === 'Checked In' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange(selectedAppointment._id, 'Checked In')}
                >
                  Checked In
                </Button>
                <Button
                  variant={selectedAppointment.status === 'In Progress' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange(selectedAppointment._id, 'In Progress')}
                >
                  In Progress
                </Button>
                <Button
                  variant={selectedAppointment.status === 'Completed' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange(selectedAppointment._id, 'Completed')}
                >
                  Completed
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleStatusChange(selectedAppointment._id, 'Cancelled')}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* New Appointment Modal (Walk-in / Front Desk) */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Appointment"
        description="Book a walk-in guest or advance booking directly into MongoDB."
      >
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          {createError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">{createError}</div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] uppercase mb-1">
              Select Service *
            </label>
            <select
              value={formServiceId}
              onChange={(e) => setFormServiceId(e.target.value)}
              className="w-full min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-4 outline-none"
              required
            >
              <option value="">-- Choose Salon Service --</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} (₹{s.price} • {s.duration} mins)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] uppercase mb-1">
              Assign Stylist
            </label>
            <select
              value={formStylistId}
              onChange={(e) => setFormStylistId(e.target.value)}
              className="w-full min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-4 outline-none"
            >
              <option value="">Any Available Stylist</option>
              {staff.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.fullName} ({st.specialization})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date *"
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              required
            />
            <Input
              label="Start Time *"
              type="time"
              value={formTime}
              onChange={(e) => setFormTime(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Customer Name *"
              placeholder="e.g. Rhea Chakraborty"
              value={formCustomerName}
              onChange={(e) => setFormCustomerName(e.target.value)}
              required
            />
            <Input
              label="Customer Phone *"
              placeholder="e.g. +91 98201 33001"
              value={formCustomerPhone}
              onChange={(e) => setFormCustomerPhone(e.target.value)}
              required
            />
          </div>

          <Input
            label="Internal Notes"
            placeholder="Special styling notes, preferences"
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={createLoading}>
              Schedule Appointment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
