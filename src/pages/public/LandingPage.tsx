import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  HeartHandshake,
  Tag,
  Copy,
  Check,
} from 'lucide-react';
import { api } from '../../services/api/apiClient.js';
import { Service, Staff, Promotion, Review } from '../../types/index.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { Card } from '../../components/ui/Card.js';

export const LandingPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial backend data
    const fetchData = async () => {
      try {
        const [servicesRes, staffRes, promoRes, reviewsRes] = await Promise.all([
          api.get('/services'),
          api.get('/staff'),
          api.get('/promotions'),
          api.get('/reviews?limit=6'),
        ]);

        if (servicesRes.success) setServices(servicesRes.data);
        if (staffRes.success) setStaff(staffRes.data);
        if (promoRes.success) setPromotions(promoRes.data);
        if (reviewsRes.success) setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Failed to load landing page data:', err);
      }
    };
    fetchData();
  }, []);

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const categories = ['All', 'Hair', 'Beauty', 'Nails', 'Bridal', 'Spa'];
  const filteredServices =
    activeCategory === 'All'
      ? services
      : services.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 sm:space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B8E7FA]/50 border border-[#7CCBEE]/50 text-xs font-semibold text-[#0E4A66] tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#42A9D8]" />
                Mumbai's Premier Luxury Sanctuary
              </div>

              <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-[#202020]">
                Your Beauty. <br />
                <span className="text-[#42A9D8]">Your Time.</span> <br />
                Your Salon.
              </h1>

              <p className="text-base sm:text-lg text-[#575757] max-w-xl leading-relaxed">
                Discover bespoke hair, skin, and bridal aesthetics designed around you.
                Book your favorite stylist in seconds, explore verified reviews, and experience personalized care.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/book">
                  <Button variant="primary" size="lg" icon={<Calendar className="w-5 h-5" />}>
                    Book Your Appointment
                  </Button>
                </Link>
                <a href="#services">
                  <Button variant="outline" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                    Explore Services
                  </Button>
                </a>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#202020]/10 max-w-md">
                <div>
                  <p className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">4.9★</p>
                  <p className="text-xs text-[#646464] mt-0.5">Over 1,200+ Reviews</p>
                </div>
                <div>
                  <p className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">8+</p>
                  <p className="text-xs text-[#646464] mt-0.5">Master Artists</p>
                </div>
                <div>
                  <p className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">100%</p>
                  <p className="text-xs text-[#646464] mt-0.5">Cruelty-Free Products</p>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visuals */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Large Editorial Image */}
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-float border border-[#202020]/10 bg-neutral-100">
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
                    alt="SalonFlow Luxury Interior"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Accent Card */}
                <div className="absolute -bottom-6 -left-6 sm:-left-8 bg-white p-4 rounded-2xl shadow-float border border-[#202020]/10 flex items-center gap-3.5 max-w-xs">
                  <div className="w-12 h-12 rounded-xl bg-[#7CCBEE] flex items-center justify-center text-[#143644] shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#202020]">Real-Time Scheduling</p>
                    <p className="text-[11px] text-[#646464]">Direct calendar sync with stylist availability</p>
                  </div>
                </div>

                {/* Stylist Mini Badge */}
                <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-xs py-2 px-4 rounded-full shadow-float border border-[#202020]/10 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2B9A66] animate-pulse" />
                  <span className="text-xs font-semibold text-[#202020]">8 Stylists Active Today</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section id="services" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Badge variant="blue" size="sm" className="mb-2">Curated Menu</Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#202020]">
              Services made for you.
            </h2>
            <p className="text-sm text-[#575757] mt-1.5 max-w-lg">
              Explore our comprehensive range of hair transformations, luxury facials, nail artistry, and bridal rituals.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-[#F3F0E8] p-1.5 rounded-full border border-[#202020]/10 self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-white text-[#202020] shadow-soft font-bold'
                    : 'text-[#646464] hover:text-[#202020]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <Card
              key={service._id}
              className="group p-0 overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="aspect-[16/10] overflow-hidden bg-neutral-100 relative">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="neutral" size="sm" className="backdrop-blur-md bg-white/90">
                    {service.category}
                  </Badge>
                  {service.popularStatus && (
                    <Badge variant="blue" size="sm">Popular</Badge>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 bg-[#202020]/80 backdrop-blur-md text-white text-xs font-mono px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#7CCBEE]" />
                  {service.duration} mins
                </div>
              </div>

              {/* Service Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-lg text-[#202020] group-hover:text-[#42A9D8] transition-colors">
                      {service.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#575757] line-clamp-2 leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#202020]/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#646464] uppercase font-mono block">Price</span>
                    <span className="font-display font-bold text-xl text-[#202020]">
                      ₹{service.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link to={`/book?serviceId=${service._id}`}>
                    <Button variant="primary" size="sm">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. STYLISTS SECTION */}
      <section id="stylists" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="blue" size="sm" className="mb-2">Our Artists</Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#202020]">
            Meet the artists behind your look.
          </h2>
          <p className="text-sm text-[#575757] mt-2">
            Each stylist brings certified international training, years of hands-on expertise, and a passion for craft.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {staff.slice(0, 8).map((st) => (
            <Card key={st._id} className="p-5 flex flex-col text-center items-center hover:border-[#7CCBEE]/50 transition-colors">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#7CCBEE] shadow-soft mb-4 bg-neutral-100">
                <img src={st.profileImage} alt={st.fullName} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-display font-bold text-base text-[#202020]">{st.fullName}</h3>
              <p className="text-xs font-semibold text-[#42A9D8] mt-0.5">{st.role}</p>
              <p className="text-[11px] text-[#646464] mt-1">{st.specialization}</p>

              <div className="flex items-center gap-3 my-4 text-xs font-mono bg-[#F9F7F3] px-3 py-1.5 rounded-full border border-[#202020]/10">
                <span className="flex items-center gap-1 font-bold text-[#202020]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {st.rating.toFixed(1)}
                </span>
                <span className="text-[#646464]">({st.reviewCount} reviews)</span>
                <span className="text-[#202020]">{st.experience} yrs exp</span>
              </div>

              <Link to={`/book?stylistId=${st._id}`} className="w-full mt-auto">
                <Button variant="outline" size="sm" className="w-full">
                  Book with {st.fullName.split(' ')[0]}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. SALON EXPERIENCE */}
      <section id="experience" className="bg-[#202020] text-white py-20 sm:py-28 my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <Badge variant="blue" size="sm">The SalonFlow Philosophy</Badge>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-white leading-tight">
                More than a salon. <br />
                It's your moment.
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                We believe salon visits should never feel rushed or chaotic. Step into a thoughtfully curated haven of serene minimalism, soothing acoustic tones, and personalized consultation rituals.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#7CCBEE] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Hospital-Grade Sterilization</h4>
                    <p className="text-xs text-neutral-400">All implements autoclave-sterilized and unsealed in your presence.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#7CCBEE] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Prestige Global Product Formulations</h4>
                    <p className="text-xs text-neutral-400">Exclusively using Olaplex, L'Oreal Inoa, Kérastase, and Dermalogica.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <HeartHandshake className="w-5 h-5 text-[#7CCBEE] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Transparent Pricing & No Waiting Time</h4>
                    <p className="text-xs text-neutral-400">Strict booking caps ensure your stylist is dedicated exclusively to you.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/book">
                  <Button variant="primary" size="md">
                    Reserve Your Sanctuary Time
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
                alt="Hair Wash Station"
                className="rounded-2xl object-cover w-full h-64 sm:h-80 shadow-soft"
              />
              <img
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80"
                alt="Hair Styling"
                className="rounded-2xl object-cover w-full h-64 sm:h-80 shadow-soft translate-y-6"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. OFFERS SECTION */}
      <section id="offers" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="blue" size="sm" className="mb-2">Exclusive Privileges</Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#202020]">
            Offers & Seasonal Privileges
          </h2>
          <p className="text-sm text-[#575757] mt-1.5">
            Use these verified coupon codes during checkout or online booking to unlock savings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <Card
              key={promo._id}
              className="relative p-6 border-dashed border-2 border-[#7CCBEE]/60 bg-gradient-to-br from-white to-[#B8E7FA]/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="blue" size="sm">
                    {promo.discountType === 'PERCENTAGE'
                      ? `${promo.discountValue}% OFF`
                      : `₹${promo.discountValue} OFF`}
                  </Badge>
                  <span className="text-[10px] text-[#646464] font-mono">Min. ₹{promo.minPurchase}</span>
                </div>

                <h3 className="font-display font-bold text-lg text-[#202020] mb-1">{promo.title}</h3>
                <p className="text-xs text-[#575757] leading-relaxed mb-4">{promo.description}</p>
              </div>

              <div className="pt-4 border-t border-[#202020]/10 flex items-center justify-between">
                <div className="font-mono font-bold text-sm bg-white px-3 py-1.5 rounded-lg border border-[#202020]/15 tracking-wider text-[#0E4A66]">
                  {promo.code}
                </div>
                <button
                  onClick={() => copyCoupon(promo.code)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#42A9D8] hover:text-[#143644] transition-colors"
                >
                  {copiedCode === promo.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2B9A66]" />
                      <span className="text-[#2B9A66]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section id="reviews" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="blue" size="sm" className="mb-2">Client Reviews</Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#202020]">
            Stories from our guests.
          </h2>
          <p className="text-sm text-[#575757] mt-1.5">
            Real feedback from verified clients stored transparently in our salon database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <Card key={rev._id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-neutral-200 text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#3A3A3A] italic leading-relaxed mb-6">
                  "{rev.reviewText}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#202020]/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#202020]">{rev.customerName}</h4>
                  <p className="text-[10px] text-[#646464]">{rev.serviceName}</p>
                </div>
                <Badge variant="neutral" size="sm">
                  with {rev.stylistName?.split(' ')[0]}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. GALLERY */}
      <section id="gallery" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="blue" size="sm" className="mb-2">Visual Portfolio</Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#202020]">
            Crafted with precision.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80"
              alt="Hair Cut"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80"
              alt="Bridal Makeup"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80"
              alt="Nail Art"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80"
              alt="HydraFacial Glow"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#F3F0E8] border border-[#202020]/10 p-8 sm:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#202020]/10 text-xs font-semibold text-[#202020]">
            <Sparkles className="w-3.5 h-3.5 text-[#42A9D8]" />
            Effortless Online Booking
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-[#202020] tracking-tight">
            Your next appointment starts here.
          </h2>
          <p className="text-sm sm:text-base text-[#575757] max-w-lg mx-auto">
            Select your service, choose your preferred stylist, and pick the perfect time slot. Instant confirmation.
          </p>
          <div className="pt-2">
            <Link to="/book">
              <Button variant="primary" size="lg" icon={<Calendar className="w-5 h-5" />}>
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
