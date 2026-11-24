import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Card } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@salonflow.demo', pass: 'Admin@123', desc: 'Full System & Analytics Control' },
    { role: 'Salon Owner', email: 'owner@salonflow.demo', pass: 'Owner@123', desc: 'Financials, Staff & Operations' },
    { role: 'Receptionist', email: 'reception@salonflow.demo', pass: 'Reception@123', desc: 'Front Desk & Appointments' },
    { role: 'Stylist', email: 'stylist@salonflow.demo', pass: 'Stylist@123', desc: 'Kavya Kapoor (Master Stylist)' },
    { role: 'Customer', email: 'customer@salonflow.demo', pass: 'Customer@123', desc: 'Ananya Sharma (Loyal Guest)' },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-full bg-[#7CCBEE] flex items-center justify-center text-[#143644] group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-[#143644]" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-[#202020]">
              Salon<span className="text-[#42A9D8]">Flow</span>
            </span>
          </Link>
          <h1 className="font-display font-extrabold text-3xl text-[#202020] tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs text-[#646464]">
            Sign in to access your salon management portal or personal bookings.
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 shadow-float border-[#202020]/10 bg-white">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@salonflow.demo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={loading}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[#202020]/10 text-center">
            <p className="text-xs text-[#646464]">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[#42A9D8] hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Accounts Panel */}
        <div className="rounded-2xl border border-[#7CCBEE]/40 bg-[#B8E7FA]/20 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0E4A66] flex items-center gap-1.5 uppercase font-mono">
              <ShieldCheck className="w-4 h-4 text-[#42A9D8]" /> 1-Click Demo Logins
            </span>
            <Badge variant="blue" size="sm">Pre-Seeded</Badge>
          </div>
          <p className="text-[11px] text-[#575757] leading-relaxed">
            Click any account to automatically fill credentials and test role permissions:
          </p>

          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {demoAccounts.map((d) => (
              <button
                key={d.role}
                type="button"
                onClick={() => fillDemo(d.email, d.pass)}
                className="w-full text-left p-2.5 rounded-xl bg-white/90 hover:bg-white border border-[#202020]/10 hover:border-[#42A9D8] transition-all flex items-center justify-between group text-xs"
              >
                <div>
                  <span className="font-bold text-[#202020] block group-hover:text-[#42A9D8] transition-colors">
                    {d.role}
                  </span>
                  <span className="text-[10px] text-[#646464] font-mono">{d.email}</span>
                </div>
                <span className="text-[10px] font-mono font-medium text-[#646464] group-hover:text-[#202020]">
                  Click to fill →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
