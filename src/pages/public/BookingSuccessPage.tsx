import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Calendar, Clock, User, Scissors, ArrowRight, Home } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Card } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';

export const BookingSuccessPage: React.FC = () => {
  const location = useLocation();
  const state = location.state || {};
  const appointment = state.appointment;
  const service = state.service;
  const stylist = state.stylist;

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7CCBEE', '#42A9D8', '#B8E7FA', '#2B9A66'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[#B8E7FA] text-[#0E4A66] mx-auto flex items-center justify-center mb-6 shadow-soft">
        <CheckCircle2 className="w-8 h-8 text-[#42A9D8]" />
      </div>

      <Badge variant="blue" size="md" className="mb-3">
        Reservation Confirmed
      </Badge>

      <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#202020] mb-2">
        Your Appointment is Booked!
      </h1>
      <p className="text-sm text-[#575757] max-w-md mx-auto mb-8">
        We have reserved your slot at SalonFlow. A confirmation SMS has been queued for your mobile number.
      </p>

      {appointment && (
        <Card className="text-left p-6 mb-8 border-[#202020]/10 bg-white shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-[#202020]/10">
            <div>
              <span className="text-[10px] text-[#646464] font-mono uppercase">Appointment ID</span>
              <p className="font-mono font-bold text-base text-[#202020]">{appointment.appointmentId}</p>
            </div>
            <Badge variant="success" size="sm">Confirmed</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-b border-[#202020]/10 text-xs">
            <div>
              <span className="text-[#646464] block">Service</span>
              <span className="font-bold text-[#202020] text-sm">{appointment.serviceName}</span>
              <span className="text-[#646464] font-mono block">{appointment.duration} mins</span>
            </div>
            <div>
              <span className="text-[#646464] block">Stylist</span>
              <span className="font-bold text-[#202020] text-sm">{appointment.stylistName}</span>
            </div>
            <div>
              <span className="text-[#646464] block">Date</span>
              <span className="font-bold text-[#202020]">{appointment.appointmentDate}</span>
            </div>
            <div>
              <span className="text-[#646464] block">Time Window</span>
              <span className="font-bold text-[#202020]">{appointment.startTime} – {appointment.endTime}</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs text-[#646464]">Total Payable Amount</span>
            <span className="font-display font-bold text-xl text-[#202020]">
              ₹{(appointment.finalPrice || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/">
          <Button variant="outline" size="md" icon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
        <Link to="/dashboard/appointments">
          <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
            View in Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
