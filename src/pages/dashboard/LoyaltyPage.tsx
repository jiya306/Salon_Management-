import React, { useState, useEffect } from 'react';
import { Award, Sparkles, Gift, CheckCircle2, Users, IndianRupee } from 'lucide-react';
import { api } from '../../services/api/apiClient.js';
import { Customer } from '../../types/index.js';
import { Card } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';

export const LoyaltyPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Redemption Simulator
  const [calcPoints, setCalcPoints] = useState('250');

  useEffect(() => {
    const fetchLoyalGuests = async () => {
      try {
        setLoading(true);
        const res = await api.get('/customers?sort=-loyaltyPoints');
        if (res.success && res.data) {
          setCustomers(res.data);
        }
      } catch (err) {
        console.error('Failed to load loyalty:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoyalGuests();
  }, []);

  const tiersConfig = [
    { name: 'Bronze', spend: '₹0 – ₹9,999', perks: '1 Pt per ₹100, Birthday Welcome treat' },
    { name: 'Silver', spend: '₹10,000 – ₹24,999', perks: 'Complimentary hair spa add-on on visits' },
    { name: 'Gold', spend: '₹25,000 – ₹49,999', perks: 'Priority slot booking, 10% privilege discount' },
    { name: 'Platinum', spend: '₹50,000+', perks: 'Dedicated master stylist, VIP beverage service' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
            Loyalty & VIP Privileges
          </h1>
          <p className="text-xs text-[#646464] mt-1 font-mono">
            Tier progression rules, customer rewards & point redemption
          </p>
        </div>
      </div>

      {/* Tier Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiersConfig.map((t, idx) => (
          <Card key={t.name} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold text-base text-[#202020]">{t.name}</span>
                <Award className={`w-4 h-4 ${idx === 3 ? 'text-purple-600' : 'text-[#42A9D8]'}`} />
              </div>
              <p className="text-xs font-mono font-bold text-[#42A9D8] mb-2">{t.spend}</p>
              <p className="text-xs text-[#575757] leading-relaxed">{t.perks}</p>
            </div>
            <div className="pt-4 border-t border-[#202020]/10 mt-4 text-[10px] text-[#646464] font-mono">
              Active Tier Policy
            </div>
          </Card>
        ))}
      </div>

      {/* Two Column: Simulator & Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Point Calculator & Rules */}
        <Card className="lg:col-span-5 p-6 space-y-5">
          <div>
            <h3 className="font-display font-bold text-base text-[#202020]">
              Loyalty Rule Engine
            </h3>
            <p className="text-xs text-[#646464]">Configured SalonFlow earn & burn algorithm</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F9F7F3] border border-[#202020]/10 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#646464]">Earning Formula:</span>
              <span className="font-mono font-bold text-[#202020]">₹100 spent = 1 Point</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#646464]">Redemption Value:</span>
              <span className="font-mono font-bold text-[#2B9A66]">1 Point = ₹1.00 Discount</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#646464]">Registration Bonus:</span>
              <span className="font-mono font-bold text-[#42A9D8]">50 Welcome Points</span>
            </div>
          </div>

          {/* Calculator */}
          <div className="pt-2 space-y-3">
            <label className="block text-xs font-bold text-[#202020] uppercase font-mono">
              Redemption Calculator
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={calcPoints}
                onChange={(e) => setCalcPoints(e.target.value)}
                placeholder="250"
                className="text-sm font-mono"
              />
              <div className="shrink-0 p-3 rounded-2xl bg-[#B8E7FA]/40 border border-[#7CCBEE] text-center min-w-[120px]">
                <span className="text-[10px] text-[#646464] uppercase font-mono block">Discount</span>
                <span className="font-display font-bold text-lg text-[#0E4A66]">
                  ₹{Number(calcPoints || 0)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Loyalty Guests */}
        <Card className="lg:col-span-7 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-[#202020]">
              Top VIP Guests by Loyalty Points
            </h3>
            <span className="text-xs text-[#646464] font-mono">Live Ranks</span>
          </div>

          <div className="divide-y divide-[#202020]/5 text-xs">
            {customers.slice(0, 8).map((c, i) => (
              <div key={c._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#F3F0E8] font-mono font-bold text-[#646464] flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-bold text-[#202020] block">{c.fullName}</span>
                    <span className="text-[#646464] text-[11px] font-mono">{c.phone}</span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4">
                  <Badge variant={c.loyaltyTier === 'Platinum' ? 'purple' : 'blue'} size="sm">
                    {c.loyaltyTier}
                  </Badge>
                  <span className="font-mono font-bold text-[#0E4A66] text-sm">
                    {c.loyaltyPoints} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
