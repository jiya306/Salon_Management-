import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  History,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../services/api/apiClient.js';
import { Product, InventoryTransaction } from '../../types/index.js';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Badge } from '../../components/ui/Badge.js';
import { Modal } from '../../components/ui/Modal.js';

export const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Modals
  const [stockInModalOpen, setStockInModalOpen] = useState(false);
  const [stockOutModalOpen, setStockOutModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Stock In / Out Form
  const [stockQty, setStockQty] = useState('5');
  const [stockReason, setStockReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Add Product Form
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('Hair Care');
  const [formSupplier, setFormSupplier] = useState("L'Oréal Professionnel India");
  const [formBuyPrice, setFormBuyPrice] = useState('1000');
  const [formSellPrice, setFormSellPrice] = useState('1600');
  const [formInitStock, setFormInitStock] = useState('10');
  const [formMinStock, setFormMinStock] = useState('5');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (lowStockOnly) params.lowStock = 'true';

      const res = await api.get('/products', params);
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/inventory/transactions');
      if (res.success && res.data) {
        setTransactions(res.data);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, [search, categoryFilter, lowStockOnly]);

  const handleStockIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      setActionLoading(true);
      setActionError('');
      await api.post('/inventory/stock-in', {
        productId: selectedProduct._id,
        quantity: Number(stockQty),
        reason: stockReason || 'Restocked Batch',
      });
      setStockInModalOpen(false);
      fetchProducts();
      fetchTransactions();
    } catch (err: any) {
      setActionError(err.message || 'Stock In failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStockOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      setActionLoading(true);
      setActionError('');
      await api.post('/inventory/stock-out', {
        productId: selectedProduct._id,
        quantity: Number(stockQty),
        reason: stockReason || 'Used in Salon Ritual',
      });
      setStockOutModalOpen(false);
      fetchProducts();
      fetchTransactions();
    } catch (err: any) {
      setActionError(err.message || 'Stock Out failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setActionError('');
      await api.post('/products', {
        name: formName,
        sku: formSku.toUpperCase(),
        category: formCategory,
        supplier: formSupplier,
        purchasePrice: Number(formBuyPrice),
        sellingPrice: Number(formSellPrice),
        stockQuantity: Number(formInitStock),
        minStockLevel: Number(formMinStock),
      });
      setAddProductModalOpen(false);
      fetchProducts();
      // Reset
      setFormName('');
      setFormSku('');
    } catch (err: any) {
      setActionError(err.message || 'Failed to add product');
    } finally {
      setActionLoading(false);
    }
  };

  const categories = [
    'All',
    'Hair Care',
    'Skin Care',
    'Nail Care',
    'Color & Chemical',
    'Styling & Tools',
  ];

  const lowStockCount = products.filter(
    (p) => p.status === 'Low Stock' || p.status === 'Out of Stock'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#202020]">
            Inventory & Supply Chain
          </h1>
          <p className="text-xs text-[#646464] mt-1 font-mono">
            {products.length} registered SKUs • {lowStockCount} below minimum safety threshold
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHistoryModalOpen(true)}
            icon={<History className="w-4 h-4" />}
          >
            Audit Log
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddProductModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Product SKU
          </Button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-amber-900">
                {lowStockCount} products require immediate replenishment
              </p>
              <p className="text-amber-700">Quantities have fallen below configured reorder levels.</p>
            </div>
          </div>
          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className="px-3.5 py-1.5 rounded-full bg-white text-amber-800 font-bold border border-amber-200 hover:bg-amber-100 transition-colors shrink-0"
          >
            {lowStockOnly ? 'Show All Products' : 'Filter Low Stock'}
          </button>
        </div>
      )}

      {/* Filter Card */}
      <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search by SKU, product name, or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryFilter === c
                  ? 'bg-[#202020] text-white shadow-soft font-bold'
                  : 'bg-[#F3F0E8] text-[#646464] hover:bg-neutral-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Card>

      {/* Products Table */}
      <Card className="p-0 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F3F0E8] border-b border-[#202020]/10 text-[#646464] uppercase font-mono tracking-wider">
                <th className="py-3 px-4">SKU / Code</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Cost Price</th>
                <th className="py-3 px-4">Retail Price</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]/5">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#646464]">
                    No inventory records found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F9F7F3] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0E4A66]">
                      {p.sku}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#202020] block">{p.name}</span>
                      <span className="text-[11px] text-[#646464]">{p.supplier}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="neutral" size="sm">
                        {p.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#646464]">
                      ₹{p.purchasePrice}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#202020]">
                      ₹{p.sellingPrice}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span
                        className={
                          p.stockQuantity <= p.minStockLevel ? 'text-red-600' : 'text-[#202020]'
                        }
                      >
                        {p.stockQuantity} units
                      </span>
                      <span className="text-[10px] text-[#646464] font-normal block">
                        Min: {p.minStockLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          p.status === 'In Stock'
                            ? 'success'
                            : p.status === 'Low Stock'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setStockQty('5');
                            setStockReason('New Wholesale Order');
                            setStockInModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-full bg-[#B8E7FA]/40 hover:bg-[#7CCBEE] text-[#0E4A66] font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          <ArrowDownLeft className="w-3 h-3" /> Stock In
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setStockQty('1');
                            setStockReason('Used in Salon Service');
                            setStockOutModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#202020] font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          <ArrowUpRight className="w-3 h-3" /> Use
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Stock In Modal */}
      <Modal
        isOpen={stockInModalOpen}
        onClose={() => setStockInModalOpen(false)}
        title={`Stock In: ${selectedProduct?.name}`}
        description="Add newly delivered inventory batches into MongoDB."
      >
        <form onSubmit={handleStockIn} className="space-y-4">
          {actionError && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl">{actionError}</div>}
          <Input
            label="Quantity to Add (Units) *"
            type="number"
            min="1"
            value={stockQty}
            onChange={(e) => setStockQty(e.target.value)}
            required
          />
          <Input
            label="Reason / PO Number"
            placeholder="e.g. Inward Delivery Invoice #928"
            value={stockReason}
            onChange={(e) => setStockReason(e.target.value)}
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setStockInModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={actionLoading}>
              Confirm Inward
            </Button>
          </div>
        </form>
      </Modal>

      {/* Stock Out Modal */}
      <Modal
        isOpen={stockOutModalOpen}
        onClose={() => setStockOutModalOpen(false)}
        title={`Stock Out / Consumption: ${selectedProduct?.name}`}
        description="Log usage in salon treatments or customer sales."
      >
        <form onSubmit={handleStockOut} className="space-y-4">
          {actionError && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl">{actionError}</div>}
          <Input
            label="Quantity to Deduct (Units) *"
            type="number"
            min="1"
            max={selectedProduct?.stockQuantity || 1}
            value={stockQty}
            onChange={(e) => setStockQty(e.target.value)}
            required
          />
          <Input
            label="Usage Reason"
            placeholder="e.g. Keratin smoothing treatment usage"
            value={stockReason}
            onChange={(e) => setStockReason(e.target.value)}
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setStockOutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={actionLoading}>
              Deduct Stock
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        isOpen={addProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        title="Add New Inventory Product"
        description="Configure product SKU, wholesale purchase price, and reorder levels."
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          {actionError && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl">{actionError}</div>}
          <Input
            label="Product Name *"
            placeholder="e.g. Olaplex No. 4 Shampoo"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="SKU Code *"
              placeholder="OLA-SHP-001"
              value={formSku}
              onChange={(e) => setFormSku(e.target.value)}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] uppercase mb-1">
                Category
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full min-h-[44px] rounded-full bg-white text-xs text-[#202020] border border-[#202020]/15 px-3 outline-none"
              >
                <option value="Hair Care">Hair Care</option>
                <option value="Skin Care">Skin Care</option>
                <option value="Nail Care">Nail Care</option>
                <option value="Color & Chemical">Color & Chemical</option>
                <option value="Styling & Tools">Styling & Tools</option>
              </select>
            </div>
          </div>
          <Input
            label="Supplier *"
            value={formSupplier}
            onChange={(e) => setFormSupplier(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cost Price (₹)"
              type="number"
              value={formBuyPrice}
              onChange={(e) => setFormBuyPrice(e.target.value)}
              required
            />
            <Input
              label="Retail Price (₹)"
              type="number"
              value={formSellPrice}
              onChange={(e) => setFormSellPrice(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Initial Stock Quantity"
              type="number"
              value={formInitStock}
              onChange={(e) => setFormInitStock(e.target.value)}
              required
            />
            <Input
              label="Min Alert Level"
              type="number"
              value={formMinStock}
              onChange={(e) => setFormMinStock(e.target.value)}
              required
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setAddProductModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={actionLoading}>
              Save SKU
            </Button>
          </div>
        </form>
      </Modal>

      {/* Transaction History Modal */}
      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title="Stock Movements & Audit Trail"
        description="Immutable logs of all inventory inwards, consumption, and adjustments."
        maxWidth="2xl"
      >
        <div className="max-h-96 overflow-y-auto divide-y divide-[#202020]/10 border border-[#202020]/10 rounded-xl bg-white text-xs">
          {transactions.length === 0 ? (
            <p className="py-6 text-center text-[#646464]">No inventory transactions logged yet.</p>
          ) : (
            transactions.map((t) => (
              <div key={t._id} className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#202020] block">{t.productName}</span>
                  <span className="text-[11px] text-[#646464] font-mono">
                    SKU: {t.sku} • {t.reason}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-bold text-xs block ${
                      t.type === 'IN' ? 'text-[#2B9A66]' : 'text-red-600'
                    }`}
                  >
                    {t.type === 'IN' ? '+' : '-'}
                    {t.quantity} units
                  </span>
                  <span className="text-[10px] text-[#646464] font-mono">
                    Balance: {t.newStock}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};
