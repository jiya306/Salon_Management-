import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Printer,
  Download,
  IndianRupee,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api/apiClient.js';
import { Invoice, Customer, Service } from '../../types/index.js';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Badge } from '../../components/ui/Badge.js';
import { Modal } from '../../components/ui/Modal.js';

export const BillingPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [formDiscount, setFormDiscount] = useState('0');
  const [formPaymentMethod, setFormPaymentMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Online'>('UPI');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await api.get('/invoices', params);
      if (res.success && res.data) {
        setInvoices(res.data);
      }
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [search, selectedStatus]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          api.get('/customers'),
          api.get('/services'),
        ]);
        if (cRes.success) setCustomers(cRes.data);
        if (sRes.success) setServices(sRes.data);
      } catch (e) {
        // ignore
      }
    };
    loadData();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || selectedServiceIds.length === 0) {
      setFormError('Please select a customer and at least one service.');
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');

      const invoiceServices = selectedServiceIds.map((id) => {
        const found = services.find((s) => s._id === id);
        return {
          serviceId: found?._id,
          name: found?.name || 'Service',
          price: found?.price || 0,
          duration: found?.duration || 30,
        };
      });

      const res = await api.post('/invoices', {
        customerId: selectedCustomerId,
        services: invoiceServices,
        discount: Number(formDiscount),
        paymentMethod: formPaymentMethod,
        paymentStatus: 'Paid',
      });

      if (res.success && res.data) {
        setGenerateModalOpen(false);
        fetchInvoices();
        setActiveInvoice(res.data);
        setInvoiceModalOpen(true);
      }
    } catch (err: any) {
      setFormError(err.message || 'Invoice generation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
            Billing & Invoices
          </h1>
          <p className="text-xs text-[#646464] mt-1 font-mono">
            GST compliant invoices, receipts & multi-mode payments
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setSelectedCustomerId(customers[0]?._id || '');
            setSelectedServiceIds([services[0]?._id || '']);
            setGenerateModalOpen(true);
          }}
          icon={<Plus className="w-4 h-4" />}
        >
          Create Invoice
        </Button>
      </div>

      {/* Filter Card */}
      <Card className="p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search invoice number or guest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Paid', 'Pending', 'Refunded'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedStatus === st
                  ? 'bg-[#202020] text-white shadow-soft font-bold'
                  : 'bg-[#F3F0E8] text-[#646464] hover:bg-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </Card>

      {/* Invoices Table */}
      <Card className="p-0 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F3F0E8] border-b border-[#202020]/10 text-[#646464] uppercase font-mono tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Tax (18%)</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">View / Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]/5">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#646464]">
                    No invoices recorded.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr
                    key={inv._id}
                    onClick={() => {
                      setActiveInvoice(inv);
                      setInvoiceModalOpen(true);
                    }}
                    className="hover:bg-[#F9F7F3] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0E4A66]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#202020] block">{inv.customerName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#646464]">
                      {new Date(inv.issueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-[#202020]">
                      {inv.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#646464]">
                      ₹{(inv.tax || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-display font-bold text-sm text-[#202020]">
                      ₹{(inv.finalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          inv.paymentStatus === 'Paid'
                            ? 'success'
                            : inv.paymentStatus === 'Refunded'
                            ? 'danger'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {inv.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setActiveInvoice(inv);
                          setInvoiceModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-full bg-white hover:bg-[#7CCBEE] text-[#202020] hover:text-[#143644] font-semibold text-xs border border-[#202020]/10 transition-colors inline-flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Printable Invoice Modal */}
      <Modal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        title="Official Tax Invoice"
        description="Printable GST invoice for salon treatments."
        maxWidth="2xl"
      >
        {activeInvoice && (
          <div className="space-y-6">
            <div id="printable-invoice" className="p-6 bg-white rounded-2xl border border-[#202020]/10 text-xs">
              {/* Invoice Header */}
              <div className="flex justify-between items-start pb-6 border-b border-[#202020]/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-[#7CCBEE] flex items-center justify-center text-[#143644]">
                      <Sparkles className="w-4 h-4 fill-[#143644]" />
                    </div>
                    <span className="font-display font-extrabold text-xl tracking-tight text-[#202020]">
                      Salon<span className="text-[#42A9D8]">Flow</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-[#646464]">Waterfield Road, Bandra West, Mumbai 400050</p>
                  <p className="text-[10px] text-[#646464] font-mono">GSTIN: 27AABCS1429B1Z2</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-[#646464] block">Tax Invoice</span>
                  <p className="font-mono font-bold text-base text-[#202020]">{activeInvoice.invoiceNumber}</p>
                  <p className="text-[11px] text-[#646464] font-mono mt-0.5">
                    Date: {new Date(activeInvoice.issueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div className="py-4 border-b border-[#202020]/10 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#646464] block">Billed To</span>
                  <p className="font-bold text-[#202020] text-sm mt-0.5">{activeInvoice.customerName}</p>
                  <p className="text-[11px] text-[#646464]">{activeInvoice.customerPhone}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-[#646464] block">Payment Method</span>
                  <p className="font-bold text-[#202020] mt-0.5">{activeInvoice.paymentMethod}</p>
                  <Badge variant="success" size="sm" className="mt-1">
                    {activeInvoice.paymentStatus}
                  </Badge>
                </div>
              </div>

              {/* Items Table */}
              <div className="py-4 border-b border-[#202020]/10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[#646464] text-[10px] uppercase font-mono border-b border-[#202020]/10 pb-2">
                      <th className="py-1">Description</th>
                      <th className="py-1 text-center">Duration</th>
                      <th className="py-1 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202020]/5">
                    {activeInvoice.services.map((item, i) => (
                      <tr key={i}>
                        <td className="py-2.5 font-medium text-[#202020]">{item.name}</td>
                        <td className="py-2.5 text-center font-mono text-[#646464]">{item.duration}m</td>
                        <td className="py-2.5 text-right font-mono font-bold text-[#202020]">
                          ₹{item.price.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="pt-4 space-y-1.5 max-w-xs ml-auto text-right">
                <div className="flex justify-between text-[#646464]">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{activeInvoice.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {activeInvoice.discount > 0 && (
                  <div className="flex justify-between text-[#2B9A66]">
                    <span>Discount:</span>
                    <span className="font-mono">- ₹{activeInvoice.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#646464]">
                  <span>GST (18%):</span>
                  <span className="font-mono">₹{activeInvoice.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-bold font-display text-[#202020] pt-2 border-t border-[#202020]/10">
                  <span>Grand Total:</span>
                  <span>₹{activeInvoice.finalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 no-print">
              <Button variant="outline" size="md" onClick={() => setInvoiceModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" size="md" onClick={printInvoice} icon={<Printer className="w-4 h-4" />}>
                Print Invoice
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        title="Generate New Invoice"
        description="Select customer, add treatments, and log payment settlement."
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">{formError}</div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] uppercase mb-1">
              Select Customer *
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-4 outline-none"
              required
            >
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.fullName} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A3A3A] uppercase mb-1">
              Select Services Rendered *
            </label>
            <div className="max-h-40 overflow-y-auto space-y-1.5 p-3 rounded-xl border border-[#202020]/15 bg-white text-xs">
              {services.map((s) => {
                const isChecked = selectedServiceIds.includes(s._id);
                return (
                  <label
                    key={s._id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F9F7F3] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServiceIds([...selectedServiceIds, s._id]);
                          } else {
                            setSelectedServiceIds(selectedServiceIds.filter((id) => id !== s._id));
                          }
                        }}
                        className="rounded text-[#42A9D8]"
                      />
                      <span className="font-medium text-[#202020]">{s.name}</span>
                    </div>
                    <span className="font-mono font-bold text-[#202020]">₹{s.price}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Discount (₹)"
              type="number"
              value={formDiscount}
              onChange={(e) => setFormDiscount(e.target.value)}
            />
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] uppercase mb-1">
                Payment Method
              </label>
              <select
                value={formPaymentMethod}
                onChange={(e) => setFormPaymentMethod(e.target.value as any)}
                className="w-full min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-4 outline-none"
              >
                <option value="UPI">UPI (Google Pay / PhonePe)</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online Payment</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={formLoading}>
              Generate & Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
