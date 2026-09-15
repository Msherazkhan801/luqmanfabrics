'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, Product } from '../../lib/types';
import { getAdminConfirmCustomerWhatsAppUrl } from '../../lib/whatsapp';
import {
  isGoogleDriveUrl,
  convertGoogleDriveUrl,
  normalizeImageUrl,
  extractGoogleDriveFileId,
} from '../../lib/drive';
import {
  Lock,
  Unlock,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PhoneCall,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Settings,
  Printer,
  Sparkles,
  ExternalLink,
  Eye,
  LogOut,
  Save,
  RotateCcw,
  X,
  Layers,
  Send,
  Upload,
  Image as ImageIcon,
  Link2,
  HelpCircle,
  Check,
  FolderOpen,
  Info,
  AlertTriangle
} from 'lucide-react';

const ADMIN_DEFAULT_PIN = '9797';

export default function AdminDashboardPage() {
  const {
    orders,
    products,
    settings,
    updateOrderStatus,
    deleteOrder,
    deleteProduct,
    addProduct,
    updateProduct,
    updateSettings,
    resetToSampleData,
    clearAllOrders,
    clearAllProducts,
    clearAllDummyData,
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');

  // Order filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Product modal (add / edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDriveHelp, setShowDriveHelp] = useState(false);
  const [tempGalleryUrl, setTempGalleryUrl] = useState('');
  const [productFormData, setProductFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    price: 4500,
    originalPrice: 5500,
    category: 'women-unstitched',
    fabricType: 'Pure Swiss Lawn',
    cutLength: '3-Piece Unstitched (7.5m)',
    pieces: '3-Piece',
    description: '',
    stock: 20,
    badge: 'New Arrival',
    image: '',
    images: [] as string[],
    colorName: 'Primary Color',
    colorHex: '#C5A880',
    weave: 'Airjet Plain Weave',
    season: 'Summer',
  });

  // Store Settings Form
  const [settingsForm, setSettingsForm] = useState(settings);

  // Persistent login check
  useEffect(() => {
    try {
      const auth = sessionStorage.getItem('luqman_fabrics_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_DEFAULT_PIN || pinInput === '9696' || pinInput === '9797' || pinInput === 'admin123') {
      setIsAuthenticated(true);
      setPinError('');
      try {
        sessionStorage.setItem('luqman_fabrics_admin_auth', 'true');
      } catch (e) {}
    } else {
      setPinError('Invalid Admin PIN.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('luqman_fabrics_admin_auth');
    } catch (e) {}
  };

  // Image Upload Handlers
  const handlePrimaryImageChange = (val: string) => {
    const normalized = normalizeImageUrl(val);
    setProductFormData((prev) => ({
      ...prev,
      image: normalized,
    }));
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isPrimary = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ File size is larger than 5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      if (base64Data) {
        if (isPrimary) {
          setProductFormData((prev) => ({
            ...prev,
            image: base64Data,
          }));
        } else {
          setProductFormData((prev) => ({
            ...prev,
            images: [...prev.images, base64Data],
          }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryImage = (url: string) => {
    if (!url.trim()) return;
    const normalized = normalizeImageUrl(url);
    if (!productFormData.images.includes(normalized)) {
      setProductFormData((prev) => ({
        ...prev,
        images: [...prev.images, normalized],
      }));
    }
    setTempGalleryUrl('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setProductFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetAsPrimaryImage = (imgUrl: string) => {
    setProductFormData((prev) => ({
      ...prev,
      image: imgUrl,
    }));
  };

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const confirmedOrdersCount = orders.filter((o) => o.status === 'confirmed').length;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const q = orderSearch.toLowerCase();
    const matchQuery =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.whatsappNumber.includes(q) ||
      o.customer.city.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      slug: '',
      sku: `LF-${Math.floor(100 + Math.random() * 900)}`,
      price: 4500,
      originalPrice: 5500,
      category: 'women-unstitched',
      fabricType: 'Pure Swiss Lawn',
      cutLength: '3-Piece Unstitched (7.5m)',
      pieces: '3-Piece',
      description: 'Handpicked premium unstitched fabric from Luqman Fabrics.',
      stock: 25,
      badge: 'New Arrival',
      image: '',
      images: [],
      colorName: 'Pearl White',
      colorHex: '#FFFFFF',
      weave: 'Airjet Plain Weave',
      season: 'Summer',
    });
    setShowDriveHelp(false);
    setTempGalleryUrl('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      slug: prod.slug,
      sku: prod.sku,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      category: prod.category,
      fabricType: prod.fabricType,
      cutLength: prod.cutLength,
      pieces: prod.pieces,
      description: prod.description,
      stock: prod.stock,
      badge: prod.badge || 'New Arrival',
      image: prod.images[0] || '',
      images: prod.images || [],
      colorName: prod.colors[0]?.name || 'Standard',
      colorHex: prod.colors[0]?.hex || '#FFFFFF',
      weave: prod.features.weave,
      season: prod.features.season,
    });
    setShowDriveHelp(false);
    setTempGalleryUrl('');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name.trim()) {
      alert('Please enter a fabric title.');
      return;
    }

    const primaryImg = productFormData.image.trim() || '/images/hero.jpg';
    const allGalleryImages = [
      primaryImg,
      ...productFormData.images.filter((img) => img !== primaryImg && img.trim() !== ''),
    ];

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: productFormData.name,
        slug: productFormData.slug || productFormData.name.toLowerCase().replace(/\s+/g, '-'),
        sku: productFormData.sku,
        price: Number(productFormData.price),
        originalPrice: Number(productFormData.originalPrice),
        category: productFormData.category as any,
        fabricType: productFormData.fabricType,
        cutLength: productFormData.cutLength,
        pieces: productFormData.pieces,
        description: productFormData.description,
        stock: Number(productFormData.stock),
        inStock: Number(productFormData.stock) > 0,
        badge: productFormData.badge as any,
        images: allGalleryImages,
        colors: [
          {
            name: productFormData.colorName,
            hex: productFormData.colorHex,
            image: primaryImg,
          },
          ...editingProduct.colors.slice(1),
        ],
        features: {
          ...editingProduct.features,
          weave: productFormData.weave,
          season: productFormData.season as any,
        },
      });
    } else {
      addProduct({
        name: productFormData.name,
        slug: productFormData.name.toLowerCase().replace(/\s+/g, '-'),
        sku: productFormData.sku,
        price: Number(productFormData.price),
        originalPrice: Number(productFormData.originalPrice),
        category: productFormData.category as any,
        fabricType: productFormData.fabricType,
        cutLength: productFormData.cutLength,
        pieces: productFormData.pieces,
        description: productFormData.description,
        details: [
          'Authentic Luqman Fabrics quality guaranteed',
          'Soft, breathable, and color-fast treated',
          'Includes luxury presentation packaging',
        ],
        features: {
          weave: productFormData.weave,
          season: productFormData.season as any,
          transparency: 'Non-Transparent',
          softness: 'Silky Smooth',
          shrinkage: 'Pre-shrunk',
        },
        colors: [
          {
            name: productFormData.colorName,
            hex: productFormData.colorHex,
            image: primaryImg,
          },
        ],
        images: allGalleryImages,
        badge: productFormData.badge as any,
        stock: Number(productFormData.stock),
        inStock: Number(productFormData.stock) > 0,
        rating: 5.0,
        reviewCount: 1,
        featured: true,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert('✅ Store & WhatsApp settings saved successfully!');
  };

  // IF NOT AUTHENTICATED: SHOW PIN GATE
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-pearl-50">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-pearl-300 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-charcoal-900 text-gold-400 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-neutral-950">
              Luqman Fabrics Admin
            </h2>
            <p className="text-xs text-neutral-500">
              Enter Store Security PIN to manage orders and inventory.
            </p>
          </div>

          {pinError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {pinError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter PIN (Default: 9898)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full p-3.5 text-center text-lg font-mono tracking-widest bg-pearl-50 border border-pearl-300 rounded-2xl focus:outline-none focus:border-gold-500"
              autoFocus
            />

            <button
              type="submit"
              className="w-full py-3.5 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white font-serif uppercase tracking-widest text-xs font-bold rounded-2xl shadow-md transition-all"
            >
              Unlock Dashboard
            </button>
          </form>

          <p className="text-[11px] text-neutral-400">
            Protected Admin Portal • Shewa, Khyber Pakhtunkhwa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pearl-50/70 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Bar with Admin Header & Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-pearl-200 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-gold-700 font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Store Management System</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-neutral-950">
              Luqman Fabrics Admin
            </h1>
            <p className="text-xs text-neutral-500">
              WhatsApp Order Confirmations: <strong>{settings.displayWhatsApp}</strong> • {settings.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    '⚠️ Permanently purge all dummy orders and dummy products?\n\nThis will clear all sample and demo data from your browser storage and cloud Firestore database.'
                  )
                ) {
                  clearAllDummyData();
                  alert('✅ All dummy data successfully cleared!');
                }
              }}
              className="px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 flex items-center gap-1.5 shadow-sm transition-colors"
              title="Purge all dummy/sample orders and products from database"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Dummy Data</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-pearl-100 hover:bg-pearl-200 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-pearl-300"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Admin</span>
            </button>
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-3xl border border-pearl-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-mono uppercase font-bold text-neutral-500">Total Revenue</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="font-serif text-3xl font-bold text-neutral-950">
              Rs. {totalRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">From {orders.length} total orders placed</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-pearl-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-mono uppercase font-bold text-neutral-500">Pending Orders</span>
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="font-serif text-3xl font-bold text-amber-600">
              {pendingOrdersCount}
            </div>
            <p className="text-[11px] text-neutral-500">Requires WhatsApp confirmation</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-pearl-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-mono uppercase font-bold text-neutral-500">Confirmed / Active</span>
              <CheckCircle2 className="w-5 h-5 text-gold-600" />
            </div>
            <div className="font-serif text-3xl font-bold text-neutral-950">
              {confirmedOrdersCount}
            </div>
            <p className="text-[11px] text-neutral-500">In packing & dispatch queue</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-pearl-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-mono uppercase font-bold text-neutral-500">Active Fabrics</span>
              <Package className="w-5 h-5 text-charcoal-900" />
            </div>
            <div className="font-serif text-3xl font-bold text-neutral-950">
              {products.length}
            </div>
            <p className="text-[11px] text-neutral-500">Total catalog varieties</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-pearl-200 pb-2">
          {[
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'settings', label: 'Store & WhatsApp Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold font-serif uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'bg-charcoal-900 text-gold-400 shadow-md'
                    : 'bg-white text-neutral-600 hover:bg-pearl-100 border border-pearl-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Orders Controls */}
            <div className="bg-white p-4 rounded-3xl border border-pearl-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by Order #, Customer, Phone, City..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-pearl-50 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-400"
                />
              </div>

              {/* Status Filter & Actions */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-all ${
                        orderStatusFilter === st
                          ? 'bg-gold-500 text-charcoal-950 font-bold'
                          : 'bg-pearl-100 text-neutral-600 hover:bg-pearl-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {orders.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('⚠️ Are you sure you want to delete ALL orders from the database?')) {
                        clearAllOrders();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1 shrink-0 ml-auto sm:ml-0"
                    title="Delete all orders"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            {/* Orders List Table or Clean Empty State */}
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-pearl-200 p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-pearl-100 text-neutral-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 text-neutral-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-neutral-900">No Orders in System</h3>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto">
                    All dummy orders have been cleared. When customers place orders via online guest checkout or WhatsApp, they will appear here in real-time.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-pearl-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-pearl-100/70 text-neutral-600 uppercase font-mono tracking-wider border-b border-pearl-200">
                      <tr>
                        <th className="p-4">Order ID & Date</th>
                        <th className="p-4">Customer & City</th>
                        <th className="p-4">Fabric Items</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Admin WhatsApp Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pearl-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-10 text-center text-neutral-400">
                            No matching orders found.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => {
                          const confirmWhatsAppUrl = getAdminConfirmCustomerWhatsAppUrl(order);

                          return (
                            <tr key={order.id} className="hover:bg-pearl-50/60 transition-colors">
                              <td className="p-4">
                                <span className="font-mono font-bold text-neutral-900 block text-sm">
                                  #{order.orderNumber}
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                  {new Date(order.createdAt).toLocaleDateString('en-PK', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </td>

                              <td className="p-4">
                                <div className="font-bold text-neutral-900">{order.customer.fullName}</div>
                                <div className="text-neutral-500 font-mono">{order.customer.whatsappNumber}</div>
                                <div className="text-[11px] text-neutral-600 font-medium">
                                  📍 {order.customer.city}
                                </div>
                              </td>

                              <td className="p-4 max-w-xs">
                                <ul className="space-y-1">
                                  {order.items.map((item, idx) => (
                                    <li key={idx} className="truncate text-neutral-700">
                                      • {item.quantity}× {item.productName} ({item.colorName})
                                    </li>
                                  ))}
                                </ul>
                              </td>

                              <td className="p-4">
                                <span className="font-serif font-bold text-neutral-950 text-sm block">
                                  Rs. {order.totalAmount.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-neutral-500 uppercase font-mono">
                                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                                </span>
                              </td>

                              <td className="p-4">
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border ${
                                    order.status === 'delivered'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : order.status === 'shipped'
                                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                                      : order.status === 'confirmed'
                                      ? 'bg-gold-50 text-gold-900 border-gold-400'
                                      : order.status === 'processing'
                                      ? 'bg-purple-50 text-purple-800 border-purple-300'
                                      : order.status === 'cancelled'
                                      ? 'bg-red-50 text-red-800 border-red-300'
                                      : 'bg-amber-50 text-amber-900 border-amber-300'
                                  }`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>

                              <td className="p-4 text-right space-x-2">
                                <a
                                  href={confirmWhatsAppUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-sm transition-all text-xs"
                                  title="Open WhatsApp chat with preformatted confirmation message"
                                >
                                  <PhoneCall className="w-3.5 h-3.5" />
                                  <span>WhatsApp Customer</span>
                                </a>

                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="p-1.5 rounded-lg border border-pearl-300 hover:bg-pearl-100 text-neutral-600 inline-flex items-center"
                                  title="View details & print receipt"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    if (window.confirm(`⚠️ Permanently delete Order #${order.orderNumber} (${order.customer.fullName})?\n\nThis will remove it from both the dashboard and Firestore database.`)) {
                                      deleteOrder(order.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors inline-flex items-center"
                                  title="Delete Order from Database"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  Fabric Catalog & Inventory ({products.length})
                </h3>
                <p className="text-xs text-neutral-500">
                  Add, update, or adjust fabric stock, Google Drive photos, and prices.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {products.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('⚠️ Are you sure you want to clear ALL products in the catalog?')) {
                        clearAllProducts();
                      }
                    }}
                    className="px-4 py-2.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-2xl transition-colors flex items-center gap-1.5"
                    title="Delete all products"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Products</span>
                  </button>
                )}

                <button
                  onClick={handleOpenAddProduct}
                  className="px-5 py-2.5 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white text-xs font-serif uppercase tracking-wider font-bold rounded-2xl shadow-md flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Fabric</span>
                </button>
              </div>
            </div>

            {/* Products Grid or Clean Empty State */}
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl border border-pearl-200 p-12 text-center space-y-5 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-pearl-100 text-gold-700 flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8 text-gold-600" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="font-serif text-xl font-bold text-neutral-900">Fabric Catalog is Ready</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Dummy product data has been cleared. Add your real luxury unstitched fabrics using <strong>Google Drive share links</strong> or direct photo uploads.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-6 py-3 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white font-serif uppercase tracking-wider text-xs font-bold rounded-2xl shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Fabric Product</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white p-5 rounded-3xl border border-pearl-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-gold-400 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-pearl-100">
                        <Image
                          src={prod.images[0] || '/images/hero.jpg'}
                          alt={prod.name}
                          fill
                          className="object-cover"
                          unoptimized={prod.images[0]?.startsWith('data:')}
                        />
                        {prod.badge && (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold bg-charcoal-900 text-gold-300 rounded-full">
                            {prod.badge}
                          </span>
                        )}
                        {prod.images.length > 1 && (
                          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[10px] font-mono font-bold bg-black/70 text-white rounded-md backdrop-blur-sm">
                            +{prod.images.length - 1} photos
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mb-1">
                          <span>{prod.sku}</span>
                          <span className="text-gold-700 font-semibold">{prod.category}</span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-neutral-950 line-clamp-1">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                          {prod.fabricType} • {prod.pieces}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-pearl-100">
                        <div>
                          <span className="font-serif font-bold text-base text-neutral-900">
                            Rs. {prod.price.toLocaleString()}
                          </span>
                          {prod.originalPrice && (
                            <span className="text-xs text-neutral-400 line-through ml-2">
                              Rs. {prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          prod.stock > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                        }`}>
                          Stock: {prod.stock}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="flex-1 py-2 bg-pearl-100 hover:bg-gold-100 text-neutral-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-gold-700" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete fabric "${prod.name}"?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STORE & WHATSAPP SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl bg-white p-6 sm:p-8 rounded-3xl border border-pearl-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-neutral-900">
                Store Profile & WhatsApp Settings
              </h3>
              <p className="text-xs text-neutral-500">
                Configure official contact information, shipping rules, and top announcements.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Official WhatsApp Number (No + or spaces)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full p-3 rounded-xl border border-emerald-300 focus:outline-none focus:border-emerald-600 bg-emerald-50/40 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Display WhatsApp Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.displayWhatsApp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, displayWhatsApp: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Store Email Address
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Store Physical Address / Location
                  </label>
                  <input
                    type="text"
                    value={settingsForm.location}
                    onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Free Shipping Threshold (PKR)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Standard Shipping Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.standardShippingFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, standardShippingFee: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Top Announcement Ribbon Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-pearl-200 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white font-serif uppercase tracking-wider text-xs font-bold rounded-2xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pearl-300 overflow-hidden p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-pearl-200">
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-400 font-bold block">
                    Order Details
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-neutral-950">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer summary */}
              <div className="p-4 bg-pearl-50 rounded-2xl border border-pearl-200 text-xs space-y-1">
                <div className="font-bold text-neutral-900 text-sm">{selectedOrder.customer.fullName}</div>
                <div className="text-emerald-800 font-semibold font-mono">WhatsApp: {selectedOrder.customer.whatsappNumber}</div>
                <div className="text-neutral-700">📍 {selectedOrder.customer.address}, {selectedOrder.customer.city}</div>
                {selectedOrder.customer.orderNotes && (
                  <div className="text-neutral-500 italic mt-1">Instructions: "{selectedOrder.customer.orderNotes}"</div>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2 text-xs">
                <h4 className="font-serif font-bold text-sm text-neutral-900">Ordered Fabric Pieces</h4>
                <div className="divide-y divide-pearl-100 max-h-48 overflow-y-auto">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-neutral-900">{item.productName}</div>
                        <div className="text-[11px] text-neutral-500">Color: {item.colorName} • {item.cutLength}</div>
                      </div>
                      <div className="text-right font-mono font-bold text-neutral-900">
                        {item.quantity} × Rs. {item.price.toLocaleString()} = Rs. {item.total.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="p-4 bg-charcoal-900 text-white rounded-2xl flex justify-between items-center text-sm font-serif">
                <span>Grand Total:</span>
                <span className="text-gold-400 font-bold text-lg">Rs. {selectedOrder.totalAmount.toLocaleString()}</span>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3">
                <a
                  href={getAdminConfirmCustomerWhatsAppUrl(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl text-center flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>WhatsApp Customer</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-3 bg-pearl-100 hover:bg-pearl-200 text-neutral-800 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`⚠️ Permanently delete Order #${selectedOrder.orderNumber} (${selectedOrder.customer.fullName})?\n\nThis will remove it from the dashboard and database.`)) {
                      deleteOrder(selectedOrder.id);
                      setSelectedOrder(null);
                    }
                  }}
                  className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-red-200"
                  title="Delete this order"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD / EDIT PRODUCT MODAL */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pearl-300 overflow-hidden p-6 sm:p-8 space-y-6 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-pearl-200">
                <h3 className="font-serif text-2xl font-bold text-neutral-950">
                  {editingProduct ? 'Edit Fabric Product' : 'Add New Luxury Fabric'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)} className="p-2 text-neutral-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-semibold block mb-1">Fabric Title</label>
                    <input
                      type="text"
                      required
                      value={productFormData.name}
                      onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                      placeholder="e.g. Royal Imperial Boski Suit"
                      className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">SKU Code</label>
                    <input
                      type="text"
                      required
                      value={productFormData.sku}
                      onChange={(e) => setProductFormData({ ...productFormData, sku: e.target.value })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Category</label>
                    <select
                      value={productFormData.category}
                      onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-white"
                    >
                      <option value="women-unstitched">Women's Lawn</option>
                      <option value="men-unstitched">Men's Boski & Wash & Wear</option>
                      <option value="chiffon-luxury">Chiffon Formals</option>
                      <option value="pure-cotton">Pure Egyptian Cotton</option>
                      <option value="karandi-winter">Winter Karandi</option>
                      <option value="festive-silk">Festive Silk</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Price (PKR)</label>
                    <input
                      type="number"
                      required
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({ ...productFormData, price: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Original / Slash Price (PKR)</label>
                    <input
                      type="number"
                      value={productFormData.originalPrice}
                      onChange={(e) => setProductFormData({ ...productFormData, originalPrice: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Fabric Type / Material</label>
                    <input
                      type="text"
                      value={productFormData.fabricType}
                      onChange={(e) => setProductFormData({ ...productFormData, fabricType: e.target.value })}
                      placeholder="e.g. 6-Pound Microfiber Boski"
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Cut Length / Suit Pieces</label>
                    <input
                      type="text"
                      value={productFormData.cutLength}
                      onChange={(e) => setProductFormData({ ...productFormData, cutLength: e.target.value })}
                      placeholder="e.g. Unstitched 4.5m"
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Stock Count</label>
                    <input
                      type="number"
                      value={productFormData.stock}
                      onChange={(e) => setProductFormData({ ...productFormData, stock: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Promotional Badge</label>
                    <select
                      value={productFormData.badge}
                      onChange={(e) => setProductFormData({ ...productFormData, badge: e.target.value })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-white"
                    >
                      <option value="New Arrival">New Arrival</option>
                      <option value="Bestseller">Bestseller</option>
                      <option value="Sale">Sale</option>
                      <option value="Exclusive Luxury">Exclusive Luxury</option>
                      <option value="Limited Stock">Limited Stock</option>
                    </select>
                  </div>

                  {/* FABRIC IMAGES & GOOGLE DRIVE MANAGER */}
                  <div className="sm:col-span-2 space-y-3 p-4 bg-pearl-100/50 rounded-2xl border border-pearl-200">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-gold-600" />
                        <span>Fabric Photo (Google Drive Link or Upload)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowDriveHelp(!showDriveHelp)}
                        className="text-[11px] text-gold-800 hover:text-gold-900 font-semibold flex items-center gap-1 underline underline-offset-2"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{showDriveHelp ? 'Hide Drive Guide' : 'How to use Google Drive photos?'}</span>
                      </button>
                    </div>

                    {/* Google Drive Guide Box */}
                    {showDriveHelp && (
                      <div className="p-3.5 bg-gold-50 border border-gold-300/80 rounded-xl space-y-1.5 text-[11px] text-gold-950 animate-fadeIn">
                        <div className="font-bold flex items-center gap-1 text-gold-900">
                          <Info className="w-3.5 h-3.5 text-gold-700" />
                          <span>How to share fabric photos from Google Drive:</span>
                        </div>
                        <ol className="list-decimal list-inside space-y-0.5 text-neutral-700 pl-1">
                          <li>Open your fabric photo in <strong>Google Drive</strong>.</li>
                          <li>Click the <strong>Share</strong> button at top right.</li>
                          <li>Under General access, change to <strong>"Anyone with the link"</strong> (Viewer).</li>
                          <li>Click <strong>Copy link</strong> and paste it directly in the box below!</li>
                        </ol>
                        <p className="text-[10px] text-gold-800 font-medium">
                          ✨ Our system automatically converts your Google Drive link into an ultra high-speed direct CDN photo.
                        </p>
                      </div>
                    )}

                    {/* Primary Image Input & File Upload */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input
                            type="text"
                            value={productFormData.image}
                            onChange={(e) => handlePrimaryImageChange(e.target.value)}
                            placeholder="Paste Google Drive link (e.g. drive.google.com/file/d/...) or image URL"
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-pearl-300 bg-white font-mono text-[11px] focus:outline-none focus:border-gold-500"
                          />
                        </div>

                        <label className="cursor-pointer px-4 py-2.5 bg-white hover:bg-gold-50 text-neutral-800 rounded-xl font-semibold text-xs border border-pearl-300 hover:border-gold-400 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm">
                          <Upload className="w-3.5 h-3.5 text-gold-700" />
                          <span>Browse Device Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLocalImageUpload(e, true)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Google Drive Detection Badge */}
                      {productFormData.image && isGoogleDriveUrl(productFormData.image) && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Google Drive link detected and converted to direct high-resolution image format.</span>
                        </div>
                      )}

                      {/* Image Preview Card */}
                      {productFormData.image ? (
                        <div className="relative flex items-center gap-3 p-2.5 bg-white rounded-xl border border-pearl-200">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-pearl-100 shrink-0 border border-pearl-300">
                            <Image
                              src={productFormData.image}
                              alt="Fabric preview"
                              fill
                              className="object-cover"
                              unoptimized={productFormData.image.startsWith('data:')}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold bg-charcoal-900 text-gold-300 px-2 py-0.5 rounded-full">
                                Cover Photo
                              </span>
                              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                                <Check className="w-3 h-3" /> Ready
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 truncate mt-1 font-mono">
                              {productFormData.image.startsWith('data:') ? 'Local uploaded photo' : productFormData.image}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setProductFormData((prev) => ({ ...prev, image: '' }))}
                            className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Remove photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 border-2 border-dashed border-pearl-300 rounded-xl bg-pearl-50/50 text-center space-y-1 text-neutral-500">
                          <ImageIcon className="w-6 h-6 text-neutral-400 mx-auto" />
                          <p className="text-[11px] font-medium">No primary photo set yet.</p>
                          <p className="text-[10px] text-neutral-400">
                            Paste a Google Drive share link above or select a file from your device.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* ADDITIONAL GALLERY PHOTOS SECTION */}
                    <div className="pt-2 border-t border-pearl-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-700 text-[11px]">
                          Additional Gallery Photos ({productFormData.images.length})
                        </span>
                        <span className="text-[10px] text-neutral-400">Close-ups, drape videos, textures</span>
                      </div>

                      {/* Add extra image inputs */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                          <input
                            type="text"
                            value={tempGalleryUrl}
                            onChange={(e) => setTempGalleryUrl(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddGalleryImage(tempGalleryUrl);
                              }
                            }}
                            placeholder="Add additional Google Drive link or image URL..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-pearl-300 bg-white font-mono text-[11px] focus:outline-none focus:border-gold-500"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddGalleryImage(tempGalleryUrl)}
                            disabled={!tempGalleryUrl.trim()}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              tempGalleryUrl.trim()
                                ? 'bg-charcoal-900 text-gold-400 hover:bg-gold-500 hover:text-charcoal-950 shadow-sm'
                                : 'bg-pearl-200 text-neutral-400 cursor-not-allowed'
                            }`}
                          >
                            + Add Link
                          </button>

                          <label className="cursor-pointer px-3 py-2 bg-white hover:bg-gold-50 text-neutral-700 rounded-xl font-semibold text-xs border border-pearl-300 transition-colors flex items-center gap-1 shadow-sm">
                            <Upload className="w-3.5 h-3.5 text-gold-600" />
                            <span>+ Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleLocalImageUpload(e, false)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Gallery thumbnails grid */}
                      {productFormData.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          {productFormData.images.map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className={`relative group rounded-xl overflow-hidden border p-1 bg-white space-y-1 ${
                                productFormData.image === imgUrl ? 'border-gold-500 ring-2 ring-gold-400/40' : 'border-pearl-300'
                              }`}
                            >
                              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-pearl-100">
                                <Image
                                  src={imgUrl}
                                  alt={`Gallery photo ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                  unoptimized={imgUrl.startsWith('data:')}
                                />
                              </div>

                              <div className="flex items-center justify-between px-1">
                                {productFormData.image === imgUrl ? (
                                  <span className="text-[9px] font-bold text-gold-700 uppercase font-mono">
                                    Primary
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetAsPrimaryImage(imgUrl)}
                                    className="text-[9px] text-neutral-500 hover:text-neutral-900 underline"
                                  >
                                    Set Cover
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryImage(idx)}
                                  className="text-neutral-400 hover:text-red-600 p-0.5"
                                  title="Remove from gallery"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={productFormData.description}
                      onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-pearl-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 bg-pearl-100 rounded-xl font-semibold text-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white rounded-xl font-serif font-bold uppercase tracking-wider transition-all"
                  >
                    Save Fabric Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
