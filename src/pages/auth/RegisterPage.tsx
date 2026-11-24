import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Card } from '../../components/ui/Card.js';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register({ name, email, password, phone, role });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
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
            Create an Account
          </h1>
          <p className="text-xs text-[#646464]">
            Join SalonFlow for personalized bookings, loyalty points, and exclusive privileges.
          </p>
        </div>

        <Card className="p-8 shadow-float border-[#202020]/10 bg-white">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Ananya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="ananya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Phone Number"
              placeholder="+91 98200 12345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <Input
              label="Password (min. 6 characters)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div>
              <label className="block text-xs font-semibold tracking-wide text-[#3A3A3A] uppercase mb-1.5">
                Registering As
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full min-h-[44px] rounded-full bg-white text-sm text-[#202020] border border-[#202020]/15 px-4 outline-none focus:border-[#42A9D8] focus:ring-2 focus:ring-[#7CCBEE]/30"
              >
                <option value="CUSTOMER">Customer / Guest</option>
                <option value="STYLIST">Stylist / Artist</option>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="SALON_OWNER">Salon Owner</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={loading}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Complete Registration
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[#202020]/10 text-center">
            <p className="text-xs text-[#646464]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#42A9D8] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
