import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Clock,
  IndianRupee,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
} from 'lucide-react';
import { api } from '../../services/api/apiClient.js';
import { Service, ServiceCategory } from '../../types/index.js';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Badge } from '../../components/ui/Badge.js';
import { Modal } from '../../components/ui/Modal.js';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ServiceCategory>('Hair');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDuration, setFormDuration] = useState('45');
  const [formImage, setFormImage] = useState('');
  const [formPopular, setFormPopular] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (search) params.search = search;

      const res = await api.get('/services', params);
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [activeCategory, search]);

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formDuration) {
      setFormError('Name, price, and duration are required.');
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');

      const payload = {
        name: formName,
        category: formCategory,
        description: formDescription,
        price: Number(formPrice),
        duration: Number(formDuration),
        image:
          formImage ||
          'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80',
        popularStatus: formPopular,
      };

      if (editService) {
        await api.put(`/services/${editService._id}`, payload);
      } else {
        await api.post('/services', payload);
      }

      setModalOpen(false);
      setEditService(null);
      fetchServices();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const openEdit = (svc: Service) => {
    setEditService(svc);
    setFormName(svc.name);
    setFormCategory(svc.category);
    setFormDescription(svc.description);
    setFormPrice(String(svc.price));
    setFormDuration(String(svc.duration));
    setFormImage(svc.image);
    setFormPopular(svc.popularStatus);
    setModalOpen(true);
  };

  const toggleActive = async (svc: Service) => {
    try {
      const res = await api.put(`/services/${svc._id}`, { isActive: !svc.isActive });
      if (res.success) {
        setServices((prev) =>
          prev.map((s) => (s._id === svc._id ? { ...s, isActive: !s.isActive } : s))
        );
      }
    } catch (e) {
      alert('Failed to toggle status');
    }
  };

  const categories = ['All', 'Hair', 'Beauty', 'Nails', 'Bridal', 'Spa'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
            Salon Services Catalog
          </h1>
          <p className="text-xs text-[#646464] mt-1 font-mono">
            {services.length} treatments and beauty procedures configured
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditService(null);
            setFormName('');
            setFormPrice('');
            setFormDuration('45');
            setFormDescription('');
            setFormImage('');
            setFormPopular(false);
            setModalOpen(true);
          }}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Service
        </Button>
      </div>

      {/* Filter and Categories */}
      <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search service name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#202020] text-white shadow-soft font-bold'
                  : 'bg-[#F3F0E8] text-[#646464] hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <Card key={svc._id} className="p-0 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="aspect-[16/9] relative bg-neutral-100 overflow-hidden">
                <img src={svc.image} alt={svc.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="neutral" size="sm" className="bg-white/90">
                    {svc.category}
                  </Badge>
                  {svc.popularStatus && <Badge variant="blue" size="sm">Popular</Badge>}
                </div>
                <button
                  onClick={() => openEdit(svc)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#202020] shadow-soft"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-display font-bold text-sm text-[#202020]">{svc.name}</h3>
                </div>
                <p className="text-xs text-[#575757] line-clamp-2 leading-relaxed mb-4">
                  {svc.description}
                </p>

                <div className="flex items-center justify-between text-xs font-mono text-[#646464] pt-2 border-t border-[#202020]/10">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#7CCBEE]" />
                    {svc.duration} mins
                  </span>
                  <span className="font-display font-bold text-base text-[#202020]">
                    ₹{svc.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F9F7F3] border-t border-[#202020]/10 flex items-center justify-between">
              <span className="text-xs text-[#646464]">Status</span>
              <button
                onClick={() => toggleActive(svc)}
                className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                  svc.isActive
                    ? 'bg-[#2B9A66]/20 text-[#2B9A66] hover:bg-[#2B9A66]/30'
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {svc.isActive ? 'Active Menu' : 'Inactive'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editService ? 'Edit Service' : 'Add New Salon Service'}
        description="Set pricing in INR, duration step, and treatment details."
      >
        <form onSubmit={handleSaveService} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">{formError}</div>
          )}

          <Input
            label="Service Title *"
            placeholder="e.g. Signature Precision Haircut"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] uppercase mb-1">
                Category
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as ServiceCategory)}
                className="w-full min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-3 outline-none"
              >
                <option value="Hair">Hair</option>
                <option value="Beauty">Beauty</option>
                <option value="Nails">Nails</option>
                <option value="Bridal">Bridal</option>
                <option value="Spa">Spa</option>
              </select>
            </div>

            <Input
              label="Price (₹ INR) *"
              type="number"
              placeholder="950"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              required
            />

            <Input
              label="Duration (Mins) *"
              type="number"
              placeholder="45"
              value={formDuration}
              onChange={(e) => setFormDuration(e.target.value)}
              required
            />
          </div>

          <Input
            label="Description *"
            placeholder="Detailed description of the ritual and products applied"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            required
          />

          <Input
            label="Image URL"
            placeholder="https://images.unsplash.com/..."
            value={formImage}
            onChange={(e) => setFormImage(e.target.value)}
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="popular"
              checked={formPopular}
              onChange={(e) => setFormPopular(e.target.checked)}
              className="rounded text-[#42A9D8] focus:ring-[#7CCBEE]"
            />
            <label htmlFor="popular" className="text-xs text-[#202020] font-medium">
              Highlight as Popular / Best Seller
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={formLoading}>
              Save Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
