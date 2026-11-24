import React, { useState, useEffect } from 'react';
import {
  Scissors,
  Star,
  Plus,
  Phone,
  Mail,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Edit,
  Trash2,
} from 'lucide-react';
import { api } from '../../services/api/apiClient.js';
import { Staff } from '../../types/index.js';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Badge } from '../../components/ui/Badge.js';
import { Modal } from '../../components/ui/Modal.js';

export const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [perfModalOpen, setPerfModalOpen] = useState(false);
  const [selectedStaffPerf, setSelectedStaffPerf] = useState<any>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState('Master Stylist');
  const [formSpecialization, setFormSpecialization] = useState('Hair Styling & Balayage');
  const [formExp, setFormExp] = useState('5');
  const [formSalary, setFormSalary] = useState('55000');
  const [formCommission, setFormCommission] = useState('10');
  const [formImage, setFormImage] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/staff');
      if (res.success && res.data) {
        setStaff(res.data);
      }
    } catch (err) {
      console.error('Failed to load staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openPerformance = async (st: Staff) => {
    try {
      const res = await api.get(`/staff/${st._id}/performance`);
      if (res.success && res.data) {
        setSelectedStaffPerf(res.data);
        setPerfModalOpen(true);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to fetch performance');
    }
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPhone) {
      setFormError('Please enter all required staff fields.');
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');

      const payload = {
        fullName: formName,
        email: formEmail,
        phone: formPhone,
        role: formRole,
        specialization: formSpecialization,
        experience: Number(formExp),
        salary: Number(formSalary),
        commission: Number(formCommission),
        profileImage:
          formImage ||
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      };

      if (editStaff) {
        await api.put(`/staff/${editStaff._id}`, payload);
      } else {
        await api.post('/staff', payload);
      }

      setAddModalOpen(false);
      setEditStaff(null);
      fetchStaff();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (st: Staff) => {
    setEditStaff(st);
    setFormName(st.fullName);
    setFormEmail(st.email);
    setFormPhone(st.phone);
    setFormRole(st.role);
    setFormSpecialization(st.specialization);
    setFormExp(String(st.experience));
    setFormSalary(String(st.salary));
    setFormCommission(String(st.commission));
    setFormImage(st.profileImage);
    setAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
            Staff & Artists Directory
          </h1>
          <p className="text-xs text-[#646464] mt-1 font-mono">
            {staff.length} certified artists and stylists on roster
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditStaff(null);
            setFormName('');
            setFormEmail('');
            setFormPhone('');
            setFormImage('');
            setAddModalOpen(true);
          }}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Stylist
        </Button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {staff.map((st) => (
          <Card key={st._id} className="p-5 flex flex-col justify-between hover:border-[#7CCBEE]/50 transition-all">
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#7CCBEE] shadow-soft shrink-0 bg-neutral-100">
                  <img src={st.profileImage} alt={st.fullName} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#646464]">{st.employeeId}</span>
                    <button
                      onClick={() => openEditModal(st)}
                      className="p-1 text-[#646464] hover:text-[#202020] rounded-full hover:bg-[#F3F0E8]"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-display font-bold text-sm text-[#202020] truncate">
                    {st.fullName}
                  </h3>
                  <span className="text-xs font-semibold text-[#42A9D8] block">
                    {st.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs py-3 border-y border-[#202020]/10">
                <div className="flex justify-between">
                  <span className="text-[#646464]">Specialization:</span>
                  <span className="font-medium text-[#202020] text-right truncate max-w-[130px]" title={st.specialization}>
                    {st.specialization}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#646464]">Experience:</span>
                  <span className="font-mono text-[#202020]">{st.experience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#646464]">Rating:</span>
                  <span className="font-mono font-bold text-[#202020] flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {st.rating.toFixed(1)} ({st.reviewCount})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#646464]">Salary / Mo:</span>
                  <span className="font-mono font-bold text-[#202020]">
                    ₹{st.salary.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#646464]">Commission:</span>
                  <span className="font-mono font-bold text-[#2B9A66]">
                    {st.commission}%
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => openPerformance(st)}
              >
                Performance Report →
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Modal */}
      <Modal
        isOpen={perfModalOpen}
        onClose={() => setPerfModalOpen(false)}
        title={`${selectedStaffPerf?.staff?.fullName} — Performance Matrix`}
        description="Live commission calculations and service delivery statistics."
      >
        {selectedStaffPerf && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#F9F7F3] border border-[#202020]/10">
                <span className="text-[#646464] block">Completed Bookings</span>
                <span className="font-display font-bold text-xl text-[#202020] block mt-0.5">
                  {selectedStaffPerf.completedAppointments}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F9F7F3] border border-[#202020]/10">
                <span className="text-[#646464] block">Client Rating</span>
                <span className="font-display font-bold text-xl text-[#202020] block mt-0.5">
                  ★ {selectedStaffPerf.rating} ({selectedStaffPerf.reviewCount})
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F9F7F3] border border-[#202020]/10">
                <span className="text-[#646464] block">Revenue Generated</span>
                <span className="font-display font-bold text-xl text-[#42A9D8] block mt-0.5">
                  ₹{(selectedStaffPerf.totalRevenue || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F9F7F3] border border-[#202020]/10">
                <span className="text-[#646464] block">Commission Earned</span>
                <span className="font-display font-bold text-xl text-[#2B9A66] block mt-0.5">
                  ₹{(selectedStaffPerf.commissionEarned || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={editStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        description="Maintain employee profile, salary, and commission rate."
      >
        <form onSubmit={handleSaveStaff} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">{formError}</div>
          )}

          <Input
            label="Full Name *"
            placeholder="e.g. Kavya Kapoor"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email Address *"
              type="email"
              placeholder="kavya@salonflow.demo"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number *"
              placeholder="+91 98201 11005"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] uppercase mb-1">
                Role Title
              </label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-3 outline-none"
              >
                <option value="Master Stylist">Master Stylist</option>
                <option value="Senior Stylist">Senior Stylist</option>
                <option value="Color Specialist">Color Specialist</option>
                <option value="Bridal Artist">Bridal Artist</option>
                <option value="Nail Artist">Nail Artist</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>

            <Input
              label="Specialization"
              placeholder="e.g. Balayage & Keratin"
              value={formSpecialization}
              onChange={(e) => setFormSpecialization(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Exp (Yrs)"
              type="number"
              value={formExp}
              onChange={(e) => setFormExp(e.target.value)}
            />
            <Input
              label="Salary (₹)"
              type="number"
              value={formSalary}
              onChange={(e) => setFormSalary(e.target.value)}
            />
            <Input
              label="Comm (%)"
              type="number"
              value={formCommission}
              onChange={(e) => setFormCommission(e.target.value)}
            />
          </div>

          <Input
            label="Profile Image URL"
            placeholder="https://images.unsplash.com/..."
            value={formImage}
            onChange={(e) => setFormImage(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={formLoading}>
              Save Artist
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
