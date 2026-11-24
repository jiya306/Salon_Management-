import React, { useState, useEffect } from 'react';
import { Tag, Plus, CheckCircle2, Clock, Trash2, Copy, Check } from 'lucide-react';
import { api } from '../../services/api/apiClient.js';
import { Promotion } from '../../types/index.js';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Badge } from '../../components/ui/Badge.js';
import { Modal } from '../../components/ui/Modal.js';

export const PromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('15');
  const [minPurchase, setMinPurchase] = useState('1000');
  const [maxDiscount, setMaxDiscount] = useState('1000');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('2027-12-31');
  const [usageLimit, setUsageLimit] = useState('200');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/promotions');
      if (res.success && res.data) {
        setPromotions(res.data);
      }
    } catch (err) {
      console.error('Failed to load promotions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !title || !discountValue) {
      setFormError('Please enter code, title, and discount value.');
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');

      await api.post('/promotions', {
        code: code.toUpperCase().trim(),
        title,
        description,
        discountType,
        discountValue: Number(discountValue),
        minPurchase: Number(minPurchase),
        maxDiscount: Number(maxDiscount),
        startDate,
        endDate,
        usageLimit: Number(usageLimit),
      });

      setModalOpen(false);
      fetchPromotions();
      setCode('');
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to create coupon');
    } finally {
      setFormLoading(false);
    }
  };

  const copyCoupon = (c: string) => {
    navigator.clipboard.writeText(c);
    setCopiedCode(c);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleStatus = async (promo: Promotion) => {
    try {
      await api.put(`/promotions/${promo._id}`, { isActive: !promo.isActive });
      fetchPromotions();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
            Promotions & Coupons
          </h1>
          <p className="text-xs text-[#646464] mt-1 font-mono">
            {promotions.length} promotional codes configured
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Create Promo Code
        </Button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <Card
            key={promo._id}
            className="p-6 border-dashed border-2 border-[#7CCBEE]/60 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant={promo.isActive ? 'blue' : 'neutral'} size="sm">
                  {promo.discountType === 'PERCENTAGE'
                    ? `${promo.discountValue}% OFF`
                    : `₹${promo.discountValue} FLAT`}
                </Badge>
                <span className="text-[10px] text-[#646464] font-mono">
                  Used: {promo.usedCount}/{promo.usageLimit}
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-[#202020] mb-1">
                {promo.title}
              </h3>
              <p className="text-xs text-[#575757] leading-relaxed mb-4">
                {promo.description}
              </p>

              <div className="space-y-1 text-[11px] text-[#646464] font-mono mb-4">
                <p>Min Order: ₹{promo.minPurchase}</p>
                {promo.maxDiscount > 0 && <p>Max Discount: ₹{promo.maxDiscount}</p>}
                <p>Valid Till: {promo.endDate}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#202020]/10 flex items-center justify-between">
              <button
                onClick={() => copyCoupon(promo.code)}
                className="font-mono font-bold text-xs bg-[#F9F7F3] hover:bg-[#B8E7FA]/30 px-3 py-1.5 rounded-lg border border-[#202020]/15 flex items-center gap-1.5 transition-colors"
              >
                {copiedCode === promo.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2B9A66]" />
                    <span className="text-[#2B9A66]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#42A9D8]" />
                    <span>{promo.code}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleStatus(promo)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  promo.isActive ? 'bg-[#2B9A66]/15 text-[#2B9A66]' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {promo.isActive ? 'Active' : 'Paused'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Coupon Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Coupon Campaign"
        description="Configure discount rules, order minimums, and usage limits."
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
          {formError && <div className="p-3 bg-red-50 text-red-600 rounded-xl">{formError}</div>}

          <Input
            label="Promo Code (Uppercase) *"
            placeholder="e.g. FESTIVE20"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />

          <Input
            label="Offer Title *"
            placeholder="e.g. Festive Makeover Celebration"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Description *"
            placeholder="e.g. 20% off all hair and beauty rituals above ₹2,000"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] uppercase mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-3 outline-none"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹ INR)</option>
              </select>
            </div>
            <Input
              label="Discount Value *"
              type="number"
              placeholder="15"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Min Order (₹)"
              type="number"
              value={minPurchase}
              onChange={(e) => setMinPurchase(e.target.value)}
            />
            <Input
              label="Max Cap (₹, 0 for none)"
              type="number"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <Input
            label="Total Usage Limit"
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={formLoading}>
              Save Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
