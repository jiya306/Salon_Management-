import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  Loader2,
} from 'lucide-react';
import { api } from '../../services/api/apiClient.js';
import { Service, Staff, Promotion } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { Button } from '../../components/ui/Button.js';
import { Card } from '../../components/ui/Card.js';
import { Input } from '../../components/ui/Input.js';
import { Badge } from '../../components/ui/Badge.js';

export const BookingWizardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Wizard Step (1 to 6)
  const [step, setStep] = useState<number>(1);

  // Data lists
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Staff[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Selected Booking State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Staff | 'any'>('any');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Tomorrow as default date
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);

  // Customer Form Details
  const [customerName, setCustomerName] = useState<string>(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState<string>(user?.email || '');
  const [notes, setNotes] = useState<string>('');

  // Promo Code
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState<string>('');
  const [validatingPromo, setValidatingPromo] = useState<boolean>(false);

  // Submission
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Fetch initial services & staff
  useEffect(() => {
    const load = async () => {
      try {
        const [servicesRes, staffRes] = await Promise.all([
          api.get('/services?activeOnly=true'),
          api.get('/staff?activeOnly=true'),
        ]);

        if (servicesRes.success) {
          setServices(servicesRes.data);

          // Check if serviceId was pre-passed in query
          const preServiceId = searchParams.get('serviceId');
          if (preServiceId) {
            const found = servicesRes.data.find((s: Service) => s._id === preServiceId);
            if (found) setSelectedService(found);
          }
        }

        if (staffRes.success) {
          setStylists(staffRes.data);

          // Check if stylistId was pre-passed
          const preStylistId = searchParams.get('stylistId');
          if (preStylistId) {
            const foundSt = staffRes.data.find((st: Staff) => st._id === preStylistId);
            if (foundSt) setSelectedStylist(foundSt);
          }
        }
      } catch (err) {
        console.error('Failed to load booking resources:', err);
      }
    };
    load();
  }, [searchParams]);

  // Load available time slots when date, stylist, or service changes
  useEffect(() => {
    if (!selectedService || !selectedDate) return;

    const loadSlots = async () => {
      try {
        setSlotsLoading(true);
        const stylistParam = selectedStylist === 'any' ? 'any' : selectedStylist._id;
        const res = await api.get('/appointments/availability', {
          date: selectedDate,
          stylistId: stylistParam,
          duration: selectedService.duration,
        });

        if (res.success && res.data?.slots) {
          setAvailableSlots(res.data.slots);
          // If previously selected time is not in available slots, clear it
          if (!res.data.slots.some((s: any) => s.time === selectedTime && s.available)) {
            setSelectedTime('');
          }
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
      } finally {
        setSlotsLoading(false);
      }
    };

    loadSlots();
  }, [selectedDate, selectedStylist, selectedService]);

  // Validate Promo Code
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      setPromoError('');
      setValidatingPromo(true);
      const subtotal = selectedService ? selectedService.price : 0;
      const res = await api.post('/promotions/validate', {
        code: promoCode.trim(),
        subtotal,
      });

      if (res.success && res.data) {
        setAppliedPromo(res.data);
      }
    } catch (err: any) {
      setPromoError(err.message || 'Invalid coupon code');
      setAppliedPromo(null);
    } finally {
      setValidatingPromo(false);
    }
  };

  // Final Confirmation Booking
  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerPhone) {
      setSubmitError('Please complete all required fields before confirming.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError('');

      const stylistId = selectedStylist === 'any' ? 'any' : selectedStylist._id;
      const discount = appliedPromo?.discountAmount || 0;

      const payload = {
        serviceId: selectedService._id,
        stylistId,
        appointmentDate: selectedDate,
        startTime: selectedTime,
        customerName,
        customerPhone,
        customerEmail,
        notes,
        discount,
        bookingSource: 'Online Wizard',
      };

      const res = await api.post('/appointments', payload);

      if (res.success && res.data) {
        navigate('/book/success', {
          state: {
            appointment: res.data,
            service: selectedService,
            stylist: selectedStylist === 'any' ? { fullName: res.data.stylistName } : selectedStylist,
          },
        });
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to confirm booking. Please try another slot.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['All', 'Hair', 'Beauty', 'Nails', 'Bridal', 'Spa'];
  const filteredServices =
    activeCategory === 'All'
      ? services
      : services.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  // Step names
  const steps = [
    'Service',
    'Stylist',
    'Date',
    'Time',
    'Details',
    'Confirm',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Wizard Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-xs font-semibold text-[#646464] hover:text-[#202020] flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="text-xs font-mono font-bold text-[#42A9D8]">
            Step {step} of 6: {steps[step - 1]}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {steps.map((label, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;
            return (
              <div key={label} className="flex flex-col gap-1.5">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#42A9D8]'
                      : isCurrent
                      ? 'bg-[#7CCBEE]'
                      : 'bg-[#F3F0E8] border border-[#202020]/10'
                  }`}
                />
                <span className={`text-[10px] hidden sm:block font-medium truncate ${isCurrent ? 'text-[#202020] font-bold' : 'text-[#646464]'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Container */}
      <Card className="p-6 sm:p-10 shadow-float border-[#202020]/10">
        <AnimatePresence mode="wait">
          {/* STEP 1: SELECT SERVICE */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <Badge variant="blue" size="sm" className="mb-2">Step 1</Badge>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
                  Select your treatment
                </h2>
                <p className="text-xs sm:text-sm text-[#575757] mt-1">
                  Choose the service you wish to experience today.
                </p>
              </div>

              {/* Category tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeCategory === c
                        ? 'bg-[#202020] text-white shadow-soft font-bold'
                        : 'bg-[#F3F0E8] text-[#575757] hover:bg-neutral-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Services List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
                {filteredServices.map((svc) => {
                  const isSelected = selectedService?._id === svc._id;
                  return (
                    <div
                      key={svc._id}
                      onClick={() => setSelectedService(svc)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3.5 ${
                        isSelected
                          ? 'border-[#42A9D8] bg-[#B8E7FA]/20 ring-2 ring-[#7CCBEE]/50 shadow-soft'
                          : 'border-[#202020]/10 bg-white hover:border-[#7CCBEE]/50'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                        <img src={svc.image} alt={svc.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-[#202020] truncate">{svc.name}</h4>
                          <span className="text-[10px] text-[#646464] font-mono flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-[#7CCBEE]" /> {svc.duration} mins
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-sm font-bold font-display text-[#202020]">
                            ₹{svc.price.toLocaleString('en-IN')}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#42A9D8] shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-[#202020]/10">
                <Button
                  variant="primary"
                  size="md"
                  disabled={!selectedService}
                  onClick={() => setStep(2)}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Stylist
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SELECT STYLIST */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <Badge variant="blue" size="sm" className="mb-2">Step 2</Badge>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
                  Choose your stylist
                </h2>
                <p className="text-xs sm:text-sm text-[#575757] mt-1">
                  Select a master artist or let us assign the first qualified stylist available.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Any Available Option */}
                <div
                  onClick={() => setSelectedStylist('any')}
                  className={`p-5 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    selectedStylist === 'any'
                      ? 'border-[#42A9D8] bg-[#B8E7FA]/20 ring-2 ring-[#7CCBEE]/50 shadow-soft'
                      : 'border-[#202020]/10 bg-white hover:border-[#7CCBEE]/50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-[#7CCBEE]/30 text-[#143644] flex items-center justify-center mb-3">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="font-display font-bold text-sm text-[#202020]">Any Available Stylist</h4>
                  <p className="text-[11px] text-[#646464] mt-1">Maximum booking flexibility & fastest slots</p>
                  {selectedStylist === 'any' && (
                    <Badge variant="blue" size="sm" className="mt-3">Selected</Badge>
                  )}
                </div>

                {/* Specific Stylists */}
                {stylists.map((st) => {
                  const isSelected = selectedStylist !== 'any' && selectedStylist._id === st._id;
                  return (
                    <div
                      key={st._id}
                      onClick={() => setSelectedStylist(st)}
                      className={`p-4 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-between ${
                        isSelected
                          ? 'border-[#42A9D8] bg-[#B8E7FA]/20 ring-2 ring-[#7CCBEE]/50 shadow-soft'
                          : 'border-[#202020]/10 bg-white hover:border-[#7CCBEE]/50'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden mb-2.5 border-2 border-[#7CCBEE] shadow-soft">
                        <img src={st.profileImage} alt={st.fullName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-xs text-[#202020]">{st.fullName}</h4>
                        <p className="text-[10px] text-[#42A9D8] font-semibold">{st.role}</p>
                        <p className="text-[10px] text-[#646464] line-clamp-1 mt-0.5">{st.specialization}</p>
                      </div>
                      <div className="text-[10px] font-mono text-[#202020] mt-2">
                        ★ {st.rating.toFixed(1)} ({st.reviewCount})
                      </div>
                      {isSelected && (
                        <Badge variant="blue" size="sm" className="mt-2">Selected</Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#202020]/10">
                <Button variant="outline" size="md" onClick={() => setStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button variant="primary" size="md" onClick={() => setStep(3)} icon={<ArrowRight className="w-4 h-4" />}>
                  Select Date
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SELECT DATE */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <Badge variant="blue" size="sm" className="mb-2">Step 3</Badge>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
                  Choose appointment date
                </h2>
                <p className="text-xs sm:text-sm text-[#575757] mt-1">
                  SalonFlow is open 7 days a week from 09:00 AM to 08:00 PM.
                </p>
              </div>

              {/* Quick Date Pills (Next 7 days) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                {[...Array(7)].map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() + i);
                  const dStr = d.toISOString().split('T')[0];
                  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = d.getDate();
                  const monthName = d.toLocaleDateString('en-US', { month: 'short' });
                  const isSelected = selectedDate === dStr;

                  return (
                    <button
                      key={dStr}
                      onClick={() => setSelectedDate(dStr)}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'border-[#42A9D8] bg-[#B8E7FA]/30 ring-2 ring-[#7CCBEE]/50 font-bold shadow-soft'
                          : 'border-[#202020]/10 bg-white hover:bg-[#F3F0E8]'
                      }`}
                    >
                      <span className="block text-[11px] text-[#646464] uppercase font-mono">{dayName}</span>
                      <span className="block text-xl font-bold font-display text-[#202020] my-0.5">{dayNum}</span>
                      <span className="block text-[10px] text-[#646464]">{monthName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Or custom date picker */}
              <div className="max-w-xs pt-2">
                <Input
                  type="date"
                  label="Or select specific date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#202020]/10">
                <Button variant="outline" size="md" onClick={() => setStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button variant="primary" size="md" onClick={() => setStep(4)} icon={<ArrowRight className="w-4 h-4" />}>
                  Choose Time Slot
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SELECT TIME SLOT */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <Badge variant="blue" size="sm" className="mb-2">Step 4</Badge>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
                  Select available time slot
                </h2>
                <p className="text-xs sm:text-sm text-[#575757] mt-1">
                  Availability for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {selectedStylist !== 'any' ? ` with ${selectedStylist.fullName}` : ' with Any Available Stylist'}
                </p>
              </div>

              {slotsLoading ? (
                <div className="py-16 text-center text-[#646464] space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#42A9D8]" />
                  <p className="text-xs">Checking real-time stylist calendars...</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="py-12 text-center text-[#646464] bg-[#F9F7F3] rounded-2xl border border-[#202020]/10">
                  <p className="text-xs">No time slots configured for this date.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-3 px-2 rounded-xl text-xs font-mono font-bold transition-all ${
                          !slot.available
                            ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-[#7CCBEE] text-[#143644] ring-2 ring-[#42A9D8] shadow-soft'
                            : 'bg-white text-[#202020] border border-[#202020]/10 hover:border-[#7CCBEE]'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs font-mono text-[#646464] pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-white border border-[#202020]/20" /> Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#7CCBEE]" /> Selected
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-neutral-200" /> Booked / Unavailable
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#202020]/10">
                <Button variant="outline" size="md" onClick={() => setStep(3)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  disabled={!selectedTime}
                  onClick={() => setStep(5)}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Enter Your Details
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: CUSTOMER DETAILS & COUPON */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <Badge variant="blue" size="sm" className="mb-2">Step 5</Badge>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
                  Your contact details
                </h2>
                <p className="text-xs sm:text-sm text-[#575757] mt-1">
                  We will send appointment updates and reminders to this mobile number.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Ananya Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                />
                <Input
                  label="Mobile Phone *"
                  placeholder="e.g. +91 98201 11006"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. ananya@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                />
                <Input
                  label="Special Notes or Requests"
                  placeholder="e.g. Sensitive scalp, preferred beverage"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Promo Code Application */}
              <div className="pt-4 border-t border-[#202020]/10">
                <label className="block text-xs font-semibold tracking-wide text-[#3A3A3A] uppercase mb-2">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2 max-w-md">
                  <Input
                    placeholder="e.g. FIRSTVISIT15"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    leftIcon={<Tag className="w-4 h-4" />}
                  />
                  <Button
                    variant="outline"
                    size="md"
                    isLoading={validatingPromo}
                    onClick={handleApplyPromo}
                  >
                    Apply
                  </Button>
                </div>
                {appliedPromo && (
                  <p className="text-xs text-[#2B9A66] font-semibold mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Coupon '{appliedPromo.code}' applied: ₹{appliedPromo.discountAmount} discount!
                  </p>
                )}
                {promoError && <p className="text-xs text-red-500 mt-2">{promoError}</p>}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#202020]/10">
                <Button variant="outline" size="md" onClick={() => setStep(4)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  disabled={!customerName.trim() || !customerPhone.trim()}
                  onClick={() => setStep(6)}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Review & Confirm
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: CONFIRMATION SUMMARY */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <Badge variant="blue" size="sm" className="mb-2">Step 6</Badge>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
                  Review your booking summary
                </h2>
                <p className="text-xs sm:text-sm text-[#575757] mt-1">
                  Please verify the details below before placing your reservation.
                </p>
              </div>

              {submitError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {submitError}
                </div>
              )}

              {/* Summary Box */}
              <div className="rounded-2xl bg-[#F9F7F3] border border-[#202020]/10 p-6 space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-[#202020]/10">
                  <div>
                    <span className="text-[10px] text-[#646464] uppercase font-mono">Service</span>
                    <h3 className="font-display font-bold text-base text-[#202020] mt-0.5">
                      {selectedService?.name}
                    </h3>
                    <span className="text-xs text-[#646464] font-mono">
                      {selectedService?.duration} minutes
                    </span>
                  </div>
                  <span className="font-display font-bold text-lg text-[#202020]">
                    ₹{selectedService?.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs py-2 border-b border-[#202020]/10">
                  <div>
                    <span className="text-[#646464] block">Stylist</span>
                    <span className="font-semibold text-[#202020] text-sm">
                      {selectedStylist === 'any' ? 'Any Available Stylist' : selectedStylist.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#646464] block">Date & Time</span>
                    <span className="font-semibold text-[#202020] text-sm">
                      {selectedDate} at {selectedTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#646464] block">Guest Name</span>
                    <span className="font-semibold text-[#202020]">{customerName}</span>
                  </div>
                  <div>
                    <span className="text-[#646464] block">Contact Phone</span>
                    <span className="font-semibold text-[#202020]">{customerPhone}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1.5 pt-2 text-xs">
                  <div className="flex justify-between text-[#646464]">
                    <span>Subtotal</span>
                    <span>₹{selectedService?.price.toLocaleString('en-IN')}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-[#2B9A66] font-semibold">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>- ₹{appliedPromo.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold font-display text-[#202020] pt-2 border-t border-[#202020]/10">
                    <span>Total Amount Payable at Salon</span>
                    <span>
                      ₹
                      {Math.max(
                        0,
                        (selectedService?.price || 0) - (appliedPromo?.discountAmount || 0)
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#646464]">
                <ShieldCheck className="w-4 h-4 text-[#2B9A66]" />
                <span>Zero cancellation fee up to 4 hours before your slot. Pay at salon via Cash, UPI, or Card.</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#202020]/10">
                <Button variant="outline" size="md" onClick={() => setStep(5)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  isLoading={submitting}
                  onClick={handleConfirmBooking}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                >
                  Confirm Appointment
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};
