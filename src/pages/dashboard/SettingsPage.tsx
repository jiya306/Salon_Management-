import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Clock, Percent } from 'lucide-react';
import { api } from '../../services/api/apiClient.js';
import { SalonSettings } from '../../types/index.js';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Badge } from '../../components/ui/Badge.js';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SalonSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [salonName, setSalonName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [openHours, setOpenHours] = useState('09:00');
  const [closeHours, setCloseHours] = useState('20:00');
  const [durationStep, setDurationStep] = useState('30');
  const [bufferTime, setBufferTime] = useState('15');
  const [cancelHours, setCancelHours] = useState('4');
  const [taxRate, setTaxRate] = useState('18');
  const [loyaltyEarnRate, setLoyaltyEarnRate] = useState('1');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/settings');
        if (res.success && res.data) {
          const s = res.data;
          setSettings(s);
          setSalonName(s.salonName || '');
          setTagline(s.tagline || '');
          setPhone(s.phone || '');
          setEmail(s.email || '');
          setAddress(s.address || '');
          setOpenHours(s.openingHours || '09:00');
          setCloseHours(s.closingHours || '20:00');
          setDurationStep(String(s.durationStepMinutes || 30));
          setBufferTime(String(s.bufferTimeMinutes || 15));
          setCancelHours(String(s.cancelWindowHours || 4));
          setTaxRate(String(s.taxRatePercent || 18));
          setLoyaltyEarnRate(String(s.loyaltyEarnRate || 1));
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg('');
      const res = await api.put('/settings', {
        salonName,
        tagline,
        phone,
        email,
        address,
        openingHours: openHours,
        closingHours: closeHours,
        durationStepMinutes: Number(durationStep),
        bufferTimeMinutes: Number(bufferTime),
        cancelWindowHours: Number(cancelHours),
        taxRatePercent: Number(taxRate),
        loyaltyEarnRate: Number(loyaltyEarnRate),
      });

      if (res.success) {
        setSuccessMsg('Salon configurations successfully saved in MongoDB!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
            Salon Configuration & Settings
          </h1>
          <p className="text-xs text-[#646464] mt-1 font-mono">
            Operating parameters, tax schedules & booking policies
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          isLoading={saving}
          icon={<Save className="w-4 h-4" />}
        >
          Save Changes
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#B8E7FA]/30 border border-[#7CCBEE] text-xs font-bold text-[#0E4A66] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#42A9D8]" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Salon Profile */}
        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-[#202020] pb-2 border-b border-[#202020]/10">
            Salon Identity & Contact Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Salon Brand Name"
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}
            />
            <Input
              label="Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
            <Input
              label="Concierge Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Official Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Input
            label="Studio Physical Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Card>

        {/* Operating Hours & Scheduling */}
        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-[#202020] pb-2 border-b border-[#202020]/10">
            Operating Hours & Booking Buffer Rules
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input
              label="Opening Time"
              type="time"
              value={openHours}
              onChange={(e) => setOpenHours(e.target.value)}
            />
            <Input
              label="Closing Time"
              type="time"
              value={closeHours}
              onChange={(e) => setCloseHours(e.target.value)}
            />
            <Input
              label="Slot Interval (Mins)"
              type="number"
              value={durationStep}
              onChange={(e) => setDurationStep(e.target.value)}
            />
            <Input
              label="Buffer Time (Mins)"
              type="number"
              value={bufferTime}
              onChange={(e) => setBufferTime(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Input
              label="Cancellation Window (Hours Before Appointment)"
              type="number"
              value={cancelHours}
              onChange={(e) => setCancelHours(e.target.value)}
              helperText="Guests can reschedule or cancel with zero penalty within this window."
            />
          </div>
        </Card>

        {/* Tax & Loyalty Configuration */}
        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-[#202020] pb-2 border-b border-[#202020]/10">
            GST Tax & Loyalty Program Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Applicable GST Tax Rate (%)"
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              helperText="Standard Indian Salon Goods & Service Tax rate (Default: 18%)."
            />
            <Input
              label="Points Earned per ₹100 Spent"
              type="number"
              value={loyaltyEarnRate}
              onChange={(e) => setLoyaltyEarnRate(e.target.value)}
              helperText="Number of loyalty reward points credited per ₹100 spent on services."
            />
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={saving}
            icon={<Save className="w-5 h-5" />}
          >
            Save All Configurations
          </Button>
        </div>
      </form>
    </div>
  );
};
