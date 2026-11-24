import React, { useState, useEffect } from 'react';
import { Star, Plus, ThumbsUp, ShieldCheck, Search } from 'lucide-react';
import { api } from '../../services/api/apiClient.js';
import { Review, Staff, Service } from '../../types/index.js';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Badge } from '../../components/ui/Badge.js';
import { Modal } from '../../components/ui/Modal.js';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [guestName, setGuestName] = useState('');
  const [formStylistId, setFormStylistId] = useState('');
  const [formServiceId, setFormServiceId] = useState('');
  const [rating, setRating] = useState('5');
  const [reviewText, setReviewText] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (ratingFilter !== 'All') params.rating = ratingFilter;

      const res = await api.get('/reviews', params);
      if (res.success && res.data) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [ratingFilter]);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const [stRes, svRes] = await Promise.all([
          api.get('/staff'),
          api.get('/services'),
        ]);
        if (stRes.success) setStaff(stRes.data);
        if (svRes.success) setServices(svRes.data);
      } catch (e) {
        // ignore
      }
    };
    loadResources();
  }, []);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !reviewText) {
      setFormError('Please provide your name and review feedback.');
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');

      await api.post('/reviews', {
        customerName: guestName,
        stylistId: formStylistId || undefined,
        serviceId: formServiceId || undefined,
        rating: Number(rating),
        reviewText,
      });

      setModalOpen(false);
      fetchReviews();
      setGuestName('');
      setReviewText('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit review');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
            Customer Reviews & Ratings
          </h1>
          <p className="text-xs text-[#646464] mt-1 font-mono">
            {reviews.length} client feedback testimonials stored in MongoDB
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setFormStylistId(staff[0]?._id || '');
            setFormServiceId(services[0]?._id || '');
            setModalOpen(true);
          }}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Testimonial
        </Button>
      </div>

      {/* Filter Tabs */}
      <Card className="p-4 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {['All', '5', '4', '3'].map((r) => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                ratingFilter === r
                  ? 'bg-[#202020] text-white shadow-soft font-bold'
                  : 'bg-[#F3F0E8] text-[#646464] hover:bg-neutral-200'
              }`}
            >
              {r === 'All' ? 'All Ratings' : `${r} Stars ★`}
            </button>
          ))}
        </div>
      </Card>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <Card key={rev._id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-neutral-200 text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-[#646464] font-mono">
                  {new Date(rev.date).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-[#3A3A3A] italic leading-relaxed mb-4">
                "{rev.reviewText}"
              </p>
            </div>

            <div className="pt-3 border-t border-[#202020]/10 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#202020] block">{rev.customerName}</span>
                <span className="text-[10px] text-[#646464] block">{rev.serviceName}</span>
              </div>
              <Badge variant="blue" size="sm">
                Stylist: {rev.stylistName?.split(' ')[0]}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Review Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Guest Review"
        description="Record verified feedback for service and stylist quality."
      >
        <form onSubmit={handleAddReview} className="space-y-4 text-xs">
          {formError && <div className="p-3 bg-red-50 text-red-600 rounded-xl">{formError}</div>}

          <Input
            label="Guest Name *"
            placeholder="e.g. Natasha D'Souza"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] uppercase mb-1">
                Stylist
              </label>
              <select
                value={formStylistId}
                onChange={(e) => setFormStylistId(e.target.value)}
                className="w-full min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-3 outline-none"
              >
                {staff.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] uppercase mb-1">
                Service Received
              </label>
              <select
                value={formServiceId}
                onChange={(e) => setFormServiceId(e.target.value)}
                className="w-full min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-3 outline-none"
              >
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] uppercase mb-1">
              Rating (1 to 5 Stars)
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-3 outline-none"
            >
              <option value="5">★★★★★ (5 Stars - Exceptional)</option>
              <option value="4">★★★★☆ (4 Stars - Very Good)</option>
              <option value="3">★★★☆☆ (3 Stars - Average)</option>
            </select>
          </div>

          <Input
            label="Review Feedback *"
            placeholder="Describe the styling experience, ambience, and result..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={formLoading}>
              Post Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
